package com.vibrance.repository;

import com.vibrance.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {

    List<Seat> findByEventIdOrderByRowLabelAscSeatNumberAsc(UUID eventId);

    Optional<Seat> findByEventIdAndRowLabelAndSeatNumber(UUID eventId, String rowLabel, Integer seatNumber);

    long countByEventIdAndStatus(UUID eventId, String status);

    // Strict Two-Phase Locking (2PL): Pessimistic Write Lock (SELECT ... FOR UPDATE)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Seat s WHERE s.id = :id")
    Optional<Seat> findByIdWithPessimisticLock(@Param("id") UUID id);

    @Query("SELECT s FROM Seat s WHERE s.status = 'locked' AND s.lockExpiresAt < :now")
    List<Seat> findExpiredLocks(@Param("now") OffsetDateTime now);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'available', s.lockedBy = null, s.lockExpiresAt = null, s.updatedAt = :now WHERE s.status = 'locked' AND s.lockExpiresAt < :now")
    int releaseExpiredLocks(@Param("now") OffsetDateTime now);
}
