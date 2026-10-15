package com.vibrance.repository;

import com.vibrance.entity.SimSeat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SimSeatRepository extends JpaRepository<SimSeat, UUID> {

    List<SimSeat> findByRunId(String runId);

    // 2PL Exclusive Row Lock for Simulation Isolation (SELECT ... FOR UPDATE)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SimSeat s WHERE s.id = :id")
    Optional<SimSeat> findByIdWithPessimisticLock(@Param("id") UUID id);

    // Unsafe No-Lock direct write on disposable simulation table
    @Modifying
    @Query(value = "UPDATE sim_seats SET status = 'booked', claimed_by = :claimedBy, version = version + 1, updated_at = CURRENT_TIMESTAMP WHERE id = :id", nativeQuery = true)
    int executeUnsafeNoLockSimulationBooking(@Param("id") UUID id, @Param("claimedBy") String claimedBy);
}
