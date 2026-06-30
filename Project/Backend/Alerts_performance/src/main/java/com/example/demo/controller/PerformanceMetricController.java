package com.example.demo.controller;

import com.example.demo.dto.PerformanceMetricRequest;
import com.example.demo.dto.PerformanceMetricResponse;
import com.example.demo.service.PerformanceMetricService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/performance-metrics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Performance Metrics", description = "API for managing performance metrics")
public class PerformanceMetricController {

    private final PerformanceMetricService service;

    @PostMapping
    @Operation(summary = "Create a new performance metric")
    public ResponseEntity<PerformanceMetricResponse> createMetric(@Valid @RequestBody PerformanceMetricRequest request) {
        log.info("Received request to create performance metric for equipment: {}", request.getEquipmentId());
        PerformanceMetricResponse response = service.createMetric(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all performance metrics")
    public ResponseEntity<List<PerformanceMetricResponse>> getAllMetrics() {
        log.info("Received request to get all performance metrics");
        List<PerformanceMetricResponse> metrics = service.getAllMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get performance metric by ID")
    public ResponseEntity<PerformanceMetricResponse> getMetricById(@PathVariable Long id) {
        log.info("Received request to get performance metric with ID: {}", id);
        PerformanceMetricResponse metric = service.getMetricById(id);
        return ResponseEntity.ok(metric);
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get performance metrics by equipment ID")
    public ResponseEntity<List<PerformanceMetricResponse>> getMetricsByEquipment(@PathVariable String equipmentId) {
        log.info("Received request to get metrics for equipment: {}", equipmentId);
        List<PerformanceMetricResponse> metrics = service.getMetricsByEquipment(equipmentId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/equipment/{equipmentId}/range")
    @Operation(summary = "Get performance metrics by equipment ID and time range")
    public ResponseEntity<List<PerformanceMetricResponse>> getMetricsByEquipmentAndTimeRange(
            @PathVariable String equipmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("Received request to get metrics for equipment {} between {} and {}", equipmentId, start, end);
        List<PerformanceMetricResponse> metrics = service.getMetricsByEquipmentAndTimeRange(equipmentId, start, end);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/equipment/{equipmentId}/recent")
    @Operation(summary = "Get recent performance metrics by equipment ID")
    public ResponseEntity<List<PerformanceMetricResponse>> getRecentMetrics(
            @PathVariable String equipmentId,
            @RequestParam(defaultValue = "1") int days) {
        log.info("Received request to get recent metrics for equipment {} for last {} days", equipmentId, days);
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(days);
        List<PerformanceMetricResponse> metrics = service.getMetricsByEquipmentAndTimeRange(equipmentId, start, end);
        return ResponseEntity.ok(metrics);
    }
}
