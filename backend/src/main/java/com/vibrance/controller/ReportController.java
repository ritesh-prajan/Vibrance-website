package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.ReportDTO;
import com.vibrance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Analytical Reports & DBMS Views")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get admin dashboard KPI metrics")
    public ResponseEntity<ApiResponse<ReportDTO.AdminSummaryDTO>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getAdminSummary()));
    }

    @GetMapping("/occupancy")
    @Operation(summary = "Get event occupancy report from view vw_event_occupancy_summary")
    public ResponseEntity<ApiResponse<List<ReportDTO.OccupancyReportDTO>>> getOccupancy() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getOccupancyReport()));
    }

    @GetMapping("/category-sales")
    @Operation(summary = "Get category sales breakdown from view vw_category_sales_breakdown")
    public ResponseEntity<ApiResponse<List<ReportDTO.CategorySalesDTO>>> getCategorySales() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getCategorySales()));
    }

    @GetMapping("/gate-telemetry")
    @Operation(summary = "Get gate staff telemetry from view vw_gate_checkin_telemetry")
    public ResponseEntity<ApiResponse<List<ReportDTO.GateTelemetryDTO>>> getGateTelemetry() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getGateTelemetry()));
    }
}
