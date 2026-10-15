package com.vibrance.service;

import com.vibrance.dto.ReportDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    private final JdbcTemplate jdbcTemplate;

    public ReportService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public ReportDTO.AdminSummaryDTO getAdminSummary() {
        // Query 1: Total Events
        Long totalEvents = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM events", Long.class);

        // Query 2: Passes Issued and Checked-In Count
        Long passesIssued = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM bookings WHERE status IN ('confirmed', 'checked_in')", Long.class);

        Long checkedInCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM bookings WHERE status = 'checked_in'", Long.class);

        // Query 3: Total Revenue
        BigDecimal totalRevenue = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(amount), 0) FROM bookings WHERE status IN ('confirmed', 'checked_in')", BigDecimal.class);

        // Query 4: Contention Conflicts from Audit Logs
        Long contentionConflicts = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM audit_logs WHERE status IN ('CONFLICT', 'CONFLICT_ABORT', 'CONFLICT_LOCKED', 'CONTENTION_LOCKED', 'OVERBOOKING_PREVENTED')", Long.class);

        int checkInRate = 0;
        if (passesIssued != null && passesIssued > 0 && checkedInCount != null) {
            checkInRate = (int) Math.round((checkedInCount.doubleValue() / passesIssued.doubleValue()) * 100);
        }

        return new ReportDTO.AdminSummaryDTO(
                totalEvents != null ? totalEvents : 0L,
                passesIssued != null ? passesIssued : 0L,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                contentionConflicts != null ? contentionConflicts : 0L,
                checkInRate,
                checkedInCount != null ? checkedInCount : 0L
        );
    }

    @Transactional(readOnly = true)
    public List<ReportDTO.OccupancyReportDTO> getOccupancyReport() {
        String sql = "SELECT event_id, event_code, title, category, base_price, venue, total_seats, " +
                "booked_count, locked_count, available_count, occupancy_percentage, gross_revenue " +
                "FROM vw_event_occupancy_summary ORDER BY title ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ReportDTO.OccupancyReportDTO dto = new ReportDTO.OccupancyReportDTO();
            dto.setEventId(rs.getObject("event_id", UUID.class));
            dto.setEventCode(rs.getString("event_code"));
            dto.setTitle(rs.getString("title"));
            dto.setCategory(rs.getString("category"));
            dto.setBasePrice(rs.getBigDecimal("base_price"));
            dto.setVenue(rs.getString("venue"));
            dto.setTotalSeats(rs.getInt("total_seats"));
            dto.setBookedCount(rs.getLong("booked_count"));
            dto.setLockedCount(rs.getLong("locked_count"));
            dto.setAvailableCount(rs.getLong("available_count"));
            dto.setOccupancyPercentage(rs.getDouble("occupancy_percentage"));
            dto.setGrossRevenue(rs.getBigDecimal("gross_revenue"));
            return dto;
        });
    }

    @Transactional(readOnly = true)
    public List<ReportDTO.CategorySalesDTO> getCategorySales() {
        String sql = "SELECT category, total_events, total_tickets_sold, total_revenue, " +
                "average_ticket_price, peak_ticket_price " +
                "FROM vw_category_sales_breakdown ORDER BY total_revenue DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ReportDTO.CategorySalesDTO dto = new ReportDTO.CategorySalesDTO();
            dto.setCategory(rs.getString("category"));
            dto.setTotalEvents(rs.getLong("total_events"));
            dto.setTotalTicketsSold(rs.getLong("total_tickets_sold"));
            dto.setTotalRevenue(rs.getBigDecimal("total_revenue"));
            dto.setAverageTicketPrice(rs.getDouble("average_ticket_price"));
            dto.setPeakTicketPrice(rs.getBigDecimal("peak_ticket_price"));
            return dto;
        });
    }

    @Transactional(readOnly = true)
    public List<ReportDTO.GateTelemetryDTO> getGateTelemetry() {
        String sql = "SELECT staff_id, staff_name, staff_badge, gate_post, total_scans_conducted, " +
                "valid_admissions, duplicate_intercepts, invalid_rejections, expired_rejections, last_scan_timestamp " +
                "FROM vw_gate_checkin_telemetry ORDER BY staff_name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ReportDTO.GateTelemetryDTO dto = new ReportDTO.GateTelemetryDTO();
            dto.setStaffId(rs.getObject("staff_id", UUID.class));
            dto.setStaffName(rs.getString("staff_name"));
            dto.setStaffBadge(rs.getString("staff_badge"));
            dto.setGatePost(rs.getString("gate_post"));
            dto.setTotalScansConducted(rs.getLong("total_scans_conducted"));
            dto.setValidAdmissions(rs.getLong("valid_admissions"));
            dto.setDuplicateIntercepts(rs.getLong("duplicate_intercepts"));
            dto.setInvalidRejections(rs.getLong("invalid_rejections"));
            dto.setExpiredRejections(rs.getLong("expired_rejections"));
            dto.setLastScanTimestamp(rs.getString("last_scan_timestamp"));
            return dto;
        });
    }
}
