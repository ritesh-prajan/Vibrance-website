package com.vibrance.service;

import com.vibrance.dto.BookingDTO;
import com.vibrance.entity.Booking;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.entity.User;
import com.vibrance.exception.BadRequestException;
import com.vibrance.exception.ConflictException;
import com.vibrance.exception.ResourceNotFoundException;
import com.vibrance.exception.UnauthorizedException;
import com.vibrance.repository.BookingRepository;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import com.vibrance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public BookingService(BookingRepository bookingRepository,
                          SeatRepository seatRepository,
                          EventRepository eventRepository,
                          UserRepository userRepository,
                          AuditService auditService) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    /**
     * ACID Guaranteed Ticket Purchase with 2PL Pessimistic Lock on the Seat row.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BookingDTO.BookingResponseDTO createBooking(BookingDTO.CreateBookingRequest req, UUID userId) {
        OffsetDateTime now = OffsetDateTime.now();

        // 1. Fetch seat with exclusive pessimistic lock (SELECT ... FOR UPDATE)
        Seat seat = seatRepository.findByIdWithPessimisticLock(req.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + req.getSeatId()));

        Event event = seat.getEvent();
        if (event == null || !event.getId().equals(req.getEventId())) {
            throw new BadRequestException("Seat does not belong to the specified event");
        }

        String seatCode = seat.getRowLabel() + seat.getSeatNumber();

        // 2. Resolve Authenticated User
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null && req.getRegNumber() != null) {
            user = userRepository.findByRegNumber(req.getRegNumber().trim()).orElse(null);
        }
        if (user == null) {
            throw new UnauthorizedException("User must be authenticated to purchase tickets. Please log in first.");
        }

        // 3. Concurrency / Collision Checks
        if ("booked".equalsIgnoreCase(seat.getStatus())) {
            auditService.recordLog("TICKET_PURCHASE_COLLISION", event.getId(), event.getTitle(), seatCode,
                    user.getName(), user.getRegNumber(), "CONFLICT_ABORT", "2PL_SERIALIZABLE",
                    "Transaction aborted: seat already booked by concurrent transaction");
            throw new ConflictException("Seat " + seatCode + " was just booked by another attendee while you were checking out. Please select another seat.");
        }

        if ("locked".equalsIgnoreCase(seat.getStatus())) {
            boolean lockExpired = seat.getLockExpiresAt() != null && seat.getLockExpiresAt().isBefore(now);
            boolean ownedByThisUser = seat.getLockedBy() != null && seat.getLockedBy().getId().equals(user.getId());

            if (!lockExpired && !ownedByThisUser) {
                auditService.recordLog("TICKET_PURCHASE_COLLISION", event.getId(), event.getTitle(), seatCode,
                        user.getName(), user.getRegNumber(), "CONFLICT_LOCKED", "2PL_SERIALIZABLE",
                        "Transaction aborted: seat locked by another user");
                throw new ConflictException("Seat " + seatCode + " is currently locked by another student. Please select an available seat.");
            }
        }

        // 4. Update Seat State to Booked
        seat.setStatus("booked");
        seat.setLockedBy(null);
        seat.setLockExpiresAt(null);
        seatRepository.save(seat);

        // 5. Generate Booking Reference and QR Payload
        String bookingRef = "VIB26-" + generateRandomString(6);
        String ticketToken = UUID.randomUUID().toString().replace("-", "") + generateRandomString(16);
        String qrPayload = String.format("{\"ticketId\":\"%s\",\"token\":\"%s\",\"ref\":\"%s\",\"event\":\"%s\",\"seat\":\"%s\",\"attendee\":\"%s\"}",
                UUID.randomUUID(), ticketToken, bookingRef, event.getEventCode(), seatCode, user.getRegNumber());

        Booking booking = new Booking();
        booking.setBookingRef(bookingRef);
        booking.setTicketToken(ticketToken);
        booking.setEvent(event);
        booking.setSeat(seat);
        booking.setUser(user);
        booking.setStudentName(req.getName() != null ? req.getName().trim() : user.getName());
        booking.setRegNumber(req.getRegNumber() != null ? req.getRegNumber().trim() : user.getRegNumber());
        booking.setDepartment(req.getDepartment() != null ? req.getDepartment() : user.getDepartment());
        booking.setAmount(seat.getPrice());
        booking.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI");
        booking.setQrPayload(qrPayload);
        booking.setTicketBgImage(event.getTicketBgImage());
        booking.setStatus("confirmed");
        booking.setBookedAt(now);

        Booking savedBooking = bookingRepository.save(booking);

        // 6. Record Relational Audit Log
        auditService.recordLog("TICKET_PURCHASED", event.getId(), event.getTitle(), seatCode,
                user.getName(), user.getRegNumber(), "COMMITTED", "2PL_ATOMIC_TX",
                "Pass booked for Rs " + booking.getAmount() + " via " + booking.getPaymentMethod() + " [Ref: " + bookingRef + "]");

        return toDTO(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO.BookingResponseDTO> getMyBookings(UUID userId) {
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO.BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByBookedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDTO.BookingResponseDTO getBookingByRef(String bookingRef) {
        Booking booking = bookingRepository.findByBookingRef(bookingRef)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingRef));
        return toDTO(booking);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void cancelBooking(UUID bookingId, UUID userId) {
        if (userId == null) {
            throw new UnauthorizedException("User must be authenticated to cancel bookings");
        }

        Booking booking = bookingRepository.findByIdWithPessimisticLock(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        User reqUser = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
        boolean isAdmin = "admin".equalsIgnoreCase(reqUser.getRole());
        boolean isOwner = booking.getUser() != null && booking.getUser().getId().equals(userId);

        if (!isAdmin && !isOwner) {
            throw new BadRequestException("Unauthorized: You can only cancel your own bookings");
        }

        if ("checked_in".equalsIgnoreCase(booking.getStatus())) {
            throw new ConflictException("Cannot cancel an already checked-in ticket pass.");
        }
        if ("cancelled".equalsIgnoreCase(booking.getStatus())) {
            throw new ConflictException("This booking has already been cancelled.");
        }

        booking.setStatus("cancelled");
        bookingRepository.save(booking);

        // Safely release seat back to available with exclusive row lock
        if (booking.getSeat() != null) {
            UUID seatId = booking.getSeat().getId();
            Seat seat = seatRepository.findByIdWithPessimisticLock(seatId).orElse(null);
            if (seat != null) {
                // Ensure no other active booking exists for this seat before releasing
                boolean hasActiveBooking = bookingRepository.existsActiveBookingForSeat(seatId);
                if (!hasActiveBooking) {
                    seat.setStatus("available");
                    seat.setLockedBy(null);
                    seat.setLockExpiresAt(null);
                    seatRepository.save(seat);
                }
            }
        }

        Seat bookingSeat = booking.getSeat();
        String seatLabel = bookingSeat != null ? bookingSeat.getRowLabel() + bookingSeat.getSeatNumber() : "N/A";
        auditService.recordLog("TICKET_CANCELLED", booking.getEvent().getId(), booking.getEvent().getTitle(),
                seatLabel,
                booking.getStudentName(), booking.getRegNumber(), "CANCELLED", "2PL_ROLLBACK",
                "Booking pass " + booking.getBookingRef() + " cancelled and seat refunded to available inventory");
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    public BookingDTO.BookingResponseDTO toDTO(Booking booking) {
        if (booking == null) return null;
        BookingDTO.BookingResponseDTO dto = new BookingDTO.BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingRef(booking.getBookingRef());

        Event event = booking.getEvent();
        if (event != null) {
            dto.setEventId(event.getId());
            dto.setEventTitle(event.getTitle());
            dto.setEventCategory(event.getCategory());
            dto.setArtistOrHost(event.getArtistOrHost());
            dto.setEventDate(event.getDateStr());
            dto.setEventTime(event.getTimeStr());
            dto.setEventVenue(event.getVenue());
            dto.setStartTimestamp(event.getStartTimestamp() != null ? event.getStartTimestamp().toInstant().toEpochMilli() : null);
            dto.setEndTimestamp(event.getEndTimestamp() != null ? event.getEndTimestamp().toInstant().toEpochMilli() : null);
        }

        Seat seat = booking.getSeat();
        if (seat != null) {
            dto.setSeatId(seat.getId());
            dto.setSeatLabel(seat.getRowLabel() + seat.getSeatNumber());
            dto.setSeatCategory(seat.getCategory());
        }

        dto.setStudentName(booking.getStudentName());
        dto.setRegNumber(booking.getRegNumber());
        dto.setDepartment(booking.getDepartment());
        dto.setAmount(booking.getAmount());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setBookedAt(booking.getBookedAt() != null ? booking.getBookedAt().toInstant().toEpochMilli() : null);
        dto.setQrPayload(booking.getQrPayload());
        dto.setTicketBgImage(booking.getTicketBgImage());
        dto.setStatus(booking.getStatus());

        if (booking.getCheckedInAt() != null) {
            dto.setCheckedInAt(booking.getCheckedInAt().toInstant().toEpochMilli());
        }
        if (booking.getCheckedInBy() != null) {
            dto.setCheckedInBy(new BookingDTO.CheckedInByDTO(
                    booking.getCheckedInBy().getName(),
                    booking.getCheckedInBy().getRegNumber()
            ));
        }

        return dto;
    }
}
