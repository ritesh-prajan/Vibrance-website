package com.vibrance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class EventDTO {

    public static class EventResponseDTO {
        private UUID id;
        private String eventCode;
        private String title;
        private String category;
        private String artistOrHost;
        private String date;
        private String time;
        private String venue;
        private BigDecimal basePrice;
        private Integer totalSeats;
        private Long availableSeats;
        private Long lockedSeatsCount;
        private Long bookedSeatsCount;
        private String accentColor;
        private String tag;
        private String shortDesc;
        private String ticketBgImage;
        private Long startTimestamp;
        private Long endTimestamp;
        private List<SeatDTO.SeatResponseDTO> seats = new ArrayList<>();

        public EventResponseDTO() {}

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getEventCode() { return eventCode; }
        public void setEventCode(String eventCode) { this.eventCode = eventCode; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getArtistOrHost() { return artistOrHost; }
        public void setArtistOrHost(String artistOrHost) { this.artistOrHost = artistOrHost; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getVenue() { return venue; }
        public void setVenue(String venue) { this.venue = venue; }

        public BigDecimal getBasePrice() { return basePrice; }
        public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

        public Long getAvailableSeats() { return availableSeats; }
        public void setAvailableSeats(Long availableSeats) { this.availableSeats = availableSeats; }

        public Long getLockedSeatsCount() { return lockedSeatsCount; }
        public void setLockedSeatsCount(Long lockedSeatsCount) { this.lockedSeatsCount = lockedSeatsCount; }

        public Long getBookedSeatsCount() { return bookedSeatsCount; }
        public void setBookedSeatsCount(Long bookedSeatsCount) { this.bookedSeatsCount = bookedSeatsCount; }

        public String getAccentColor() { return accentColor; }
        public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

        public String getTag() { return tag; }
        public void setTag(String tag) { this.tag = tag; }

        public String getShortDesc() { return shortDesc; }
        public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

        public String getTicketBgImage() { return ticketBgImage; }
        public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }

        public Long getStartTimestamp() { return startTimestamp; }
        public void setStartTimestamp(Long startTimestamp) { this.startTimestamp = startTimestamp; }

        public Long getEndTimestamp() { return endTimestamp; }
        public void setEndTimestamp(Long endTimestamp) { this.endTimestamp = endTimestamp; }

        public List<SeatDTO.SeatResponseDTO> getSeats() { return seats; }
        public void setSeats(List<SeatDTO.SeatResponseDTO> seats) { this.seats = seats; }
    }

    public static class CreateEventRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Category is required")
        private String category;

        @NotBlank(message = "Artist or Host is required")
        private String artistOrHost;

        private String date;
        private String time;
        private String venue;

        @NotNull(message = "Base price is required")
        @Positive(message = "Base price must be positive")
        private BigDecimal basePrice;

        private Integer totalSeats = 48;
        private String tag;
        private String shortDesc;
        private String ticketBgImage;
        private Integer startOffsetHours;

        public CreateEventRequest() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getArtistOrHost() { return artistOrHost; }
        public void setArtistOrHost(String artistOrHost) { this.artistOrHost = artistOrHost; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getVenue() { return venue; }
        public void setVenue(String venue) { this.venue = venue; }

        public BigDecimal getBasePrice() { return basePrice; }
        public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

        public String getTag() { return tag; }
        public void setTag(String tag) { this.tag = tag; }

        public String getShortDesc() { return shortDesc; }
        public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

        public String getTicketBgImage() { return ticketBgImage; }
        public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }

        public Integer getStartOffsetHours() { return startOffsetHours; }
        public void setStartOffsetHours(Integer startOffsetHours) { this.startOffsetHours = startOffsetHours; }
    }

    public static class UpdateEventRequest {
        private String title;
        private String category;
        private String artistOrHost;
        private String date;
        private String time;
        private String venue;
        private BigDecimal basePrice;
        private Integer totalSeats;
        private String tag;
        private String shortDesc;
        private String ticketBgImage;

        public UpdateEventRequest() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getArtistOrHost() { return artistOrHost; }
        public void setArtistOrHost(String artistOrHost) { this.artistOrHost = artistOrHost; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getVenue() { return venue; }
        public void setVenue(String venue) { this.venue = venue; }

        public BigDecimal getBasePrice() { return basePrice; }
        public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

        public String getTag() { return tag; }
        public void setTag(String tag) { this.tag = tag; }

        public String getShortDesc() { return shortDesc; }
        public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

        public String getTicketBgImage() { return ticketBgImage; }
        public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }
    }
}
