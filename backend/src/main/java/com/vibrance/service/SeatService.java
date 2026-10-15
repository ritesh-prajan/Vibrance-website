package com.vibrance.service;

import com.vibrance.dto.SeatDTO;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.exception.ConflictException;
import com.vibrance.exception.ResourceNotFoundException;
import com.vibrance.exception.UnauthorizedException;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private static final Logger log = LoggerFactory.getLogger(SeatService.class);

    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public SeatService(SeatRepository seatRepository,
                       UserRepository userRepository,
                       AuditService auditService) {
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<SeatDTO.SeatResponseDTO> getSeatsForEvent(UUID eventId) {
        OffsetDateTime now = OffsetDateTime.now();
        return seatRepository.findByEventIdOrderByRowLabelAscSeatNumberAsc(eventId)
                .stream()
                .map(seat -> toDTO(seat, now))
                .collect(Collectors.toList());
    }

    /**
     * Strict Two-Phase Locking (2PL) seat reservation hold.
     * Uses PESSIMISTIC_WRITE (SELECT ... FOR UPDATE) inside a SERIALIZABLE/READ_COMMITTED transaction.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SeatDTO.SeatLockResponse lockSeat(UUID seatId, UUID userId, int leaseSeconds) {
        OffsetDateTime now = OffsetDateTime.now();

        // 1. Acquire exclusive lock on row
        Seat seat = seatRepository.findByIdWithPessimisticLock(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));

        if (userId == null) {
            throw new UnauthorizedException("User must be authenticated to reserve or lock seats.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        String seatCode = seat.getRowLabel() + seat.getSeatNumber();
        String eventTitle = seat.getEvent() != null ? seat.getEvent().getTitle() : "Event";
        UUID eventId = seat.getEvent() != null ? seat.getEvent().getId() : null;

        // 2. Check if already permanently booked
        if ("booked".equalsIgnoreCase(seat.getStatus())) {
            auditService.recordLog("SEAT_LOCK_REJECTED", eventId, eventTitle, seatCode,
                    user != null ? user.getName() : "Anonymous",
                    user != null ? user.getRegNumber() : "ANON",
                    "CONFLICT", "2PL_PESSIMISTIC_WRITE", "Seat is already booked by another attendee");
            throw new ConflictException("Seat " + seatCode + " is already booked by another attendee.");
        }

        // 3. Check active lock hold
        if ("locked".equalsIgnoreCase(seat.getStatus())) {
            boolean lockExpired = seat.getLockExpiresAt() != null && seat.getLockExpiresAt().isBefore(now);
            boolean lockedBySameUser = user != null && seat.getLockedBy() != null && seat.getLockedBy().getId().equals(user.getId());

            if (!lockExpired && !lockedBySameUser) {
                auditService.recordLog("SEAT_LOCK_REJECTED", eventId, eventTitle, seatCode,
                        user != null ? user.getName() : "Anonymous",
                        user != null ? user.getRegNumber() : "ANON",
                        "CONTENTION_LOCKED", "2PL_PESSIMISTIC_WRITE", "Seat holds active lease by another client");
                throw new ConflictException("Seat " + seatCode + " is currently locked by another student.");
            }
        }

        // 4. Grant Lease
        OffsetDateTime expiresAt = now.plusSeconds(leaseSeconds > 0 ? leaseSeconds : 120);
        seat.setStatus("locked");
        seat.setLockedBy(user);
        seat.setLockExpiresAt(expiresAt);

        Seat savedSeat = seatRepository.save(seat);

        auditService.recordLog("SEAT_LOCK_ACQUIRED", eventId, eventTitle, seatCode,
                user != null ? user.getName() : "Anonymous",
                user != null ? user.getRegNumber() : "ANON",
                "SUCCESS", "2PL_PESSIMISTIC_WRITE", "Acquired " + leaseSeconds + "s lease");

        int remainingSeconds = (int) java.time.Duration.between(now, expiresAt).getSeconds();
        return new SeatDTO.SeatLockResponse(
                true,
                "Seat " + seatCode + " locked for " + leaseSeconds + "s",
                toDTO(savedSeat, now),
                expiresAt.toInstant().toEpochMilli(),
                remainingSeconds
        );
    }

    /**
     * Release an active lock lease when student unselects or navigates away.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void releaseSeatLock(UUID seatId, UUID userId) {
        Seat seat = seatRepository.findByIdWithPessimisticLock(seatId).orElse(null);
        if (seat == null) return;

        // Only release if seat is currently locked and not booked
        if ("locked".equalsIgnoreCase(seat.getStatus())) {
            boolean canRelease = (userId == null)
                    || (seat.getLockedBy() == null)
                    || (seat.getLockedBy().getId().equals(userId));

            if (canRelease) {
                seat.setStatus("available");
                seat.setLockedBy(null);
                seat.setLockExpiresAt(null);
                seatRepository.save(seat);

                String seatCode = seat.getRowLabel() + seat.getSeatNumber();
                String eventTitle = seat.getEvent() != null ? seat.getEvent().getTitle() : "Event";
                UUID eventId = seat.getEvent() != null ? seat.getEvent().getId() : null;

                auditService.recordLog("SEAT_LOCK_RELEASED", eventId, eventTitle, seatCode,
                        "System/User", "N/A", "RELEASED", "2PL_STRICT", "Seat lock manually or cleanly released");
            }
        }
    }

    /**
     * Periodic background task to purge expired seat locks (recovering dead locks).
     */
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void cleanupExpiredLocks() {
        OffsetDateTime now = OffsetDateTime.now();
        int released = seatRepository.releaseExpiredLocks(now);
        if (released > 0) {
            log.info("DBMS TTL Sweeper: Cleaned up and released {} expired seat locks", released);
            auditService.recordLog("TTL_EXPIRED_SWEEP", null, "System Sweeper", "BATCH",
                    "DBMS_CRON", "DAEMON", "CLEARED", "2PL_TTL", "Purged " + released + " expired locks");
        }
    }

    public SeatDTO.SeatResponseDTO toDTO(Seat seat, OffsetDateTime now) {
        if (seat == null) return null;
        SeatDTO.SeatResponseDTO dto = new SeatDTO.SeatResponseDTO();
        dto.setId(seat.getId());
        dto.setEventId(seat.getEvent() != null ? seat.getEvent().getId() : null);
        dto.setRow(seat.getRowLabel());
        dto.setNumber(seat.getSeatNumber());
        dto.setCategory(seat.getCategory());
        dto.setPrice(seat.getPrice());
        dto.setVersion(seat.getVersion());

        // Check if dynamic TTL lease expired
        boolean isExpired = (seat.getLockExpiresAt() != null && seat.getLockExpiresAt().isBefore(now));
        if ("locked".equalsIgnoreCase(seat.getStatus()) && isExpired) {
            dto.setStatus("available");
            dto.setLockedBy(null);
            dto.setLockExpiresAt(null);
        } else {
            dto.setStatus(seat.getStatus());
            if (seat.getLockedBy() != null) {
                dto.setLockedBy(new SeatDTO.LockedByUserDTO(
                        seat.getLockedBy().getId(),
                        seat.getLockedBy().getName(),
                        seat.getLockedBy().getRegNumber()
                ));
            }
            if (seat.getLockExpiresAt() != null) {
                dto.setLockExpiresAt(seat.getLockExpiresAt().toInstant().toEpochMilli());
            }
        }

        return dto;
    }
}
