package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.ScanDTO;
import com.vibrance.security.UserPrincipal;
import com.vibrance.service.ScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/scans")
@Tag(name = "Gate Verification & Interception Telemetry")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify and check in ticket")
    public ResponseEntity<ApiResponse<ScanDTO.ScanResponseDTO>> verifyTicket(
            @Valid @RequestBody ScanDTO.VerifyTicketRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID staffUserId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(scanService.verifyAndCheckInTicket(req.getQuery(), staffUserId)));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent scans across all gates")
    public ResponseEntity<ApiResponse<List<ScanDTO.ScanResponseDTO>>> getRecentScans() {
        return ResponseEntity.ok(ApiResponse.success(scanService.getRecentScans()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get scans by current gatekeeper")
    public ResponseEntity<ApiResponse<List<ScanDTO.ScanResponseDTO>>> getMyScans(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }
        return ResponseEntity.ok(ApiResponse.success(scanService.getMyScans(principal.getId())));
    }
}
