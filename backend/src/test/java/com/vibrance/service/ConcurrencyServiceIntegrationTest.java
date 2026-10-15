package com.vibrance.service;

import com.vibrance.dto.ConcurrencyDTO;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.repository.ConcurrencySimRunRepository;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.SimSeatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ConcurrencyServiceIntegrationTest {

    @Autowired
    private ConcurrencyService concurrencyService;

    @Autowired
    private SimSeatRepository simSeatRepository;

    @Autowired
    private ConcurrencySimRunRepository simRunRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    private Event testEvent;

    @BeforeEach
    void setUp() {
        if (eventRepository.findByEventCode("EVT-CYBER26").isEmpty()) {
            Event event = new Event(
                    "EVT-CYBER26",
                    "CyberQuest Hackathon 2026",
                    "TECHNICAL",
                    "Dr. K. S. Ramanujam",
                    "Tomorrow",
                    "09:00 AM",
                    "Tech Park Auditorium",
                    new BigDecimal("199.00"),
                    50
            );
            testEvent = eventRepository.save(event);

            Seat realSeat = new Seat(testEvent, "A", 1, "VIP_FRONT", new BigDecimal("199.00"), "available");
            seatRepository.save(realSeat);
        } else {
            testEvent = eventRepository.findByEventCode("EVT-CYBER26").get();
        }
    }

    @Test
    @DisplayName("Strict 2PL Simulation: Exactly one winner acquires lock, remainder rejected, 0 overbooking")
    void testStrict2PLSimulation_GuaranteesSingleWinner() {
        long realSeatCountBefore = seatRepository.count();

        ConcurrencyDTO.ConcurrencySimRequest req = new ConcurrencyDTO.ConcurrencySimRequest();
        req.setStrategy("TWO_PHASE_LOCKING");
        req.setConcurrencyLevel(8);
        req.setTargetEventId(testEvent.getId());

        ConcurrencyDTO.ConcurrencyRunResultDTO result = concurrencyService.runSimulation(req);

        assertNotNull(result);
        assertEquals(8, result.getConcurrencyLevel());
        assertEquals(1, result.getSuccessfulCount(), "Strict 2PL should serialize access and permit exactly 1 winner");
        assertEquals(7, result.getRejectedCount(), "Remaining 7 contending transactions should be rejected or timed out");
        assertFalse(Boolean.TRUE.equals(result.getOverbookingDetected()), "Strict 2PL must mathematically guarantee no overbooking");
        assertEquals(0, result.getOverbookedSeats());

        // Verify simulation run record was saved
        assertTrue(simRunRepository.findByRunId(result.getRunId()).isPresent());

        // Verify genuine seat inventory in 'seats' table is strictly unmutated
        long realSeatCountAfter = seatRepository.count();
        assertEquals(realSeatCountBefore, realSeatCountAfter, "Simulation must never mutate genuine inventory in 'seats'");
    }

    @Test
    @DisplayName("OCC Simulation: Optimistic check permits single committer, concurrent modifications conflict")
    void testOptimisticOCCSimulation_RejectsConcurrentMutations() {
        ConcurrencyDTO.ConcurrencySimRequest req = new ConcurrencyDTO.ConcurrencySimRequest();
        req.setStrategy("OPTIMISTIC_OCC");
        req.setConcurrencyLevel(6);
        req.setTargetEventId(testEvent.getId());

        ConcurrencyDTO.ConcurrencyRunResultDTO result = concurrencyService.runSimulation(req);

        assertNotNull(result);
        assertEquals(6, result.getConcurrencyLevel());
        assertEquals(1, result.getSuccessfulCount(), "OCC should commit the first valid transaction");
        assertEquals(5, result.getRejectedCount(), "Concurrent version mismatches should be aborted");
        assertFalse(Boolean.TRUE.equals(result.getOverbookingDetected()), "OCC must prevent double booking via row version checks");
    }

    @Test
    @DisplayName("Side-by-side benchmark: Executes comparative isolation runs against sim_seats")
    void testSideBySideBenchmark_ProducesComparativeMetrics() {
        ConcurrencyDTO.SideBySideSimRequest req = new ConcurrencyDTO.SideBySideSimRequest();
        req.setConcurrencyLevel(5);
        req.setTargetEventId(testEvent.getId());

        ConcurrencyDTO.SideBySideResultDTO sbs = concurrencyService.runSideBySideSimulation(req);

        assertNotNull(sbs);
        assertNotNull(sbs.getTwoPlResult());
        assertNotNull(sbs.getNoLockResult());

        assertEquals("TWO_PHASE_LOCKING", sbs.getTwoPlResult().getStrategy());
        assertEquals(1, sbs.getTwoPlResult().getSuccessfulCount());
        assertFalse(Boolean.TRUE.equals(sbs.getTwoPlResult().getOverbookingDetected()));

        assertEquals("NO_LOCKING", sbs.getNoLockResult().getStrategy());
    }

    @Test
    @DisplayName("Data Isolation: sim_seats records are populated while seats table remains pristine")
    void testDataIsolation_NeverTouchesGenuineSeats() {
        long realSeatsCountBefore = seatRepository.count();
        long simSeatsCountBefore = simSeatRepository.count();

        ConcurrencyDTO.ConcurrencySimRequest req = new ConcurrencyDTO.ConcurrencySimRequest();
        req.setStrategy("TWO_PHASE_LOCKING");
        req.setConcurrencyLevel(4);

        concurrencyService.runSimulation(req);

        long realSeatsCountAfter = seatRepository.count();
        long simSeatsCountAfter = simSeatRepository.count();

        assertEquals(realSeatsCountBefore, realSeatsCountAfter, "Genuine seats table must not change");
        assertEquals(simSeatsCountBefore + 1, simSeatsCountAfter, "sim_seats table must record the benchmark seat");
    }
}
