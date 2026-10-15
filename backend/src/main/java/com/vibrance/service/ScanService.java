package com.vibrance.service;

import com.vibrance.dto.ScanDTO;
import com.vibrance.entity.Booking;
import com.vibrance.entity.ScanRecord;
import com.vibrance.entity.User;
import com.vibrance.repository.BookingRepository;
import com.vibrance.repository.ScanRecordRepository;
import com.vibrance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ScanService {

    private final ScanRecordRepository scanRecordRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    private static final Pattern REF_PATTERN = Pattern.compile("VIB26-[A-Z0-9]+");

    public ScanService(ScanRecordRepository scanRecordRepository,
                       BookingRepository bookingRepository,
                       UserRepository userRepository,
                       AuditService auditService) {
        this.scanRecordRepository = scanRecordRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public ScanDTO.ScanResponseDTO verifyAndCheckInTicket(String query, UUID staffUserId) {
        if (query == null || query.trim().isEmpty()) {
            return buildResponse(null, "INVALID", "Empty scan payload", query, null, null, null, null, null, null);
        }

        String rawQuery = query.trim();
        OffsetDateTime now = OffsetDateTime.now();

        // 1. Resolve Staff User
        User staff = null;
        if (staffUserId != null) {
            staff = userRepository.findById(staffUserId).orElse(null);
        }
        if (staff == null) {
            staff = userRepository.findByRegNumber("GATE-01").orElse(null);
        }
        if (staff == null) {
            staff = userRepository.findAll().stream()
                    .filter(u -> "gate_staff".equalsIgnoreCase(u.getRole()))
                    .findFirst()
                    .orElseGet(() -> userRepository.findAll().get(0));
        }

        // 2. Find Booking by QR payload, ref, or UUID
        Booking booking = resolveBooking(rawQuery);

        // Case A: Invalid Ticket (Not found in database)
        if (booking == null) {
            ScanRecord scan = new ScanRecord();
            scan.setQueryPayload(rawQuery);
            scan.setResult("INVALID");
            scan.setStaffUser(staff);
            scan.setMessage("Ticket code not recognized in fest database");
            scan.setScannedAt(now);
            scanRecordRepository.save(scan);

            auditService.recordLog("TICKET_SCAN_FAILED", null, "Unknown", "N/A",
                    staff.getName(), staff.getRegNumber(), "INVALID_QR", "GATE_TELEMETRY",
                    "Scan rejection: Query [" + rawQuery + "] not found in bookings table");

            return buildResponse(scan.getId(), "INVALID", "Ticket code not recognized in festival registry",
                    rawQuery, staff, null, null, null, null, null);
        }

        String eventTitle = booking.getEvent() != null ? booking.getEvent().getTitle() : "Vibrance 2026 Event";
        String seatLabel = booking.getSeat() != null ? booking.getSeat().getRowLabel() + booking.getSeat().getSeatNumber() : "GA";
        String attendee = booking.getStudentName();
        String bookingRef = booking.getBookingRef();

        // Case B: Already Checked In (Duplicate Interception)
        if ("checked_in".equalsIgnoreCase(booking.getStatus())) {
            ScanRecord scan = new ScanRecord();
            scan.setQueryPayload(rawQuery);
            scan.setResult("ALREADY_USED");
            scan.setStaffUser(staff);
            scan.setBooking(booking);
            scan.setBookingRef(bookingRef);
            scan.setEventTitle(eventTitle);
            scan.setAttendeeName(attendee);
            scan.setSeatLabel(seatLabel);
            scan.setMessage("Duplicate admission intercepted. Pass already checked in.");
            scan.setOriginalCheckedInAt(booking.getCheckedInAt());
            scan.setOriginalCheckedInBy(booking.getCheckedInBy() != null ? booking.getCheckedInBy().getName() : "Gate Staff");
            scan.setScannedAt(now);
            scanRecordRepository.save(scan);

            auditService.recordLog("DUPLICATE_SCAN_INTERCEPTED", booking.getEvent().getId(), eventTitle, seatLabel,
                    attendee, booking.getRegNumber(), "ALREADY_USED", "GATE_TELEMETRY",
                    "Warning: Duplicate QR entry attempted by staff " + staff.getName() + ". Pass checked in earlier.");

            ScanDTO.ScanResponseDTO response = buildResponse(scan.getId(), "ALREADY_USED",
                    "Duplicate entry intercepted! This ticket was previously validated.",
                    rawQuery, staff, booking.getId(), bookingRef, eventTitle, attendee, seatLabel);
            response.setOriginalCheckedInAt(booking.getCheckedInAt() != null ? booking.getCheckedInAt().toInstant().toEpochMilli() : null);
            response.setOriginalCheckedInBy(scan.getOriginalCheckedInBy());
            return response;
        }

        // Case C: Cancelled Ticket
        if ("cancelled".equalsIgnoreCase(booking.getStatus())) {
            ScanRecord scan = new ScanRecord();
            scan.setQueryPayload(rawQuery);
            scan.setResult("INVALID");
            scan.setStaffUser(staff);
            scan.setBooking(booking);
            scan.setBookingRef(bookingRef);
            scan.setEventTitle(eventTitle);
            scan.setAttendeeName(attendee);
            scan.setSeatLabel(seatLabel);
            scan.setMessage("Ticket was previously cancelled");
            scan.setScannedAt(now);
            scanRecordRepository.save(scan);

            return buildResponse(scan.getId(), "INVALID", "This pass has been cancelled and refunded.",
                    rawQuery, staff, booking.getId(), bookingRef, eventTitle, attendee, seatLabel);
        }

        // Case D: Valid Admission
        booking.setStatus("checked_in");
        booking.setCheckedInAt(now);
        booking.setCheckedInBy(staff);
        bookingRepository.save(booking);

        ScanRecord scan = new ScanRecord();
        scan.setQueryPayload(rawQuery);
        scan.setResult("VALID");
        scan.setStaffUser(staff);
        scan.setBooking(booking);
        scan.setBookingRef(bookingRef);
        scan.setEventTitle(eventTitle);
        scan.setAttendeeName(attendee);
        scan.setSeatLabel(seatLabel);
        scan.setMessage("Admission granted! Welcome to Vibrance 2026.");
        scan.setScannedAt(now);
        scanRecordRepository.save(scan);

        auditService.recordLog("TICKET_CHECKIN_SUCCESS", booking.getEvent().getId(), eventTitle, seatLabel,
                attendee, booking.getRegNumber(), "ADMITTED", "GATE_TELEMETRY",
                "Verified at " + staff.getDepartment() + " by " + staff.getName() + " [" + staff.getRegNumber() + "]");

        return buildResponse(scan.getId(), "VALID", "Admission granted! Welcome to Vibrance 2026.",
                rawQuery, staff, booking.getId(), bookingRef, eventTitle, attendee, seatLabel);
    }

    @Transactional(readOnly = true)
    public List<ScanDTO.ScanResponseDTO> getRecentScans() {
        return scanRecordRepository.findAllByOrderByScannedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScanDTO.ScanResponseDTO> getMyScans(UUID staffUserId) {
        return scanRecordRepository.findByStaffUserIdOrderByScannedAtDesc(staffUserId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private Booking resolveBooking(String query) {
        // Direct booking reference match
        Optional<Booking> byRef = bookingRepository.findByBookingRef(query);
        if (byRef.isPresent()) return byRef.get();

        // Direct QR payload match
        Optional<Booking> byPayload = bookingRepository.findByQrPayload(query);
        if (byPayload.isPresent()) return byPayload.get();

        // Extract VIB26-XXXX regex from JSON payload if raw scanned string
        Matcher matcher = REF_PATTERN.matcher(query);
        if (matcher.find()) {
            String extractedRef = matcher.group();
            Optional<Booking> byExtracted = bookingRepository.findByBookingRef(extractedRef);
            if (byExtracted.isPresent()) return byExtracted.get();
        }

        // Try UUID match
        try {
            UUID id = UUID.fromString(query);
            return bookingRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException ignored) {
            // Not a UUID
        }

        return null;
    }

    private ScanDTO.ScanResponseDTO buildResponse(UUID id, String result, String message, String query,
                                                  User staff, UUID bookingId, String bookingRef,
                                                  String eventTitle, String attendee, String seatLabel) {
        ScanDTO.ScanResponseDTO dto = new ScanDTO.ScanResponseDTO();
        dto.setId(id != null ? id : UUID.randomUUID());
        dto.setTimestamp(System.currentTimeMillis());
        dto.setResult(result);
        dto.setMessage(message);
        dto.setQuery(query);
        dto.setBookingId(bookingId);
        dto.setBookingRef(bookingRef);
        dto.setEventTitle(eventTitle);
        dto.setAttendeeName(attendee);
        dto.setSeatLabel(seatLabel);
        if (staff != null) {
            dto.setStaffMember(new ScanDTO.StaffMemberDTO(staff.getName(), staff.getRegNumber()));
        }
        return dto;
    }

    public ScanDTO.ScanResponseDTO toDTO(ScanRecord sr) {
        if (sr == null) return null;
        ScanDTO.ScanResponseDTO dto = new ScanDTO.ScanResponseDTO();
        dto.setId(sr.getId());
        dto.setTimestamp(sr.getScannedAt() != null ? sr.getScannedAt().toInstant().toEpochMilli() : System.currentTimeMillis());
        dto.setResult(sr.getResult());
        dto.setQuery(sr.getQueryPayload());
        dto.setBookingId(sr.getBooking() != null ? sr.getBooking().getId() : null);
        dto.setBookingRef(sr.getBookingRef());
        dto.setEventTitle(sr.getEventTitle());
        dto.setAttendeeName(sr.getAttendeeName());
        dto.setSeatLabel(sr.getSeatLabel());
        dto.setMessage(sr.getMessage());
        dto.setOriginalCheckedInAt(sr.getOriginalCheckedInAt() != null ? sr.getOriginalCheckedInAt().toInstant().toEpochMilli() : null);
        dto.setOriginalCheckedInBy(sr.getOriginalCheckedInBy());
        if (sr.getStaffUser() != null) {
            dto.setStaffMember(new ScanDTO.StaffMemberDTO(sr.getStaffUser().getName(), sr.getStaffUser().getRegNumber()));
        }
        return dto;
    }
}
