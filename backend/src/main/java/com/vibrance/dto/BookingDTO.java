package com.vibrance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class BookingDTO {

    public static class CreateBookingRequest {
        @NotNull(message = "Event ID is required")
        private UUID eventId;

        @NotNull(message = "Seat ID is required")
        private UUID seatId;

        @NotBlank(message = "Attendee name is required")
        private String name;

        @NotBlank(message = "Registration number is required")
        private String regNumber;

        private String department;

        @NotBlank(message = "Payment method is required")
        private String paymentMethod; // 'UPI', 'CAMPUS_CARD', 'NET_BANKING'

        public CreateBookingRequest() {}

        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }

        public UUID getSeatId() { return seatId; }
        public void setSeatId(UUID seatId) { this.seatId = seatId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRegNumber() { return regNumber; }
        public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class BookingResponseDTO {
        private UUID id;
        private String bookingRef;
        private UUID eventId;
        private String eventTitle;
        private String eventCategory;
        private String artistOrHost;
        private String eventDate;
        private String eventTime;
        private String eventVenue;
        private UUID seatId;
        private String seatLabel;
        private String seatCategory;
        private String studentName;
        private String regNumber;
        private String department;
        private BigDecimal amount;
        private String paymentMethod;
        private Long bookedAt;
        private String qrPayload;
        private String ticketBgImage;
        private String status;
        private Long checkedInAt;
        private CheckedInByDTO checkedInBy;
        private Long startTimestamp;
        private Long endTimestamp;

        public BookingResponseDTO() {}

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getBookingRef() { return bookingRef; }
        public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }

        public String getEventTitle() { return eventTitle; }
        public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

        public String getEventCategory() { return eventCategory; }
        public void setEventCategory(String eventCategory) { this.eventCategory = eventCategory; }

        public String getArtistOrHost() { return artistOrHost; }
        public void setArtistOrHost(String artistOrHost) { this.artistOrHost = artistOrHost; }

        public String getEventDate() { return eventDate; }
        public void setEventDate(String eventDate) { this.eventDate = eventDate; }

        public String getEventTime() { return eventTime; }
        public void setEventTime(String eventTime) { this.eventTime = eventTime; }

        public String getEventVenue() { return eventVenue; }
        public void setEventVenue(String eventVenue) { this.eventVenue = eventVenue; }

        public UUID getSeatId() { return seatId; }
        public void setSeatId(UUID seatId) { this.seatId = seatId; }

        public String getSeatLabel() { return seatLabel; }
        public void setSeatLabel(String seatLabel) { this.seatLabel = seatLabel; }

        public String getSeatCategory() { return seatCategory; }
        public void setSeatCategory(String seatCategory) { this.seatCategory = seatCategory; }

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

        public Long getBookedAt() { return bookedAt; }
        public void setBookedAt(Long bookedAt) { this.bookedAt = bookedAt; }

        public String getQrPayload() { return qrPayload; }
        public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }

        public String getTicketBgImage() { return ticketBgImage; }
        public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getCheckedInAt() { return checkedInAt; }
        public void setCheckedInAt(Long checkedInAt) { this.checkedInAt = checkedInAt; }

        public CheckedInByDTO getCheckedInBy() { return checkedInBy; }
        public void setCheckedInBy(CheckedInByDTO checkedInBy) { this.checkedInBy = checkedInBy; }

        public Long getStartTimestamp() { return startTimestamp; }
        public void setStartTimestamp(Long startTimestamp) { this.startTimestamp = startTimestamp; }

        public Long getEndTimestamp() { return endTimestamp; }
        public void setEndTimestamp(Long endTimestamp) { this.endTimestamp = endTimestamp; }
    }

    public static class CheckedInByDTO {
        private String name;
        private String staffId;

        public CheckedInByDTO() {}

        public CheckedInByDTO(String name, String staffId) {
            this.name = name;
            this.staffId = staffId;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getStaffId() { return staffId; }
        public void setStaffId(String staffId) { this.staffId = staffId; }
    }
}
