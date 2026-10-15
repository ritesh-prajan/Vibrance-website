package com.vibrance.repository;

import com.vibrance.entity.ConcurrencySimRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConcurrencySimRunRepository extends JpaRepository<ConcurrencySimRun, UUID> {
    Optional<ConcurrencySimRun> findByRunId(String runId);
    List<ConcurrencySimRun> findAllByOrderByExecutedAtDesc();
}
