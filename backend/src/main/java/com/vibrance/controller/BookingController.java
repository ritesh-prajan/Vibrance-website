package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.BookingDTO;
import com.vibrance.security.UserPrincipal;
import com.vibrance.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking & Ticketing Engine")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Book event pass atomically")
    public ResponseEntity<ApiResponse<BookingDTO.BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingDTO.CreateBookingRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(bookingService.createBooking(req, userId)));
    }

    @GetMapping("/my")
    @Operation(summary = "Get attendee's festival passes")
    public ResponseEntity<ApiResponse<List<BookingDTO.BookingResponseDTO>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }
        return ResponseEntity.ok(ApiResponse.success(bookingService.getMyBookings(principal.getId())));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all festival passes (Admin)")
    public ResponseEntity<ApiResponse<List<BookingDTO.BookingResponseDTO>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings()));
    }

    @GetMapping("/{bookingRef}")
    @Operation(summary = "Get single booking by reference code")
    public ResponseEntity<ApiResponse<BookingDTO.BookingResponseDTO>> getBookingByRef(@PathVariable String bookingRef) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingByRef(bookingRef)));
    }

    @PostMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel festival pass")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        bookingService.cancelBooking(bookingId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", null));
    }
}
