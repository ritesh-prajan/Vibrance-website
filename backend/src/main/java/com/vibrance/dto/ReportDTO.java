package com.vibrance.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class ReportDTO {

    public static class AdminSummaryDTO {
        private long totalEvents;
        private long passesIssued;
        private BigDecimal totalRevenue;
        private long contentionConflicts;
        private int checkInRate;
        private long checkedInCount;

        public AdminSummaryDTO() {}

        public AdminSummaryDTO(long totalEvents, long passesIssued, BigDecimal totalRevenue, long contentionConflicts, int checkInRate, long checkedInCount) {
            this.totalEvents = totalEvents;
            this.passesIssued = passesIssued;
            this.totalRevenue = totalRevenue;
            this.contentionConflicts = contentionConflicts;
            this.checkInRate = checkInRate;
            this.checkedInCount = checkedInCount;
        }

        public long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

        public long getPassesIssued() { return passesIssued; }
        public void setPassesIssued(long passesIssued) { this.passesIssued = passesIssued; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public long getContentionConflicts() { return contentionConflicts; }
        public void setContentionConflicts(long contentionConflicts) { this.contentionConflicts = contentionConflicts; }

        public int getCheckInRate() { return checkInRate; }
        public void setCheckInRate(int checkInRate) { this.checkInRate = checkInRate; }

        public long getCheckedInCount() { return checkedInCount; }
        public void setCheckedInCount(long checkedInCount) { this.checkedInCount = checkedInCount; }
    }

    public static class OccupancyReportDTO {
        private UUID eventId;
        private String eventCode;
        private String title;
        private String category;
        private BigDecimal basePrice;
        private String venue;
        private int totalSeats;
        private long bookedCount;
        private long lockedCount;
        private long availableCount;
        private double occupancyPercentage;
        private BigDecimal grossRevenue;

        public OccupancyReportDTO() {}

        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }

        public String getEventCode() { return eventCode; }
        public void setEventCode(String eventCode) { this.eventCode = eventCode; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getBasePrice() { return basePrice; }
        public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

        public String getVenue() { return venue; }
        public void setVenue(String venue) { this.venue = venue; }

        public int getTotalSeats() { return totalSeats; }
        public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

        public long getBookedCount() { return bookedCount; }
        public void setBookedCount(long bookedCount) { this.bookedCount = bookedCount; }

        public long getLockedCount() { return lockedCount; }
        public void setLockedCount(long lockedCount) { this.lockedCount = lockedCount; }

        public long getAvailableCount() { return availableCount; }
        public void setAvailableCount(long availableCount) { this.availableCount = availableCount; }

        public double getOccupancyPercentage() { return occupancyPercentage; }
        public void setOccupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

        public BigDecimal getGrossRevenue() { return grossRevenue; }
        public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }
    }

    public static class CategorySalesDTO {
        private String category;
        private long totalEvents;
        private long totalTicketsSold;
        private BigDecimal totalRevenue;
        private double averageTicketPrice;
        private BigDecimal peakTicketPrice;

        public CategorySalesDTO() {}

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

        public long getTotalTicketsSold() { return totalTicketsSold; }
        public void setTotalTicketsSold(long totalTicketsSold) { this.totalTicketsSold = totalTicketsSold; }

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public double getAverageTicketPrice() { return averageTicketPrice; }
        public void setAverageTicketPrice(double averageTicketPrice) { this.averageTicketPrice = averageTicketPrice; }

        public BigDecimal getPeakTicketPrice() { return peakTicketPrice; }
        public void setPeakTicketPrice(BigDecimal peakTicketPrice) { this.peakTicketPrice = peakTicketPrice; }
    }

    public static class GateTelemetryDTO {
        private UUID staffId;
        private String staffName;
        private String staffBadge;
        private String gatePost;
        private long totalScansConducted;
        private long validAdmissions;
        private long duplicateIntercepts;
        private long invalidRejections;
        private long expiredRejections;
        private String lastScanTimestamp;

        public GateTelemetryDTO() {}

        public UUID getStaffId() { return staffId; }
        public void setStaffId(UUID staffId) { this.staffId = staffId; }

        public String getStaffName() { return staffName; }
        public void setStaffName(String staffName) { this.staffName = staffName; }

        public String getStaffBadge() { return staffBadge; }
        public void setStaffBadge(String staffBadge) { this.staffBadge = staffBadge; }

        public String getGatePost() { return gatePost; }
        public void setGatePost(String gatePost) { this.gatePost = gatePost; }

        public long getTotalScansConducted() { return totalScansConducted; }
        public void setTotalScansConducted(long totalScansConducted) { this.totalScansConducted = totalScansConducted; }

        public long getValidAdmissions() { return validAdmissions; }
        public void setValidAdmissions(long validAdmissions) { this.validAdmissions = validAdmissions; }

        public long getDuplicateIntercepts() { return duplicateIntercepts; }
        public void setDuplicateIntercepts(long duplicateIntercepts) { this.duplicateIntercepts = duplicateIntercepts; }

        public long getInvalidRejections() { return invalidRejections; }
        public void setInvalidRejections(long invalidRejections) { this.invalidRejections = invalidRejections; }

        public long getExpiredRejections() { return expiredRejections; }
        public void setExpiredRejections(long expiredRejections) { this.expiredRejections = expiredRejections; }

        public String getLastScanTimestamp() { return lastScanTimestamp; }
        public void setLastScanTimestamp(String lastScanTimestamp) { this.lastScanTimestamp = lastScanTimestamp; }
    }
}
