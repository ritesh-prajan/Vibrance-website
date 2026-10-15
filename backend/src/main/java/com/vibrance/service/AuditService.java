package com.vibrance.service;

import com.vibrance.dto.AuditDTO;
import com.vibrance.entity.AuditLog;
import com.vibrance.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog recordLog(String action, UUID eventId, String eventTitle, String seatLabel,
                             String userName, String regNumber, String status, String protocol, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEventId(eventId != null ? eventId.toString() : null);
        log.setEventTitle(eventTitle);
        log.setSeatLabel(seatLabel);
        log.setUserName(userName);
        log.setRegNumber(regNumber);
        log.setStatus(status != null ? status : "SUCCESS");
        log.setProtocol(protocol != null ? protocol : "2PL_STRICT");
        log.setDetails(details);
        return auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditDTO.AuditLogResponseDTO> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearLogs() {
        auditLogRepository.deleteAll();
    }

    @Transactional(readOnly = true)
    public String exportLogsAsCsv() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        StringBuilder sb = new StringBuilder();
        sb.append("LogID,Timestamp,Action,EventID,EventTitle,SeatLabel,UserName,RegNumber,Status,Protocol,Details\n");

        for (AuditLog l : logs) {
            sb.append(escapeCsv(l.getId().toString())).append(",")
              .append(l.getCreatedAt() != null ? l.getCreatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : "").append(",")
              .append(escapeCsv(l.getAction())).append(",")
              .append(escapeCsv(l.getEventId())).append(",")
              .append(escapeCsv(l.getEventTitle())).append(",")
              .append(escapeCsv(l.getSeatLabel())).append(",")
              .append(escapeCsv(l.getUserName())).append(",")
              .append(escapeCsv(l.getRegNumber())).append(",")
              .append(escapeCsv(l.getStatus())).append(",")
              .append(escapeCsv(l.getProtocol())).append(",")
              .append(escapeCsv(l.getDetails())).append("\n");
        }
        return sb.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }

    public AuditDTO.AuditLogResponseDTO toDTO(AuditLog log) {
        AuditDTO.AuditLogResponseDTO dto = new AuditDTO.AuditLogResponseDTO();
        dto.setId(log.getId());
        dto.setTimestamp(log.getCreatedAt() != null ? log.getCreatedAt().toInstant().toEpochMilli() : System.currentTimeMillis());
        dto.setAction(log.getAction());
        dto.setEventId(log.getEventId());
        dto.setEventTitle(log.getEventTitle());
        dto.setSeatLabel(log.getSeatLabel());
        dto.setUserName(log.getUserName());
        dto.setRegNumber(log.getRegNumber());
        dto.setStatus(log.getStatus());
        dto.setProtocol(log.getProtocol());
        dto.setDetails(log.getDetails());
        return dto;
    }
}
