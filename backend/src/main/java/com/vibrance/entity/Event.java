package com.vibrance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "event_code", unique = true, nullable = false, length = 32)
    private String eventCode;

    @Column(nullable = false, length = 128)
    private String title;

    @Column(nullable = false, length = 32)
    private String category; // 'PRO_SHOW', 'EDM', 'BATTLE_OF_BANDS', 'DANCE', 'HACKATHON', 'COMEDY'

    @Column(name = "artist_or_host", nullable = false, length = 128)
    private String artistOrHost;

    @Column(name = "date_str", nullable = false, length = 64)
    private String dateStr;

    @Column(name = "time_str", nullable = false, length = 32)
    private String timeStr;

    @Column(nullable = false, length = 128)
    private String venue;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "accent_color", length = 32)
    private String accentColor;

    @Column(length = 128)
    private String tag;

    @Column(name = "short_desc", columnDefinition = "TEXT")
    private String shortDesc;

    @Column(name = "ticket_bg_image", columnDefinition = "TEXT")
    private String ticketBgImage;

    @Column(name = "start_timestamp", nullable = false)
    private OffsetDateTime startTimestamp;

    @Column(name = "end_timestamp", nullable = false)
    private OffsetDateTime endTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();

    public Event() {}

    public Event(String eventCode, String title, String category, String artistOrHost, String dateStr, String timeStr, String venue, BigDecimal basePrice, Integer totalSeats) {
        this.eventCode = eventCode;
        this.title = title;
        this.category = category;
        this.artistOrHost = artistOrHost;
        this.dateStr = dateStr;
        this.timeStr = timeStr;
        this.venue = venue;
        this.basePrice = basePrice;
        this.totalSeats = totalSeats;
        this.startTimestamp = OffsetDateTime.now();
        this.endTimestamp = OffsetDateTime.now().plusHours(3);
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.totalSeats == null) {
            this.totalSeats = 48;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

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

    public String getDateStr() { return dateStr; }
    public void setDateStr(String dateStr) { this.dateStr = dateStr; }

    public String getTimeStr() { return timeStr; }
    public void setTimeStr(String timeStr) { this.timeStr = timeStr; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getShortDesc() { return shortDesc; }
    public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

    public String getTicketBgImage() { return ticketBgImage; }
    public void setTicketBgImage(String ticketBgImage) { this.ticketBgImage = ticketBgImage; }

    public OffsetDateTime getStartTimestamp() { return startTimestamp; }
    public void setStartTimestamp(OffsetDateTime startTimestamp) { this.startTimestamp = startTimestamp; }

    public OffsetDateTime getEndTimestamp() { return endTimestamp; }
    public void setEndTimestamp(OffsetDateTime endTimestamp) { this.endTimestamp = endTimestamp; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }
}
