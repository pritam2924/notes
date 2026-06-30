package com.example.demo.service;

import com.example.demo.dto.PerformanceMetricRequest;
import com.example.demo.dto.PerformanceMetricResponse;
import com.example.demo.entity.PerformanceMetric;
import com.example.demo.repository.PerformanceMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceMetricService {

    private final PerformanceMetricRepository repository;
    private final ModelMapper modelMapper;

    public PerformanceMetricResponse createMetric(PerformanceMetricRequest request) {
        log.info("Creating performance metric for equipment: {}", request.getEquipmentId());
        PerformanceMetric metric = modelMapper.map(request, PerformanceMetric.class);
        PerformanceMetric saved = repository.save(metric);
        log.info("Performance metric created with ID: {}", saved.getId());
        return modelMapper.map(saved, PerformanceMetricResponse.class);
    }

    public List<PerformanceMetricResponse> getAllMetrics() {
        log.info("Retrieving all performance metrics");
        return repository.findAll().stream()
                .map(metric -> modelMapper.map(metric, PerformanceMetricResponse.class))
                .collect(Collectors.toList());
    }

    public PerformanceMetricResponse getMetricById(Long id) {
        log.info("Retrieving performance metric with ID: {}", id);
        PerformanceMetric metric = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric not found"));
        return modelMapper.map(metric, PerformanceMetricResponse.class);
    }

    public List<PerformanceMetricResponse> getMetricsByEquipment(String equipmentId) {
        log.info("Retrieving metrics for equipment: {}", equipmentId);
        return repository.findByEquipmentId(equipmentId).stream()
                .map(metric -> modelMapper.map(metric, PerformanceMetricResponse.class))
                .collect(Collectors.toList());
    }

    public List<PerformanceMetricResponse> getMetricsByEquipmentAndTimeRange(String equipmentId, LocalDateTime start, LocalDateTime end) {
        log.info("Retrieving metrics for equipment {} between {} and {}", equipmentId, start, end);
        return repository.findByEquipmentIdAndTimestampBetween(equipmentId, start, end).stream()
                .map(metric -> modelMapper.map(metric, PerformanceMetricResponse.class))
                .collect(Collectors.toList());
    }
}
