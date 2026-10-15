package com.vibrance.repository;

import com.vibrance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByRegNumber(String regNumber);
    Optional<User> findByEmail(String email);
    boolean existsByRegNumber(String regNumber);
    boolean existsByEmail(String email);
    List<User> findByRoleOrderByCreatedAtDesc(String role);
}
