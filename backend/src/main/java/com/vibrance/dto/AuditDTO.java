package com.vibrance.dto;

import java.util.UUID;

public class AuditDTO {

    public static class AuditLogResponseDTO {
        private UUID id;
        private Long timestamp;
        private String action;
        private String eventId;
        private String eventTitle;
        private String seatLabel;
        private String userName;
        private String regNumber;
        private String status;
        private String protocol;
        private String details;

        public AuditLogResponseDTO() {}

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public Long getTimestamp() { return timestamp; }
        public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

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
    }
}
