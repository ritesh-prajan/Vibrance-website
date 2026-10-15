package com.vibrance.controller;

import com.vibrance.dto.ApiResponse;
import com.vibrance.dto.EventDTO;
import com.vibrance.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@Tag(name = "Event Catalog & Administration")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Get all festival events")
    public ResponseEntity<ApiResponse<List<EventDTO.EventResponseDTO>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvents()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<ApiResponse<EventDTO.EventResponseDTO>> getEventById(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "true") boolean includeSeats) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventById(id, includeSeats)));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get event by code")
    public ResponseEntity<ApiResponse<EventDTO.EventResponseDTO>> getEventByCode(
            @PathVariable String code,
            @RequestParam(defaultValue = "true") boolean includeSeats) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventByCode(code, includeSeats)));
    }

    @PostMapping
    @Operation(summary = "Create a new festival event")
    public ResponseEntity<ApiResponse<EventDTO.EventResponseDTO>> createEvent(@Valid @RequestBody EventDTO.CreateEventRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(eventService.createEvent(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing festival event")
    public ResponseEntity<ApiResponse<EventDTO.EventResponseDTO>> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventDTO.UpdateEventRequest req) {
        return ResponseEntity.ok(ApiResponse.success(eventService.updateEvent(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
    }
}
