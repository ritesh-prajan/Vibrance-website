package com.vibrance.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "concurrency_sim_txs")
public class ConcurrencySimTx {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "run_id", nullable = false)
    private ConcurrencySimRun run;

    @Column(name = "tx_id", nullable = false, length = 32)
    private String txId;

    @Column(name = "client_id", length = 64)
    private String clientId;

    @Column(name = "client_name", nullable = false, length = 128)
    private String clientName;

    @Column(nullable = false, length = 32)
    private String status; // 'PENDING', 'ACQUIRING_LOCK', 'COMMITTED', 'REJECTED', 'DEADLOCK'

    @Column(name = "current_step", length = 128)
    private String currentStep;

    @Column(name = "latency_ms", nullable = false)
    private Long latencyMs = 0L;

    @Column(name = "seat_claimed", length = 64)
    private String seatClaimed;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "executed_at", nullable = false)
    private OffsetDateTime executedAt;

    public ConcurrencySimTx() {}

    @PrePersist
    protected void onCreate() {
        if (this.executedAt == null) {
            this.executedAt = OffsetDateTime.now();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ConcurrencySimRun getRun() { return run; }
    public void setRun(ConcurrencySimRun run) { this.run = run; }

    public String getTxId() { return txId; }
    public void setTxId(String txId) { this.txId = txId; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrentStep() { return currentStep; }
    public void setCurrentStep(String currentStep) { this.currentStep = currentStep; }

    public Long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }

    public String getSeatClaimed() { return seatClaimed; }
    public void setSeatClaimed(String seatClaimed) { this.seatClaimed = seatClaimed; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public OffsetDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(OffsetDateTime executedAt) { this.executedAt = executedAt; }
}
