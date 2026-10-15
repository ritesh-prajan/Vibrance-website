package com.vibrance.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scan_records")
public class ScanRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "query_payload", nullable = false, columnDefinition = "TEXT")
    private String queryPayload;

    @Column(nullable = false, length = 20)
    private String result; // 'VALID', 'ALREADY_USED', 'INVALID', 'EXPIRED'

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_user_id", nullable = false)
    private User staffUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "booking_ref", length = 64)
    private String bookingRef;

    @Column(name = "event_title", length = 128)
    private String eventTitle;

    @Column(name = "attendee_name", length = 128)
    private String attendeeName;

    @Column(name = "seat_label", length = 32)
    private String seatLabel;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "original_checked_in_at")
    private OffsetDateTime originalCheckedInAt;

    @Column(name = "original_checked_in_by", length = 128)
    private String originalCheckedInBy;

    @Column(name = "scanned_at", nullable = false)
    private OffsetDateTime scannedAt;

    public ScanRecord() {}

    @PrePersist
    protected void onCreate() {
        if (this.scannedAt == null) {
            this.scannedAt = OffsetDateTime.now();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getQueryPayload() { return queryPayload; }
    public void setQueryPayload(String queryPayload) { this.queryPayload = queryPayload; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public User getStaffUser() { return staffUser; }
    public void setStaffUser(User staffUser) { this.staffUser = staffUser; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }

    public String getSeatLabel() { return seatLabel; }
    public void setSeatLabel(String seatLabel) { this.seatLabel = seatLabel; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public OffsetDateTime getOriginalCheckedInAt() { return originalCheckedInAt; }
    public void setOriginalCheckedInAt(OffsetDateTime originalCheckedInAt) { this.originalCheckedInAt = originalCheckedInAt; }

    public String getOriginalCheckedInBy() { return originalCheckedInBy; }
    public void setOriginalCheckedInBy(String originalCheckedInBy) { this.originalCheckedInBy = originalCheckedInBy; }

    public OffsetDateTime getScannedAt() { return scannedAt; }
    public void setScannedAt(OffsetDateTime scannedAt) { this.scannedAt = scannedAt; }
}
