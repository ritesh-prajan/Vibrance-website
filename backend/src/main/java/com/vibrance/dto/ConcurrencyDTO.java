package com.vibrance.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ConcurrencyDTO {

    public static class ConcurrencySimRequest {
        private String strategy = "TWO_PHASE_LOCKING"; // 'NO_LOCKING', 'TWO_PHASE_LOCKING', 'OPTIMISTIC_OCC'
        private Integer concurrencyLevel = 25;
        private UUID targetEventId;

        public ConcurrencySimRequest() {}

        public String getStrategy() { return strategy; }
        public void setStrategy(String strategy) { this.strategy = strategy; }

        public Integer getConcurrencyLevel() { return concurrencyLevel; }
        public void setConcurrencyLevel(Integer concurrencyLevel) { this.concurrencyLevel = concurrencyLevel; }

        public UUID getTargetEventId() { return targetEventId; }
        public void setTargetEventId(UUID targetEventId) { this.targetEventId = targetEventId; }
    }

    public static class SideBySideSimRequest {
        private Integer concurrencyLevel = 25;
        private UUID targetEventId;

        public SideBySideSimRequest() {}

        public Integer getConcurrencyLevel() { return concurrencyLevel; }
        public void setConcurrencyLevel(Integer concurrencyLevel) { this.concurrencyLevel = concurrencyLevel; }

        public UUID getTargetEventId() { return targetEventId; }
        public void setTargetEventId(UUID targetEventId) { this.targetEventId = targetEventId; }
    }

    public static class SimulatedTxDTO {
        private String txId;
        private String clientId;
        private String clientName;
        private String status;
        private String currentStep;
        private Long timestamp;
        private Long latencyMs;
        private String seatClaimed;
        private String message;

        public SimulatedTxDTO() {}

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

        public Long getTimestamp() { return timestamp; }
        public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

        public Long getLatencyMs() { return latencyMs; }
        public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }

        public String getSeatClaimed() { return seatClaimed; }
        public void setSeatClaimed(String seatClaimed) { this.seatClaimed = seatClaimed; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ConcurrencyRunResultDTO {
        private String runId;
        private String strategy;
        private UUID targetEventId;
        private String targetEventTitle;
        private Integer concurrencyLevel;
        private Integer successfulCount;
        private Integer rejectedCount;
        private Integer deadlockCount;
        private Integer initialStock;
        private Integer finalStock;
        private Long durationMs;
        private Boolean overbookingDetected;
        private Integer overbookedSeats;
        private List<SimulatedTxDTO> transactions = new ArrayList<>();
        private List<String> dbLogs = new ArrayList<>();

        public ConcurrencyRunResultDTO() {}

        public String getRunId() { return runId; }
        public void setRunId(String runId) { this.runId = runId; }

        public String getStrategy() { return strategy; }
        public void setStrategy(String strategy) { this.strategy = strategy; }

        public UUID getTargetEventId() { return targetEventId; }
        public void setTargetEventId(UUID targetEventId) { this.targetEventId = targetEventId; }

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

        public List<SimulatedTxDTO> getTransactions() { return transactions; }
        public void setTransactions(List<SimulatedTxDTO> transactions) { this.transactions = transactions; }

        public List<String> getDbLogs() { return dbLogs; }
        public void setDbLogs(List<String> dbLogs) { this.dbLogs = dbLogs; }
    }

    public static class SideBySideResultDTO {
        private ConcurrencyRunResultDTO noLockResult;
        private ConcurrencyRunResultDTO twoPlResult;

        public SideBySideResultDTO() {}

        public SideBySideResultDTO(ConcurrencyRunResultDTO noLockResult, ConcurrencyRunResultDTO twoPlResult) {
            this.noLockResult = noLockResult;
            this.twoPlResult = twoPlResult;
        }

        public ConcurrencyRunResultDTO getNoLockResult() { return noLockResult; }
        public void setNoLockResult(ConcurrencyRunResultDTO noLockResult) { this.noLockResult = noLockResult; }

        public ConcurrencyRunResultDTO getTwoPlResult() { return twoPlResult; }
        public void setTwoPlResult(ConcurrencyRunResultDTO twoPlResult) { this.twoPlResult = twoPlResult; }
    }
}
