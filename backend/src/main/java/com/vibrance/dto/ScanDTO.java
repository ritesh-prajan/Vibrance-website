package com.vibrance.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class ScanDTO {

    public static class VerifyTicketRequest {
        @NotBlank(message = "QR Payload or ticket code is required")
        private String query;

        public VerifyTicketRequest() {}

        public VerifyTicketRequest(String query) {
            this.query = query;
        }

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }

    public static class ScanResponseDTO {
        private UUID id;
        private Long timestamp;
        private String query;
        private String result; // 'VALID', 'ALREADY_USED', 'INVALID', 'EXPIRED'
        private StaffMemberDTO staffMember;
        private UUID bookingId;
        private String bookingRef;
        private String eventTitle;
        private String attendeeName;
        private String seatLabel;
        private String message;
        private Long originalCheckedInAt;
        private String originalCheckedInBy;

        public ScanResponseDTO() {}

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public Long getTimestamp() { return timestamp; }
        public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }

        public StaffMemberDTO getStaffMember() { return staffMember; }
        public void setStaffMember(StaffMemberDTO staffMember) { this.staffMember = staffMember; }

        public UUID getBookingId() { return bookingId; }
        public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }

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

        public Long getOriginalCheckedInAt() { return originalCheckedInAt; }
        public void setOriginalCheckedInAt(Long originalCheckedInAt) { this.originalCheckedInAt = originalCheckedInAt; }

        public String getOriginalCheckedInBy() { return originalCheckedInBy; }
        public void setOriginalCheckedInBy(String originalCheckedInBy) { this.originalCheckedInBy = originalCheckedInBy; }
    }

    public static class StaffMemberDTO {
        private String name;
        private String staffId;

        public StaffMemberDTO() {}

        public StaffMemberDTO(String name, String staffId) {
            this.name = name;
            this.staffId = staffId;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getStaffId() { return staffId; }
        public void setStaffId(String staffId) { this.staffId = staffId; }
    }
}
