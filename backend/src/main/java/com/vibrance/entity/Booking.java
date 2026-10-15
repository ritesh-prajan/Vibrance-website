package com.vibrance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "booking_ref", unique = true, nullable = false, length = 64)
    private String bookingRef;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "reg_number", nullable = false, length = 32)
    private String regNumber;

    @Column(nullable = false, length = 128)
    private String department;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 20)
    private String paymentMethod; // 'UPI', 'CAMPUS_CARD', 'NET_BANKING'

    @Column(name = "qr_payload", nullable = false, columnDefinition = "TEXT")
    private String qrPayload;

    @Column(name = "ticket_bg_image", columnDefinition = "TEXT")
    private String ticketBgImage;

    @Column(nullable = false, length = 20)
    private String status; // 'confirmed', 'cancelled', 'checked_in'

    @Column(name = "booked_at", nullable = false)
    private OffsetDateTime bookedAt;

    @Column(name = "checked_in_at")
    private OffsetDateTime checkedInAt;

    @Column(name = "ticket_token", length = 64)
    private String ticketToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by_user_id")
    private User checkedInBy;

    public Booking() {}

    public Booking(String bookingRef, Event event, Seat seat, User user, String studentName, String regNumber, String department, BigDecimal amount, String paymentMethod, String qrPayload) {
        this.bookingRef = bookingRef;
        this.event = event;
        this.seat = seat;
        this.user = user;
        this.studentName = studentName;
        this.regNumber = regNumber;
        this.department = department;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.qrPayload = qrPayload;
        this.status = "confirmed";
        this.bookedAt = OffsetDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.bookedAt == null) {
            this.bookedAt = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = "confirmed";
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getQrPayload() { return qrPayload; }
    public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }

    public String getTicketBgImage() { return ticketBgImage; }
    public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(OffsetDateTime bookedAt) { this.bookedAt = bookedAt; }

    public OffsetDateTime getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(OffsetDateTime checkedInAt) { this.checkedInAt = checkedInAt; }

    public User getCheckedInBy() { return checkedInBy; }
    public void setCheckedInBy(User checkedInBy) { this.checkedInBy = checkedInBy; }

    public String getTicketToken() { return ticketToken; }
    public void setTicketToken(String ticketToken) { this.ticketToken = ticketToken; }
}
