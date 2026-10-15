package com.vibrance.service;

import com.vibrance.dto.ScanDTO;
import com.vibrance.entity.Booking;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.repository.BookingRepository;
import com.vibrance.repository.ScanRecordRepository;
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
class ScanServiceTest {

    @Mock
    private ScanRecordRepository scanRecordRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ScanService scanService;

    private UUID staffId;
    private User staff;
    private Booking booking;
    private Event event;
    private Seat seat;

    @BeforeEach
    void setUp() {
        staffId = UUID.randomUUID();
        staff = new User("STF-GATE-04", "Officer Rajesh Menon", "rajesh@vibrance.edu", "hash", "gate_staff", "Main Gate Security", null, "rajesh");
        staff.setId(staffId);

        event = new Event("evt-armaan", "ARMAAN MALIK LIVE", "PRO_SHOW", "Armaan Malik", "Tonight", "7:30 PM", "Amphitheatre", new BigDecimal("699.00"), 48);
        event.setId(UUID.randomUUID());

        seat = new Seat(event, "A", 1, "VIP_FRONT", new BigDecimal("699.00"), "booked");

        User attendee = new User("RA2111003010142", "Rahul Sharma", "rahul@vibrance.edu", "hash", "student", "CSE", "3rd Year", "rahul");

        booking = new Booking(
                "VIB26-PRO-984321",
                event,
                seat,
                attendee,
                "Rahul Sharma",
                "RA2111003010142",
                "CSE",
                new BigDecimal("699.00"),
                "UPI",
                "VIBRANCE26-TICKET-VIB26-PRO-984321"
        );
        booking.setId(UUID.randomUUID());
        booking.setStatus("confirmed");
    }

    @Test
    @DisplayName("Verify valid ticket checks in attendee successfully")
    void verifyTicket_Success_WhenValid() {
        when(userRepository.findById(staffId)).thenReturn(Optional.of(staff));
        when(bookingRepository.findByBookingRef("VIB26-PRO-984321")).thenReturn(Optional.of(booking));

        ScanDTO.ScanResponseDTO response = scanService.verifyAndCheckInTicket("VIB26-PRO-984321", staffId);

        assertNotNull(response);
        assertEquals("VALID", response.getResult());
        assertEquals("checked_in", booking.getStatus());
        assertEquals(staff, booking.getCheckedInBy());
        assertNotNull(booking.getCheckedInAt());
        verify(bookingRepository).save(booking);
        verify(scanRecordRepository).save(any());
    }

    @Test
    @DisplayName("Intercept duplicate admission when ticket was already checked in")
    void verifyTicket_Intercepts_AlreadyCheckedIn() {
        booking.setStatus("checked_in");
        booking.setCheckedInAt(OffsetDateTime.now().minusHours(1));
        booking.setCheckedInBy(staff);

        when(userRepository.findById(staffId)).thenReturn(Optional.of(staff));
        when(bookingRepository.findByBookingRef("VIB26-PRO-984321")).thenReturn(Optional.of(booking));

        ScanDTO.ScanResponseDTO response = scanService.verifyAndCheckInTicket("VIB26-PRO-984321", staffId);

        assertNotNull(response);
        assertEquals("ALREADY_USED", response.getResult());
        assertTrue(response.getMessage().contains("previously validated"));
        verify(bookingRepository, never()).save(any());
        verify(scanRecordRepository).save(any());
    }

    @Test
    @DisplayName("Reject ticket that does not exist in registry")
    void verifyTicket_ReturnsInvalid_WhenNotFound() {
        when(userRepository.findById(staffId)).thenReturn(Optional.of(staff));
        when(bookingRepository.findByBookingRef("VIB26-FAKE-000000")).thenReturn(Optional.empty());
        when(bookingRepository.findByQrPayload("VIB26-FAKE-000000")).thenReturn(Optional.empty());

        ScanDTO.ScanResponseDTO response = scanService.verifyAndCheckInTicket("VIB26-FAKE-000000", staffId);

        assertNotNull(response);
        assertEquals("INVALID", response.getResult());
        verify(scanRecordRepository).save(any());
    }
}
