package com.equiptrack.platformservice.repository;

import com.equiptrack.platformservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserID(String userID);
    boolean existsByEmail(String email);
    boolean existsByUserID(String userID);
    List<User> findByStatus(User.Status status);
}
