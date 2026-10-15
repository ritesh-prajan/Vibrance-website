package com.vibrance.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "concurrency_sim_runs")
public class ConcurrencySimRun {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "run_id", unique = true, nullable = false, length = 64)
    private String runId;

    @Column(nullable = false, length = 32)
    private String strategy; // 'NO_LOCKING', 'TWO_PHASE_LOCKING', 'OPTIMISTIC_OCC'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_event_id")
    private Event targetEvent;

    @Column(name = "target_event_title", nullable = false, length = 128)
    private String targetEventTitle;

    @Column(name = "concurrency_level", nullable = false)
    private Integer concurrencyLevel;

    @Column(name = "successful_count", nullable = false)
    private Integer successfulCount = 0;

    @Column(name = "rejected_count", nullable = false)
    private Integer rejectedCount = 0;

    @Column(name = "deadlock_count", nullable = false)
    private Integer deadlockCount = 0;

    @Column(name = "initial_stock", nullable = false)
    private Integer initialStock = 0;

    @Column(name = "final_stock", nullable = false)
    private Integer finalStock = 0;

    @Column(name = "duration_ms", nullable = false)
    private Long durationMs = 0L;

    @Column(name = "overbooking_detected", nullable = false)
    private Boolean overbookingDetected = false;

    @Column(name = "overbooked_seats", nullable = false)
    private Integer overbookedSeats = 0;

    @Column(name = "executed_at", nullable = false)
    private OffsetDateTime executedAt;

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ConcurrencySimTx> transactions = new ArrayList<>();

    public ConcurrencySimRun() {}

    @PrePersist
    protected void onCreate() {
        if (this.executedAt == null) {
            this.executedAt = OffsetDateTime.now();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRunId() { return runId; }
    public void setRunId(String runId) { this.runId = runId; }

    public String getStrategy() { return strategy; }
    public void setStrategy(String strategy) { this.strategy = strategy; }

    public Event getTargetEvent() { return targetEvent; }
    public void setTargetEvent(Event targetEvent) { this.targetEvent = targetEvent; }

    public String getTargetEventTitle() { return targetEventTitle; }
    public void setTargetEventTitle(String targetEventTitle) { this.targetEventTitle = targetEventTitle; }

    public Integer getConcurrencyLevel() { return concurrencyLevel; }
    public void setConcurrencyLevel(Integer concurrencyLevel) { this.concurrencyLevel = concurrencyLevel; }

    public Integer getSuccessfulCount() { return successfulCount; }
    public void setSuccessfulCount(Integer successfulCount) { this.successfulCount = successfulCount; }

    public Integer getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(Integer rejectedCount) { this.rejectedCount = rejectedCount; }

    public Integer getDeadlockCount() { return deadlockCount; }
    public void setDeadlockCount(Integer deadlockCount) { this.deadlockCount = deadlockCount; }

    public Integer getInitialStock() { return initialStock; }
    public void setInitialStock(Integer initialStock) { this.initialStock = initialStock; }

    public Integer getFinalStock() { return finalStock; }
    public void setFinalStock(Integer finalStock) { this.finalStock = finalStock; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public Boolean getOverbookingDetected() { return overbookingDetected; }
    public void setOverbookingDetected(Boolean overbookingDetected) { this.overbookingDetected = overbookingDetected; }

    public Integer getOverbookedSeats() { return overbookedSeats; }
    public void setOverbookedSeats(Integer overbookedSeats) { this.overbookedSeats = overbookedSeats; }

    public OffsetDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(OffsetDateTime executedAt) { this.executedAt = executedAt; }

    public List<ConcurrencySimTx> getTransactions() { return transactions; }
    public void setTransactions(List<ConcurrencySimTx> transactions) { this.transactions = transactions; }
}
