package com.example.demo.controller;

import com.example.demo.dto.AlertRequest;
import com.example.demo.dto.AlertResponse;
import com.example.demo.dto.GroupedAlertResponse;
import com.example.demo.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Alerts", description = "API for managing alerts")
public class AlertController {

    private final AlertService service;

    @PostMapping
    @Operation(summary = "Create a new alert")
    public ResponseEntity<AlertResponse> createAlert(@Valid @RequestBody AlertRequest request) {
        log.info("Received request to create alert for equipment: {}", request.getEquipmentId());
        AlertResponse response = service.createAlert(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all alerts")
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        log.info("Received request to get all alerts");
        List<AlertResponse> alerts = service.getAllAlerts();
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert by ID")
    public ResponseEntity<AlertResponse> getAlertById(@PathVariable String id) {
        log.info("Received request to get alert with ID: {}", id);
        AlertResponse alert = service.getAlertById(id);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get alerts by equipment ID")
    public ResponseEntity<List<AlertResponse>> getAlertsByEquipment(@PathVariable String equipmentId) {
        log.info("Received request to get alerts for equipment: {}", equipmentId);
        List<AlertResponse> alerts = service.getAlertsByEquipment(equipmentId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get alerts by status")
    public ResponseEntity<List<AlertResponse>> getAlertsByStatus(@PathVariable String status) {
        log.info("Received request to get alerts with status: {}", status);
        List<AlertResponse> alerts = service.getAlertsByStatus(status);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/open")
    @Operation(summary = "Get open alerts")
    public ResponseEntity<List<AlertResponse>> getOpenAlerts() {
        log.info("Received request to get open alerts");
        List<AlertResponse> alerts = service.getAlertsByStatus("open");
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/acknowledged")
    @Operation(summary = "Get acknowledged alerts")
    public ResponseEntity<List<AlertResponse>> getAcknowledgedAlerts() {
        log.info("Received request to get acknowledged alerts");
        List<AlertResponse> alerts = service.getAlertsByStatus("acknowledged");
        return ResponseEntity.ok(alerts);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update alert status")
    public ResponseEntity<AlertResponse> updateAlertStatus(@PathVariable String id, @RequestParam String status) {
        log.info("Received request to update alert {} status to {}", id, status);
        AlertResponse updatedAlert = service.updateAlertStatus(id, status);
        return ResponseEntity.ok(updatedAlert);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update alert status (PATCH)")
    public ResponseEntity<AlertResponse> patchAlertStatus(
            @PathVariable String id, 
            @RequestBody java.util.Map<String, String> updates) {
        String status = updates.get("status");
        log.info("Received PATCH request to update alert {} status to {}", id, status);
        AlertResponse updatedAlert = service.updateAlertStatus(id, status);
        return ResponseEntity.ok(updatedAlert);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete alert")
    public ResponseEntity<Void> deleteAlert(@PathVariable String id) {
        log.info("Received request to delete alert: {}", id);
        service.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/grouped/{equipmentId}")
    @Operation(summary = "Get grouped alerts by equipment ID")
    public ResponseEntity<GroupedAlertResponse> getGroupedAlertsByEquipment(@PathVariable String equipmentId) {
        log.info("Received request to get grouped alerts for equipment: {}", equipmentId);
        GroupedAlertResponse groupedAlert = service.getGroupedAlertsByEquipment(equipmentId);
        return ResponseEntity.ok(groupedAlert);
    }
}
