package com.vibrance.repository;

import com.vibrance.entity.Booking;
import com.vibrance.entity.User;
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
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserIdOrderByBookedAtDesc(UUID userId);
    List<Booking> findByEventIdOrderByBookedAtDesc(UUID eventId);
    Optional<Booking> findByBookingRef(String bookingRef);
    Optional<Booking> findByQrPayload(String qrPayload);
    Optional<Booking> findByTicketToken(String ticketToken);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.seat.id = :seatId AND b.status IN ('confirmed', 'checked_in')")
    boolean existsActiveBookingForSeat(@Param("seatId") UUID seatId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findByIdWithPessimisticLock(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Booking b SET b.status = 'checked_in', b.checkedInAt = :now, b.checkedInBy = :staff WHERE b.id = :id AND b.status = 'confirmed'")
    int atomicCheckIn(@Param("id") UUID id, @Param("now") OffsetDateTime now, @Param("staff") User staff);

    List<Booking> findAllByOrderByBookedAtDesc();
}
