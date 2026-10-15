package com.vibrance.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 64)
    private String action;

    @Column(name = "event_id", length = 64)
    private String eventId;

    @Column(name = "event_title", length = 128)
    private String eventTitle;

    @Column(name = "seat_label", length = 32)
    private String seatLabel;

    @Column(name = "user_name", length = 128)
    private String userName;

    @Column(name = "reg_number", length = 32)
    private String regNumber;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(length = 64)
    private String protocol;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public AuditLog() {}

    public AuditLog(String action, String eventId, String eventTitle, String seatLabel, String userName, String regNumber, String status, String protocol, String details) {
        this.action = action;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.seatLabel = seatLabel;
        this.userName = userName;
        this.regNumber = regNumber;
        this.status = status;
        this.protocol = protocol;
        this.details = details;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getSeatLabel() { return seatLabel; }
    public void setSeatLabel(String seatLabel) { this.seatLabel = seatLabel; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
