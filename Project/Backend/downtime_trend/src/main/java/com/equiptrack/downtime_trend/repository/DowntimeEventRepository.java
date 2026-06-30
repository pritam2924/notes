package com.equiptrack.downtime_trend.repository;

import com.equiptrack.downtime_trend.entity.DowntimeEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DowntimeEventRepository extends JpaRepository<DowntimeEvent, String> {
    List<DowntimeEvent> findAllByOrderByDowntimeStartDesc();
    List<DowntimeEvent> findByIsOngoingTrue();
    Optional<DowntimeEvent> findByEquipmentIdAndMaintenanceTaskId(String equipmentId, String maintenanceTaskId);
    long countByDowntimeStartBetween(LocalDateTime start, LocalDateTime end);
}