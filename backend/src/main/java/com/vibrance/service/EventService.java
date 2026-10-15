package com.vibrance.service;

import com.vibrance.dto.EventDTO;
import com.vibrance.dto.SeatDTO;
import com.vibrance.entity.Event;
import com.vibrance.entity.Seat;
import com.vibrance.exception.ConflictException;
import com.vibrance.exception.ResourceNotFoundException;
import com.vibrance.repository.EventRepository;
import com.vibrance.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final SeatService seatService;

    public EventService(EventRepository eventRepository,
                        SeatRepository seatRepository,
                        SeatService seatService) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.seatService = seatService;
    }

    @Transactional(readOnly = true)
    public List<EventDTO.EventResponseDTO> getAllEvents() {
        OffsetDateTime now = OffsetDateTime.now();
        List<Event> events = eventRepository.findAllByOrderByStartTimestampAsc();
        return events.stream().map(e -> toDTO(e, false, now)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDTO.EventResponseDTO getEventById(UUID id, boolean includeSeats) {
        OffsetDateTime now = OffsetDateTime.now();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return toDTO(event, includeSeats, now);
    }

    @Transactional(readOnly = true)
    public EventDTO.EventResponseDTO getEventByCode(String code, boolean includeSeats) {
        OffsetDateTime now = OffsetDateTime.now();
        Event event = eventRepository.findByEventCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with code: " + code));
        return toDTO(event, includeSeats, now);
    }

    @Transactional
    public EventDTO.EventResponseDTO createEvent(EventDTO.CreateEventRequest req) {
        String eventCode = "EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Event event = new Event();
        event.setEventCode(eventCode);
        event.setTitle(req.getTitle().trim());
        event.setCategory(req.getCategory().trim().toUpperCase());
        event.setArtistOrHost(req.getArtistOrHost().trim());
        event.setDateStr(req.getDate() != null ? req.getDate() : "Sept 05, 2026");
        event.setTimeStr(req.getTime() != null ? req.getTime() : "18:00 IST");
        event.setVenue(req.getVenue() != null ? req.getVenue() : "Main Arena");
        event.setBasePrice(req.getBasePrice());
        event.setTotalSeats(req.getTotalSeats() != null ? req.getTotalSeats() : 48);
        event.setTag(req.getTag() != null ? req.getTag() : "CAMPUS SPECIAL");
        event.setShortDesc(req.getShortDesc());
        event.setTicketBgImage(req.getTicketBgImage());

        OffsetDateTime start = OffsetDateTime.now().plusDays(2);
        event.setStartTimestamp(start);
        event.setEndTimestamp(start.plusHours(4));

        Event savedEvent = eventRepository.save(event);

        // Generate 48 standard stadium seats (A-D, 1-12)
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D"};
        for (String row : rows) {
            for (int num = 1; num <= 12; num++) {
                String category;
                BigDecimal price;
                if ("A".equals(row)) {
                    category = "VIP_FRONT";
                    price = req.getBasePrice().multiply(BigDecimal.valueOf(1.5));
                } else if ("B".equals(row)) {
                    category = "GOLD";
                    price = req.getBasePrice().multiply(BigDecimal.valueOf(1.2));
                } else {
                    category = "REGULAR";
                    price = req.getBasePrice();
                }

                Seat seat = new Seat(savedEvent, row, num, category, price, "available");
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);

        return toDTO(savedEvent, true, OffsetDateTime.now());
    }

    @Transactional
    public EventDTO.EventResponseDTO updateEvent(UUID id, EventDTO.UpdateEventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (req.getTitle() != null) event.setTitle(req.getTitle().trim());
        if (req.getCategory() != null) event.setCategory(req.getCategory().trim().toUpperCase());
        if (req.getArtistOrHost() != null) event.setArtistOrHost(req.getArtistOrHost().trim());
        if (req.getDate() != null) event.setDateStr(req.getDate());
        if (req.getTime() != null) event.setTimeStr(req.getTime());
        if (req.getVenue() != null) event.setVenue(req.getVenue());
        if (req.getBasePrice() != null) event.setBasePrice(req.getBasePrice());
        if (req.getTag() != null) event.setTag(req.getTag());
        if (req.getShortDesc() != null) event.setShortDesc(req.getShortDesc());
        if (req.getTicketBgImage() != null) event.setTicketBgImage(req.getTicketBgImage());

        Event savedEvent = eventRepository.save(event);
        return toDTO(savedEvent, false, OffsetDateTime.now());
    }

    @Transactional
    public void deleteEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    public EventDTO.EventResponseDTO toDTO(Event event, boolean includeSeats, OffsetDateTime now) {
        if (event == null) return null;

        EventDTO.EventResponseDTO dto = new EventDTO.EventResponseDTO();
        dto.setId(event.getId());
        dto.setEventCode(event.getEventCode());
        dto.setTitle(event.getTitle());
        dto.setCategory(event.getCategory());
        dto.setArtistOrHost(event.getArtistOrHost());
        dto.setDate(event.getDateStr());
        dto.setTime(event.getTimeStr());
        dto.setVenue(event.getVenue());
        dto.setBasePrice(event.getBasePrice());
        dto.setTotalSeats(event.getTotalSeats());
        dto.setAccentColor(event.getAccentColor());
        dto.setTag(event.getTag());
        dto.setShortDesc(event.getShortDesc());
        dto.setTicketBgImage(event.getTicketBgImage());
        dto.setStartTimestamp(event.getStartTimestamp() != null ? event.getStartTimestamp().toInstant().toEpochMilli() : null);
        dto.setEndTimestamp(event.getEndTimestamp() != null ? event.getEndTimestamp().toInstant().toEpochMilli() : null);

        // Calculate real-time seat statistics
        List<Seat> seats = seatRepository.findByEventIdOrderByRowLabelAscSeatNumberAsc(event.getId());
        long booked = 0;
        long locked = 0;
        long available = 0;

        for (Seat s : seats) {
            boolean isLockedAndActive = "locked".equalsIgnoreCase(s.getStatus())
                    && s.getLockExpiresAt() != null
                    && s.getLockExpiresAt().isAfter(now);

            if ("booked".equalsIgnoreCase(s.getStatus())) {
                booked++;
            } else if (isLockedAndActive) {
                locked++;
            } else {
                available++;
            }
        }

        dto.setBookedSeatsCount(booked);
        dto.setLockedSeatsCount(locked);
        dto.setAvailableSeats(available);

        if (includeSeats) {
            dto.setSeats(seats.stream().map(s -> seatService.toDTO(s, now)).collect(Collectors.toList()));
        }

        return dto;
    }
}
