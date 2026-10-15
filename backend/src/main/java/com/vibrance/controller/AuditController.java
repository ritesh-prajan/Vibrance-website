package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.AuditDTO;
import com.vibrance.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@Tag(name = "Relational Audit & Compliance Logs")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    @Operation(summary = "Get all audit trail logs")
    public ResponseEntity<ApiResponse<List<AuditDTO.AuditLogResponseDTO>>> getLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditService.getAuditLogs()));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export audit trail to CSV")
    public ResponseEntity<byte[]> exportCsv() {
        String csvContent = auditService.exportLogsAsCsv();
        byte[] bytes = csvContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vibrance_audit_trail.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @DeleteMapping("/logs")
    @Operation(summary = "Clear audit logs (Admin only)")
    public ResponseEntity<ApiResponse<Void>> clearLogs() {
        auditService.clearLogs();
        return ResponseEntity.ok(ApiResponse.ok("Audit logs cleared successfully", null));
    }
}
