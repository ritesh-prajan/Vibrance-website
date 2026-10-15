package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.SeatDTO;
import com.vibrance.security.UserPrincipal;
import com.vibrance.service.SeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/seats")
@Tag(name = "Seat Inventory & 2PL Reservation Leases")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get seat matrix for an event")
    public ResponseEntity<ApiResponse<List<SeatDTO.SeatResponseDTO>>> getSeatsForEvent(@PathVariable UUID eventId) {
        return ResponseEntity.ok(ApiResponse.success(seatService.getSeatsForEvent(eventId)));
    }

    @PostMapping("/lock")
    @Operation(summary = "Acquire exclusive 2PL seat lease")
    public ResponseEntity<ApiResponse<SeatDTO.SeatLockResponse>> lockSeat(
            @Valid @RequestBody SeatDTO.SeatLockRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        int lease = req.getLeaseDurationSeconds() != null ? req.getLeaseDurationSeconds() : 120;
        SeatDTO.SeatLockResponse response = seatService.lockSeat(req.getSeatId(), userId, lease);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{seatId}/release")
    @Operation(summary = "Release seat reservation lease")
    public ResponseEntity<ApiResponse<Void>> releaseSeat(
            @PathVariable UUID seatId,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        seatService.releaseSeatLock(seatId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Seat lease released", null));
    }
}
