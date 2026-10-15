package com.vibrance.service;

import com.vibrance.dto.ConcurrencyDTO;
import com.vibrance.entity.ConcurrencySimRun;
import com.vibrance.entity.ConcurrencySimTx;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.SimSeat;
import com.vibrance.repository.ConcurrencySimRunRepository;
import com.vibrance.repository.ConcurrencySimTxRepository;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.SimSeatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ConcurrencyService {

    private static final Logger log = LoggerFactory.getLogger(ConcurrencyService.class);

    private final ConcurrencySimRunRepository runRepository;
    private final ConcurrencySimTxRepository txRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final SimSeatRepository simSeatRepository;
    private final PlatformTransactionManager transactionManager;
    private final AuditService auditService;

    public ConcurrencyService(ConcurrencySimRunRepository runRepository,
                              ConcurrencySimTxRepository txRepository,
                              EventRepository eventRepository,
                              SeatRepository seatRepository,
                              SimSeatRepository simSeatRepository,
                              PlatformTransactionManager transactionManager,
                              AuditService auditService) {
        this.runRepository = runRepository;
        this.txRepository = txRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.simSeatRepository = simSeatRepository;
        this.transactionManager = transactionManager;
        this.auditService = auditService;
    }

    public ConcurrencyDTO.ConcurrencyRunResultDTO runSimulation(ConcurrencyDTO.ConcurrencySimRequest req) {
        String strategy = req.getStrategy() != null ? req.getStrategy().toUpperCase() : "TWO_PHASE_LOCKING";
        // Bound concurrency level between 2 and 50 to prevent JVM resource starvation
        int concurrencyLevel = Math.min(Math.max(req.getConcurrencyLevel() != null ? req.getConcurrencyLevel() : 25, 2), 50);

        // 1. Resolve Target Event (read-only reference metadata)
        Event event = null;
        if (req.getTargetEventId() != null) {
            event = eventRepository.findById(req.getTargetEventId()).orElse(null);
        }
        if (event == null) {
            event = eventRepository.findByEventCode("EVT-CYBER26")
                    .orElseGet(() -> eventRepository.findAll().stream().findFirst().orElse(null));
        }

        UUID eventId = event != null ? event.getId() : UUID.randomUUID();
        String eventTitle = event != null ? event.getTitle() : "Vibrance 2026 Sandbox Event";

        String runId = "RUN-" + System.currentTimeMillis() + "-" + strategy.substring(0, Math.min(strategy.length(), 6));
        String targetSeatLabel = "SIM-HOT-01";
        int initialStock = 1; // 1 available high-demand seat under heavy concurrent contention

        // 2. Provision Isolated Simulation Dataset in sim_seats (Never touches genuine event inventory!)
        SimSeat simSeat = new SimSeat(runId, eventTitle, targetSeatLabel, "available");
        simSeat = simSeatRepository.save(simSeat);
        UUID targetSeatId = simSeat.getId();

        List<ConcurrencyDTO.SimulatedTxDTO> txResults = Collections.synchronizedList(new ArrayList<>());
        List<String> dbLogs = Collections.synchronizedList(new ArrayList<>());

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rejectedCount = new AtomicInteger(0);
        AtomicInteger deadlockCount = new AtomicInteger(0);

        dbLogs.add(String.format("[INIT] Simulation %s initialized with %d concurrent worker threads", runId, concurrencyLevel));
        dbLogs.add(String.format("[TARGET] Contention focus: Event '%s' | Isolated Sim Seat: %s (Stock: %d)", eventTitle, targetSeatLabel, initialStock));
        dbLogs.add(String.format("[STRATEGY] Isolation Engine: %s", strategy));

        long startTime = System.currentTimeMillis();
        ExecutorService executor = Executors.newFixedThreadPool(concurrencyLevel);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch completionLatch = new CountDownLatch(concurrencyLevel);

        for (int i = 1; i <= concurrencyLevel; i++) {
            final int clientIndex = i;
            executor.submit(() -> {
                try {
                    latch.await(); // Synchronize all threads to fire simultaneously
                    long txStart = System.currentTimeMillis();
                    String txId = String.format("TX-%03d", clientIndex);
                    String clientId = "client_" + clientIndex;
                    String clientName = "Student_Tester_" + clientIndex;

                    ConcurrencyDTO.SimulatedTxDTO txDto = new ConcurrencyDTO.SimulatedTxDTO();
                    txDto.setTxId(txId);
                    txDto.setClientId(clientId);
                    txDto.setClientName(clientName);
                    txDto.setTimestamp(txStart);

                    if ("NO_LOCKING".equalsIgnoreCase(strategy)) {
                        executeNoLockTransaction(targetSeatId, targetSeatLabel, txDto, successCount, rejectedCount, dbLogs);
                    } else if ("OPTIMISTIC_OCC".equalsIgnoreCase(strategy)) {
                        executeOptimisticOccTransaction(targetSeatId, targetSeatLabel, txDto, successCount, rejectedCount, deadlockCount, dbLogs);
                    } else {
                        // Default: TWO_PHASE_LOCKING (2PL)
                        executeTwoPhaseLockTransaction(targetSeatId, targetSeatLabel, txDto, successCount, rejectedCount, deadlockCount, dbLogs);
                    }

                    txDto.setLatencyMs(System.currentTimeMillis() - txStart);
                    txResults.add(txDto);
                } catch (Exception e) {
                    log.error("Simulation thread failed", e);
                } finally {
                    completionLatch.countDown();
                }
            });
        }

        // Trigger simultaneous start
        latch.countDown();

        try {
            completionLatch.await(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            executor.shutdown();
        }

        long totalDurationMs = System.currentTimeMillis() - startTime;
        boolean overbookingDetected = successCount.get() > initialStock;
        int overbookedSeats = overbookingDetected ? (successCount.get() - initialStock) : 0;
        int finalStock = Math.max(0, initialStock - successCount.get());

        if (overbookingDetected) {
            dbLogs.add(String.format("[CRITICAL_ALERT] ANOMALY DETECTED: %d duplicate bookings committed on Seat %s! (Lost Updates / Overbooking)", overbookedSeats, targetSeatLabel));
        } else {
            dbLogs.add(String.format("[ACID_VERIFIED] SERIALIZABILITY VERIFIED: Exactly %d booking committed. %d collisions safely rejected.", successCount.get(), rejectedCount.get()));
        }
        dbLogs.add(String.format("[COMPLETE] Simulation finalized in %d ms", totalDurationMs));

        // Persist Run & Txs in relational database
        ConcurrencySimRun runEntity = new ConcurrencySimRun();
        runEntity.setRunId(runId);
        runEntity.setStrategy(strategy);
        runEntity.setTargetEvent(event);
        runEntity.setTargetEventTitle(eventTitle);
        runEntity.setConcurrencyLevel(concurrencyLevel);
        runEntity.setSuccessfulCount(successCount.get());
        runEntity.setRejectedCount(rejectedCount.get());
        runEntity.setDeadlockCount(deadlockCount.get());
        runEntity.setInitialStock(initialStock);
        runEntity.setFinalStock(finalStock);
        runEntity.setDurationMs(totalDurationMs);
        runEntity.setOverbookingDetected(overbookingDetected);
        runEntity.setOverbookedSeats(overbookedSeats);
        runEntity.setExecutedAt(OffsetDateTime.now());

        ConcurrencySimRun savedRun = runRepository.save(runEntity);

        List<ConcurrencySimTx> txEntities = txResults.stream().map(dto -> {
            ConcurrencySimTx tx = new ConcurrencySimTx();
            tx.setRun(savedRun);
            tx.setTxId(dto.getTxId());
            tx.setClientId(dto.getClientId());
            tx.setClientName(dto.getClientName());
            tx.setStatus(dto.getStatus());
            tx.setCurrentStep(dto.getCurrentStep());
            tx.setLatencyMs(dto.getLatencyMs());
            tx.setSeatClaimed(dto.getSeatClaimed());
            tx.setMessage(dto.getMessage());
            tx.setExecutedAt(OffsetDateTime.now());
            return tx;
        }).collect(Collectors.toList());

        txRepository.saveAll(txEntities);

        // Record relational audit log for the benchmark run
        auditService.recordLog("CONCURRENCY_BENCHMARK", eventId, eventTitle, targetSeatLabel,
                "SimEngine", "DAEMON",
                overbookingDetected ? "OVERBOOKING_DETECTED" : "ACID_VERIFIED",
                strategy,
                String.format("Benchmark %s (%s): %d concurrent txs, %d committed, %d rejected, overbooked: %d",
                        runId, strategy, concurrencyLevel, successCount.get(), rejectedCount.get(), overbookedSeats));

        // Build Response DTO
        ConcurrencyDTO.ConcurrencyRunResultDTO result = new ConcurrencyDTO.ConcurrencyRunResultDTO();
        result.setRunId(runId);
        result.setStrategy(strategy);
        result.setTargetEventId(eventId);
        result.setTargetEventTitle(eventTitle);
        result.setConcurrencyLevel(concurrencyLevel);
        result.setSuccessfulCount(successCount.get());
        result.setRejectedCount(rejectedCount.get());
        result.setDeadlockCount(deadlockCount.get());
        result.setInitialStock(initialStock);
        result.setFinalStock(finalStock);
        result.setDurationMs(totalDurationMs);
        result.setOverbookingDetected(overbookingDetected);
        result.setOverbookedSeats(overbookedSeats);
        result.setTransactions(txResults);
        result.setDbLogs(dbLogs);

        return result;
    }

    /**
     * Uncontrolled Concurrent Access (NO_LOCKING).
     * Simulates client race condition without pessimistic or optimistic locks on isolated SimSeat.
     * Demonstrates lost updates and overbooking in relational DBMS without corrupting real inventory.
     */
    private void executeNoLockTransaction(UUID seatId, String seatLabel, ConcurrencyDTO.SimulatedTxDTO txDto,
                                          AtomicInteger successCount, AtomicInteger rejectedCount, List<String> dbLogs) {
        try {
            // Step 1: Read without locks
            SimSeat seat = simSeatRepository.findById(seatId).orElse(null);
            txDto.setCurrentStep("READ_UNCOMMITTED");

            // Step 2: Race condition delay (simulates network latency & concurrent context switch)
            Thread.sleep(15 + (int) (Math.random() * 20));

            // Step 3: Unsafe Blind Write on isolated simulation record
            if (seat != null) {
                simSeatRepository.executeUnsafeNoLockSimulationBooking(seatId, txDto.getClientName());
                int currentSuccess = successCount.incrementAndGet();
                txDto.setStatus("COMMITTED");
                txDto.setCurrentStep("UNSAFE_WRITE_COMMITTED");
                txDto.setSeatClaimed(seatLabel);
                txDto.setMessage("Simulation pass confirmed without lock validation");

                if (currentSuccess > 1) {
                    dbLogs.add(String.format("[%s] OVERBOOKING ANOMALY: Overwrote simulation seat %s without concurrency check!", txDto.getTxId(), seatLabel));
                } else {
                    dbLogs.add(String.format("[%s] Unchecked write committed on simulation seat %s", txDto.getTxId(), seatLabel));
                }
            } else {
                rejectedCount.incrementAndGet();
                txDto.setStatus("REJECTED");
                txDto.setMessage("Simulation seat not found");
            }
        } catch (Exception e) {
            rejectedCount.incrementAndGet();
            txDto.setStatus("REJECTED");
            txDto.setMessage(e.getMessage());
        }
    }

    /**
     * Strict Two-Phase Locking (2PL).
     * Acquires PESSIMISTIC_WRITE lock (SELECT FOR UPDATE) on SimSeat within an isolated database transaction.
     * Ensures strict serializability and prevents all lost updates / overbooking.
     */
    private void executeTwoPhaseLockTransaction(UUID seatId, String seatLabel, ConcurrencyDTO.SimulatedTxDTO txDto,
                                                AtomicInteger successCount, AtomicInteger rejectedCount,
                                                AtomicInteger deadlockCount, List<String> dbLogs) {
        TransactionTemplate txTemplate = new TransactionTemplate(transactionManager);
        txTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        txTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

        try {
            Boolean committed = txTemplate.execute(status -> {
                txDto.setCurrentStep("ACQUIRING_PESSIMISTIC_LOCK");
                dbLogs.add(String.format("[%s] Executing: SELECT * FROM sim_seats WHERE id = '%s' FOR UPDATE", txDto.getTxId(), seatId));

                // 2PL Phase 1: Growing Phase (Acquire exclusive lock on simulation seat row)
                Optional<SimSeat> seatOpt = simSeatRepository.findByIdWithPessimisticLock(seatId);
                if (seatOpt.isEmpty()) {
                    return false;
                }

                SimSeat seat = seatOpt.get();
                // Check if already booked
                if ("booked".equalsIgnoreCase(seat.getStatus())) {
                    txDto.setCurrentStep("LOCK_RELEASED_COLLISION");
                    dbLogs.add(String.format("[%s] Collision: Simulation seat %s is already claimed. Transaction rolled back.", txDto.getTxId(), seatLabel));
                    return false;
                }

                // First transaction to acquire lock successfully claims seat
                seat.setStatus("booked");
                seat.setClaimedBy(txDto.getClientName());
                simSeatRepository.saveAndFlush(seat);
                return true;
            });

            if (Boolean.TRUE.equals(committed)) {
                successCount.incrementAndGet();
                txDto.setStatus("COMMITTED");
                txDto.setCurrentStep("EXCLUSIVE_LOCK_COMMITTED");
                txDto.setSeatClaimed(seatLabel);
                txDto.setMessage("Acquired row-level lock and booked simulation seat safely");
                dbLogs.add(String.format("[%s] Lock acquired. UPDATE sim_seats SET status = 'booked' -> COMMIT", txDto.getTxId()));
            } else {
                rejectedCount.incrementAndGet();
                txDto.setStatus("REJECTED");
                txDto.setMessage("Simulation seat already claimed or unavailable");
            }
        } catch (org.springframework.dao.PessimisticLockingFailureException e) {
            deadlockCount.incrementAndGet();
            rejectedCount.incrementAndGet();
            txDto.setStatus("DEADLOCK");
            txDto.setCurrentStep("DEADLOCK_DETECTED");
            txDto.setMessage("PostgreSQL deadlock detected: victim transaction aborted");
            dbLogs.add(String.format("[%s] Deadlock detected by PostgreSQL lock manager: aborted", txDto.getTxId()));
        } catch (Exception e) {
            rejectedCount.incrementAndGet();
            txDto.setStatus("REJECTED");
            txDto.setMessage(e.getMessage());
        }
    }

    /**
     * Optimistic Concurrency Control (OCC).
     * Validates JPA entity @Version before commit on SimSeat.
     */
    private void executeOptimisticOccTransaction(UUID seatId, String seatLabel, ConcurrencyDTO.SimulatedTxDTO txDto,
                                                 AtomicInteger successCount, AtomicInteger rejectedCount,
                                                 AtomicInteger deadlockCount, List<String> dbLogs) {
        TransactionTemplate txTemplate = new TransactionTemplate(transactionManager);
        txTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        txTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

        try {
            Boolean committed = txTemplate.execute(status -> {
                txDto.setCurrentStep("OCC_READ_PHASE");
                SimSeat seat = simSeatRepository.findById(seatId).orElse(null);
                if (seat == null || "booked".equalsIgnoreCase(seat.getStatus())) {
                    return false;
                }

                // Small pause to guarantee concurrent contenders read the same initial version
                try {
                    Thread.sleep(10 + (int) (Math.random() * 15));
                } catch (InterruptedException ignored) {}

                // OCC Validation & Write Phase
                txDto.setCurrentStep("OCC_VALIDATION_PHASE");
                seat.setStatus("booked");
                seat.setClaimedBy(txDto.getClientName());
                simSeatRepository.saveAndFlush(seat); // Throws optimistic lock exception on version conflict
                return true;
            });

            if (Boolean.TRUE.equals(committed)) {
                successCount.incrementAndGet();
                txDto.setStatus("COMMITTED");
                txDto.setCurrentStep("OCC_WRITE_COMMITTED");
                txDto.setSeatClaimed(seatLabel);
                txDto.setMessage("Version verified: commit successful");
                dbLogs.add(String.format("[%s] OCC Validation passed. Committed.", txDto.getTxId()));
            } else {
                rejectedCount.incrementAndGet();
                txDto.setStatus("REJECTED");
                txDto.setMessage("Simulation seat already taken");
            }
        } catch (org.springframework.dao.OptimisticLockingFailureException | jakarta.persistence.OptimisticLockException e) {
            rejectedCount.incrementAndGet();
            txDto.setStatus("REJECTED");
            txDto.setCurrentStep("OCC_VERSION_MISMATCH_ABORT");
            txDto.setMessage("Optimistic lock failure: version changed by concurrent transaction");
            dbLogs.add(String.format("[%s] OCC Validation failed: Entity version conflict. Rollback.", txDto.getTxId()));
        } catch (Exception e) {
            rejectedCount.incrementAndGet();
            txDto.setStatus("REJECTED");
            txDto.setMessage(e.getMessage());
        }
    }

    public ConcurrencyDTO.SideBySideResultDTO runSideBySideSimulation(ConcurrencyDTO.SideBySideSimRequest req) {
        ConcurrencyDTO.ConcurrencySimRequest noLockReq = new ConcurrencyDTO.ConcurrencySimRequest();
        noLockReq.setStrategy("NO_LOCKING");
        noLockReq.setConcurrencyLevel(req.getConcurrencyLevel() != null ? req.getConcurrencyLevel() : 25);
        noLockReq.setTargetEventId(req.getTargetEventId());

        ConcurrencyDTO.ConcurrencyRunResultDTO noLockResult = runSimulation(noLockReq);

        ConcurrencyDTO.ConcurrencySimRequest twoPlReq = new ConcurrencyDTO.ConcurrencySimRequest();
        twoPlReq.setStrategy("TWO_PHASE_LOCKING");
        twoPlReq.setConcurrencyLevel(req.getConcurrencyLevel() != null ? req.getConcurrencyLevel() : 25);
        twoPlReq.setTargetEventId(req.getTargetEventId());

        ConcurrencyDTO.ConcurrencyRunResultDTO twoPlResult = runSimulation(twoPlReq);

        return new ConcurrencyDTO.SideBySideResultDTO(noLockResult, twoPlResult);
    }

    public List<ConcurrencySimRun> getAllSimRuns() {
        return runRepository.findAllByOrderByExecutedAtDesc();
    }
}
