package com.vibrance.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class SeatDTO {

    public static class SeatResponseDTO {
        private UUID id;
        private UUID eventId;
        private String row;
        private Integer number;
        private String category;
        private BigDecimal price;
        private String status;
        private LockedByUserDTO lockedBy;
        private Long lockExpiresAt;
        private Long version;

        public SeatResponseDTO() {}

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }

        public String getRow() { return row; }
        public void setRow(String row) { this.row = row; }

        public Integer getNumber() { return number; }
        public void setNumber(Integer number) { this.number = number; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public LockedByUserDTO getLockedBy() { return lockedBy; }
        public void setLockedBy(LockedByUserDTO lockedBy) { this.lockedBy = lockedBy; }

        public Long getLockExpiresAt() { return lockExpiresAt; }
        public void setLockExpiresAt(Long lockExpiresAt) { this.lockExpiresAt = lockExpiresAt; }

        public Long getVersion() { return version; }
        public void setVersion(Long version) { this.version = version; }
    }

    public static class LockedByUserDTO {
        private UUID userId;
        private String userName;
        private String regNumber;

        public LockedByUserDTO() {}

        public LockedByUserDTO(UUID userId, String userName, String regNumber) {
            this.userId = userId;
            this.userName = userName;
            this.regNumber = regNumber;
        }

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getRegNumber() { return regNumber; }
        public void setRegNumber(String regNumber) { this.regNumber = regNumber; }
    }

    public static class SeatLockRequest {
        private UUID seatId;
        private Integer leaseDurationSeconds = 120; // default 2 minutes

        public SeatLockRequest() {}

        public SeatLockRequest(UUID seatId, Integer leaseDurationSeconds) {
            this.seatId = seatId;
            this.leaseDurationSeconds = leaseDurationSeconds;
        }

        public UUID getSeatId() { return seatId; }
        public void setSeatId(UUID seatId) { this.seatId = seatId; }

        public Integer getLeaseDurationSeconds() { return leaseDurationSeconds; }
        public void setLeaseDurationSeconds(Integer leaseDurationSeconds) { this.leaseDurationSeconds = leaseDurationSeconds; }
    }

    public static class SeatLockResponse {
        private boolean success;
        private String message;
        private SeatResponseDTO seat;
        private Long lockExpiresAt;
        private Integer remainingSeconds;

        public SeatLockResponse() {}

        public SeatLockResponse(boolean success, String message, SeatResponseDTO seat, Long lockExpiresAt, Integer remainingSeconds) {
            this.success = success;
            this.message = message;
            this.seat = seat;
            this.lockExpiresAt = lockExpiresAt;
            this.remainingSeconds = remainingSeconds;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public SeatResponseDTO getSeat() { return seat; }
        public void setSeat(SeatResponseDTO seat) { this.seat = seat; }

        public Long getLockExpiresAt() { return lockExpiresAt; }
        public void setLockExpiresAt(Long lockExpiresAt) { this.lockExpiresAt = lockExpiresAt; }

        public Integer getRemainingSeconds() { return remainingSeconds; }
        public void setRemainingSeconds(Integer remainingSeconds) { this.remainingSeconds = remainingSeconds; }
    }
}
