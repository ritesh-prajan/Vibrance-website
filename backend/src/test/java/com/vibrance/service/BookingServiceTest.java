package com.vibrance.service;

import com.vibrance.dto.BookingDTO;
import com.vibrance.entity.Booking;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.exception.BadRequestException;
import com.vibrance.exception.ConflictException;
import com.vibrance.repository.BookingRepository;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private BookingService bookingService;

    private UUID eventId;
    private UUID seatId;
    private UUID userId;
    private Event event;
    private Seat seat;
    private User user;
    private BookingDTO.CreateBookingRequest request;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        seatId = UUID.randomUUID();
        userId = UUID.randomUUID();

        event = new Event("evt-edm", "SUNBURN CAMPUS", "EDM", "Lost Stories", "Thu, Sep 3", "8:00 PM", "Sunken Garden", new BigDecimal("499.00"), 48);
        event.setId(eventId);

        seat = new Seat(event, "B", 4, "GOLD", new BigDecimal("499.00"), "available");
        seat.setId(seatId);

        user = new User("RA2111008010312", "Rohan Verma", "rohan@vibrance.edu", "hash", "student", "Mech", "4th Year", "rohan");
        user.setId(userId);

        request = new BookingDTO.CreateBookingRequest();
        request.setEventId(eventId);
        request.setSeatId(seatId);
        request.setName("Rohan Verma");
        request.setRegNumber("RA2111008010312");
        request.setDepartment("Mechanical Engineering");
        request.setPaymentMethod("UPI");
    }

    @Test
    @DisplayName("Successfully create booking when seat is available")
    void createBooking_Success_WhenAvailable() {
        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
            Booking b = i.getArgument(0);
            b.setId(UUID.randomUUID());
            b.setBookedAt(OffsetDateTime.now());
            return b;
        });

        BookingDTO.BookingResponseDTO response = bookingService.createBooking(request, userId);

        assertNotNull(response);
        assertNotNull(response.getBookingRef());
        assertTrue(response.getBookingRef().startsWith("VIB26-"));
        assertEquals("booked", seat.getStatus());
        verify(seatRepository).save(seat);
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    @DisplayName("Abort transaction when seat was booked by concurrent transaction")
    void createBooking_ThrowsConflict_WhenAlreadyBooked() {
        seat.setStatus("booked");
        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ConflictException ex = assertThrows(ConflictException.class, () ->
                bookingService.createBooking(request, userId)
        );

        assertTrue(ex.getMessage().contains("booked"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Abort transaction when seat is locked by a different user with valid TTL")
    void createBooking_ThrowsConflict_WhenLockedByAnotherUser() {
        User otherUser = new User("OTHER123", "Other Student", "other@vibrance.edu", "hash", "student", "CSE", "1st Year", "other");
        otherUser.setId(UUID.randomUUID());

        seat.setStatus("locked");
        seat.setLockedBy(otherUser);
        seat.setLockExpiresAt(OffsetDateTime.now().plusMinutes(3));

        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ConflictException ex = assertThrows(ConflictException.class, () ->
                bookingService.createBooking(request, userId)
        );

        assertTrue(ex.getMessage().contains("currently locked"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Allow booking when seat lock held by the same user")
    void createBooking_Success_WhenLockHeldBySameUser() {
        seat.setStatus("locked");
        seat.setLockedBy(user);
        seat.setLockExpiresAt(OffsetDateTime.now().plusMinutes(2));

        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
            Booking b = i.getArgument(0);
            b.setId(UUID.randomUUID());
            b.setBookedAt(OffsetDateTime.now());
            return b;
        });

        BookingDTO.BookingResponseDTO response = bookingService.createBooking(request, userId);

        assertNotNull(response);
        assertEquals("booked", seat.getStatus());
        assertNull(seat.getLockedBy());
    }

    @Test
    @DisplayName("Cancel booking releases seat back to available inventory")
    void cancelBooking_Success_ReleasesSeat() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking("VIB26-EDM-999", event, seat, user, "Rohan Verma", "RA2111008010312", "Mech", new BigDecimal("499.00"), "UPI", "qr");
        booking.setId(bookingId);
        booking.setStatus("confirmed");
        seat.setStatus("booked");

        when(bookingRepository.findByIdWithPessimisticLock(bookingId)).thenReturn(Optional.of(booking));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(bookingRepository.existsActiveBookingForSeat(seatId)).thenReturn(false);

        bookingService.cancelBooking(bookingId, userId);

        assertEquals("cancelled", booking.getStatus());
        assertEquals("available", seat.getStatus());
        assertNull(seat.getLockedBy());
        verify(bookingRepository).save(booking);
        verify(seatRepository).save(seat);
    }

    @Test
    @DisplayName("Cancel booking rejected when attendee is not booking owner")
    void cancelBooking_RejectsUnauthorizedUser() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking("VIB26-EDM-999", event, seat, user, "Rohan Verma", "RA2111008010312", "Mech", new BigDecimal("499.00"), "UPI", "qr");
        booking.setId(bookingId);
        booking.setStatus("confirmed");

        UUID unauthorizedUserId = UUID.randomUUID();
        User attacker = new User("ATTACKER", "Attacker", "att@hack.fest", "hash", "student", "CSE", "1st Year", "att");
        attacker.setId(unauthorizedUserId);

        when(bookingRepository.findByIdWithPessimisticLock(bookingId)).thenReturn(Optional.of(booking));
        when(userRepository.findById(unauthorizedUserId)).thenReturn(Optional.of(attacker));

        assertThrows(BadRequestException.class, () -> bookingService.cancelBooking(bookingId, unauthorizedUserId));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cancel booking rejected when pass is already checked in")
    void cancelBooking_RejectsCheckedInPass() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking("VIB26-EDM-999", event, seat, user, "Rohan Verma", "RA2111008010312", "Mech", new BigDecimal("499.00"), "UPI", "qr");
        booking.setId(bookingId);
        booking.setStatus("checked_in");

        when(bookingRepository.findByIdWithPessimisticLock(bookingId)).thenReturn(Optional.of(booking));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(ConflictException.class, () -> bookingService.cancelBooking(bookingId, userId));
        verify(bookingRepository, never()).save(any());
    }
}
