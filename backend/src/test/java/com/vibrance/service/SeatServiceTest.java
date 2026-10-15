package com.vibrance.service;

import com.vibrance.dto.SeatDTO;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.exception.ConflictException;
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
class SeatServiceTest {

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private SeatService seatService;

    private UUID seatId;
    private UUID userId;
    private UUID otherUserId;
    private Seat seat;
    private User user;
    private User otherUser;
    private Event event;

    @BeforeEach
    void setUp() {
        seatId = UUID.randomUUID();
        userId = UUID.randomUUID();
        otherUserId = UUID.randomUUID();

        user = new User("RA2111003010142", "Rahul Sharma", "rahul@vibrance.edu", "hash", "student", "CSE", "3rd Year", "rahul");
        user.setId(userId);

        otherUser = new User("RA2111004020088", "Ananya Iyer", "ananya@vibrance.edu", "hash", "student", "ECE", "2nd Year", "ananya");
        otherUser.setId(otherUserId);

        event = new Event("evt-test", "PRO-SHOW TEST", "PRO_SHOW", "Artist", "Tonight", "7:00 PM", "Amphitheatre", new BigDecimal("499.00"), 48);
        event.setId(UUID.randomUUID());

        seat = new Seat(event, "A", 1, "VIP_FRONT", new BigDecimal("499.00"), "available");
        seat.setId(seatId);
    }

    @Test
    @DisplayName("Successfully acquire Strict 2PL lease on available seat")
    void lockSeat_Success_WhenAvailable() {
        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(seatRepository.save(any(Seat.class))).thenAnswer(i -> i.getArgument(0));

        SeatDTO.SeatLockResponse response = seatService.lockSeat(seatId, userId, 180);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("locked", seat.getStatus());
        assertEquals(user, seat.getLockedBy());
        assertNotNull(seat.getLockExpiresAt());
        verify(seatRepository).findByIdWithPessimisticLock(seatId);
        verify(seatRepository).save(seat);
    }

    @Test
    @DisplayName("Reject lock when seat is already permanently booked")
    void lockSeat_Fails_WhenAlreadyBooked() {
        seat.setStatus("booked");
        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ConflictException ex = assertThrows(ConflictException.class, () ->
                seatService.lockSeat(seatId, userId, 120)
        );

        assertTrue(ex.getMessage().contains("already booked"));
        verify(seatRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reject lock when active unexpired lease is held by another user")
    void lockSeat_Fails_WhenHeldByAnotherUser() {
        seat.setStatus("locked");
        seat.setLockedBy(otherUser);
        seat.setLockExpiresAt(OffsetDateTime.now().plusMinutes(5));

        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ConflictException ex = assertThrows(ConflictException.class, () ->
                seatService.lockSeat(seatId, userId, 120)
        );

        assertTrue(ex.getMessage().contains("currently locked"));
        verify(seatRepository, never()).save(any());
    }

    @Test
    @DisplayName("Allow lock takeover when previous lease has expired (TTL timeout)")
    void lockSeat_Success_WhenPreviousLockExpired() {
        seat.setStatus("locked");
        seat.setLockedBy(otherUser);
        seat.setLockExpiresAt(OffsetDateTime.now().minusSeconds(10)); // Expired!

        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(seatRepository.save(any(Seat.class))).thenAnswer(i -> i.getArgument(0));

        SeatDTO.SeatLockResponse response = seatService.lockSeat(seatId, userId, 180);

        assertTrue(response.isSuccess());
        assertEquals("locked", seat.getStatus());
        assertEquals(user, seat.getLockedBy()); // Claimed by new user
    }

    @Test
    @DisplayName("Release seat lease reverts status to available")
    void releaseSeatLock_Success() {
        seat.setStatus("locked");
        seat.setLockedBy(user);
        seat.setLockExpiresAt(OffsetDateTime.now().plusMinutes(2));

        when(seatRepository.findByIdWithPessimisticLock(seatId)).thenReturn(Optional.of(seat));

        seatService.releaseSeatLock(seatId, userId);

        assertEquals("available", seat.getStatus());
        assertNull(seat.getLockedBy());
        assertNull(seat.getLockExpiresAt());
        verify(seatRepository).save(seat);
    }
}
