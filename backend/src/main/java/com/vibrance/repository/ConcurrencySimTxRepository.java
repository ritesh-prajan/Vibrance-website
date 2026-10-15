package com.vibrance.repository;

import com.vibrance.entity.ConcurrencySimTx;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConcurrencySimTxRepository extends JpaRepository<ConcurrencySimTx, UUID> {
    List<ConcurrencySimTx> findByRunIdOrderByExecutedAtAsc(UUID runId);
}
