package com.vibrance.repository;

import com.vibrance.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserIdOrderByBookedAtDesc(UUID userId);
    List<Booking> findByEventIdOrderByBookedAtDesc(UUID eventId);
    Optional<Booking> findByBookingRef(String bookingRef);
    Optional<Booking> findByQrPayload(String qrPayload);
    boolean existsBySeatIdAndStatus(UUID seatId, String status);
    List<Booking> findAllByOrderByBookedAtDesc();
}
