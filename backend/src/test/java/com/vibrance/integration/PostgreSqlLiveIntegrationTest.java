package com.vibrance.integration;

import com.vibrance.entity.Booking;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.repository.BookingRepository;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.UserRepository;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-End PostgreSQL Integration Tests.
 * Runs directly against real PostgreSQL 18 with Flyway migrations enabled.
 * Validates database-level constraints:
 *   1. Flyway migration baseline through V5
 *   2. Partial unique index (uq_active_seat_booking) preventing simultaneous bookings
 *   3. Re-booking allowance when prior booking is cancelled
 *   4. Atomic conditional check-in collision protection
 *   5. Strict 2PL row-level locking (SELECT ... FOR UPDATE)
 */
@SpringBootTest
@ActiveProfiles("postgres-test")
public class PostgreSqlLiveIntegrationTest {

    @Autowired
    private Flyway flyway;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private Event testEvent;
    private Seat testSeat;
    private User testStudent;
    private User testStaff;
    private final List<UUID> createdBookingIds = new ArrayList<>();

    @BeforeEach
    void setUp() {
        testEvent = eventRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No events in PostgreSQL test database"));

        testStudent = userRepository.findByRegNumber("RA2111003010142")
                .orElseThrow(() -> new IllegalStateException("Test student not found in PostgreSQL"));

        testStaff = userRepository.findByRegNumber("STF-GATE-04")
                .orElseThrow(() -> new IllegalStateException("Test staff not found in PostgreSQL"));

        // Create an isolated test seat in the database for this run
        testSeat = new Seat(testEvent, "Z", 99, "REGULAR", new BigDecimal("100.00"), "available");
        testSeat = seatRepository.save(testSeat);
    }

    @AfterEach
    void tearDown() {
        // Clean up any bookings created during the test
        for (UUID bookingId : createdBookingIds) {
            try {
                bookingRepository.deleteById(bookingId);
            } catch (Exception ignored) {}
        }
        try {
            seatRepository.delete(testSeat);
        } catch (Exception ignored) {}
    }

    @Test
    @DisplayName("1. PostgreSQL Flyway: All 6 versioned migrations applied and validated")
    void testFlywayMigrations_AppliedCleanlyOnPostgreSql() {
        MigrationInfo[] applied = flyway.info().applied();
        assertTrue(applied.length >= 6, "Flyway should have at least 6 migrations applied on PostgreSQL");

        boolean v4Found = false;
        boolean v5Found = false;
        boolean v6Found = false;
        for (MigrationInfo info : applied) {
            if ("4".equals(info.getVersion().getVersion())) v4Found = true;
            if ("5".equals(info.getVersion().getVersion())) v5Found = true;
            if ("6".equals(info.getVersion().getVersion())) v6Found = true;
        }

        assertTrue(v4Found, "Migration V4 (booking integrity & simulation isolation) must be applied");
        assertTrue(v5Found, "Migration V5 (consistent demo credentials) must be applied");
        assertTrue(v6Found, "Migration V6 (fix audit trigger and widen seat label) must be applied");
    }

    @Test
    @DisplayName("2. PostgreSQL Partial Unique Index: Strictly prohibits double-booking active seats")
    void testPartialUniqueIndex_StrictlyProhibitsDoubleBookingOnPostgreSql() {
        String ref1 = "TEST-REF-A-" + System.currentTimeMillis();
        Booking booking1 = new Booking(
                ref1, testEvent, testSeat, testStudent,
                "Test Student 1", "REG-001", "CSE",
                new BigDecimal("100.00"), "UPI", "{\"qr\":\"valid\"}"
        );
        booking1.setStatus("confirmed");
        booking1.setTicketToken("TOKEN-A-" + UUID.randomUUID().toString().replace("-", ""));
        booking1 = bookingRepository.save(booking1);
        createdBookingIds.add(booking1.getId());

        // Attempt second active booking for the exact same seat
        String ref2 = "TEST-REF-B-" + System.currentTimeMillis();
        Booking booking2 = new Booking(
                ref2, testEvent, testSeat, testStudent,
                "Test Student 2", "REG-002", "ECE",
                new BigDecimal("100.00"), "CAMPUS_CARD", "{\"qr\":\"duplicate\"}"
        );
        booking2.setStatus("confirmed");
        booking2.setTicketToken("TOKEN-B-" + UUID.randomUUID().toString().replace("-", ""));

        // PostgreSQL must enforce uq_active_seat_booking and reject the second insert
        DataIntegrityViolationException ex = assertThrows(
                DataIntegrityViolationException.class,
                () -> bookingRepository.saveAndFlush(booking2)
        );

        assertTrue(
                ex.getMessage().contains("uq_active_seat_booking") ||
                (ex.getCause() != null && ex.getCause().getMessage().contains("uq_active_seat_booking")),
                "PostgreSQL must throw a constraint violation citing uq_active_seat_booking"
        );
    }

    @Test
    @DisplayName("3. PostgreSQL Partial Unique Index: Permits re-booking when prior pass is cancelled")
    void testPartialUniqueIndex_AllowsRebookingWhenPriorBookingCancelled() {
        String ref1 = "TEST-CANCEL-" + System.currentTimeMillis();
        Booking booking1 = new Booking(
                ref1, testEvent, testSeat, testStudent,
                "Student One", "REG-001", "CSE",
                new BigDecimal("100.00"), "UPI", "{\"qr\":\"v1\"}"
        );
        booking1.setStatus("cancelled"); // Cancelled state
        booking1.setTicketToken("TOKEN-C-" + UUID.randomUUID().toString().replace("-", ""));
        booking1 = bookingRepository.saveAndFlush(booking1);
        createdBookingIds.add(booking1.getId());

        // Now place an active booking for the same seat
        String ref2 = "TEST-CONFIRMED-" + System.currentTimeMillis();
        Booking booking2 = new Booking(
                ref2, testEvent, testSeat, testStudent,
                "Student Two", "REG-002", "ECE",
                new BigDecimal("100.00"), "UPI", "{\"qr\":\"v2\"}"
        );
        booking2.setStatus("confirmed");
        booking2.setTicketToken("TOKEN-D-" + UUID.randomUUID().toString().replace("-", ""));

        // Partial unique index WHERE status IN ('confirmed', 'checked_in') must allow this commit!
        Booking savedBooking2 = bookingRepository.saveAndFlush(booking2);
        createdBookingIds.add(savedBooking2.getId());

        assertNotNull(savedBooking2.getId());
        assertEquals("confirmed", savedBooking2.getStatus());
    }

    @Test
    @DisplayName("4. PostgreSQL Atomic Check-In: Prevents race conditions and duplicate entries")
    void testAtomicCheckIn_PreventsConcurrentCheckInRacesOnPostgreSql() {
        String ref = "TEST-GATE-" + System.currentTimeMillis();
        Booking booking = new Booking(
                ref, testEvent, testSeat, testStudent,
                "Attendee", "REG-003", "IT",
                new BigDecimal("100.00"), "UPI", "{\"qr\":\"gate\"}"
        );
        booking.setStatus("confirmed");
        booking.setTicketToken("TOKEN-GATE-" + UUID.randomUUID().toString().replace("-", ""));
        booking = bookingRepository.saveAndFlush(booking);
        createdBookingIds.add(booking.getId());

        UUID bookingId = booking.getId();

        // First gate scan (Tx 1): should transition status to checked_in and affect exactly 1 row
        TransactionTemplate txTemplate = new TransactionTemplate(transactionManager);
        txTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

        Integer firstUpdateCount = txTemplate.execute(status ->
                bookingRepository.atomicCheckIn(bookingId, OffsetDateTime.now(), testStaff)
        );
        assertEquals(1, firstUpdateCount, "First scan must update exactly 1 row in PostgreSQL");

        // Concurrent/subsequent replay scan (Tx 2): WHERE status = 'confirmed' now fails -> 0 rows updated
        Integer duplicateScanCount = txTemplate.execute(status ->
                bookingRepository.atomicCheckIn(bookingId, OffsetDateTime.now(), testStaff)
        );
        assertEquals(0, duplicateScanCount, "Subsequent or race scan must update 0 rows, preventing duplicate admission");

        // Verify state in PostgreSQL
        Booking verified = bookingRepository.findById(bookingId).orElseThrow();
        assertEquals("checked_in", verified.getStatus());
        assertNotNull(verified.getCheckedInAt());
        assertEquals(testStaff.getId(), verified.getCheckedInBy().getId());
    }

    @Test
    @DisplayName("5. PostgreSQL Strict 2PL: Acquires pessimistic write lock within transaction")
    void testPessimisticRowLock_AcquiresExclusiveLockOnPostgreSql() {
        TransactionTemplate txTemplate = new TransactionTemplate(transactionManager);
        txTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);

        txTemplate.execute(status -> {
            Optional<Seat> lockedSeat = seatRepository.findByIdWithPessimisticLock(testSeat.getId());
            assertTrue(lockedSeat.isPresent(), "Seat must be found with SELECT ... FOR UPDATE");
            assertEquals("available", lockedSeat.get().getStatus());
            return null;
        });
    }
}
