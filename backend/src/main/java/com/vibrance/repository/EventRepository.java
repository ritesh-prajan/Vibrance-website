package com.vibrance.repository;

import com.vibrance.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findByEventCode(String eventCode);
    List<Event> findByCategoryOrderByStartTimestampAsc(String category);
    List<Event> findAllByOrderByStartTimestampAsc();
}
