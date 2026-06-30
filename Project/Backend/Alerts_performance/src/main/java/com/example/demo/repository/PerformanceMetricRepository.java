package com.example.demo.repository;

import com.example.demo.entity.PerformanceMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PerformanceMetricRepository extends JpaRepository<PerformanceMetric, Long> {

    List<PerformanceMetric> findByEquipmentId(String equipmentId);

    List<PerformanceMetric> findByEquipmentIdAndTimestampBetween(String equipmentId, LocalDateTime start, LocalDateTime end);
}
