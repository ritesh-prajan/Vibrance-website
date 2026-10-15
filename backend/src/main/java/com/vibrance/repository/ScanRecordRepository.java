package com.vibrance.repository;

import com.vibrance.entity.ScanRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScanRecordRepository extends JpaRepository<ScanRecord, UUID> {
    List<ScanRecord> findAllByOrderByScannedAtDesc();
    List<ScanRecord> findByStaffUserIdOrderByScannedAtDesc(UUID staffUserId);
    List<ScanRecord> findByBookingId(UUID bookingId);
}
