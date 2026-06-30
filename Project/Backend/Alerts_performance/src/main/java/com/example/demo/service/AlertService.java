package com.example.demo.service;

import com.example.demo.dto.AlertRequest;
import com.example.demo.dto.AlertResponse;
import com.example.demo.dto.GroupedAlertResponse;
import com.example.demo.entity.Alert;
import com.example.demo.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertRepository repository;

    public AlertResponse createAlert(AlertRequest request) {
        try {
            log.info("Creating alert for equipment: {}", request.getEquipmentId());
            
            Alert alert = new Alert();
            alert.setEquipmentId(request.getEquipmentId());
            alert.setEquipmentName(request.getEquipmentName());
            alert.setCategory(request.getCategory());
            alert.setSeverity(request.getSeverity());
            alert.setMessage(request.getMessage());
            alert.setStatus(request.getStatus() != null ? request.getStatus() : "open");
            alert.setMetricType(request.getMetricType());
            alert.setMetricValue(request.getMetricValue());
            alert.setThresholdValue(request.getThresholdValue());
            alert.setNotes(request.getNotes());
            alert.setTimestamp(LocalDateTime.now());
            
            Alert saved = repository.save(alert);
            log.info("Alert created with ID: {}", saved.getId());
            
            // Manual mapping to response
            AlertResponse response = new AlertResponse();
            response.setId(saved.getId());
            response.setEquipmentId(saved.getEquipmentId());
            response.setEquipmentName(saved.getEquipmentName());
            response.setCategory(saved.getCategory());
            response.setSeverity(saved.getSeverity());
            response.setMessage(saved.getMessage());
            response.setStatus(saved.getStatus());
            response.setTimestamp(saved.getTimestamp());
            response.setMetricType(saved.getMetricType());
            response.setMetricValue(saved.getMetricValue());
            response.setThresholdValue(saved.getThresholdValue());
            response.setNotes(saved.getNotes());
            
            return response;
        } catch (Exception e) {
            log.error("Error creating alert: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create alert: " + e.getMessage());
        }
    }

    public List<AlertResponse> getAllAlerts() {
        log.info("Retrieving all alerts");
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AlertResponse getAlertById(String id) {
        log.info("Retrieving alert with ID: {}", id);
        Alert alert = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        return mapToResponse(alert);
    }

    public List<AlertResponse> getAlertsByEquipment(String equipmentId) {
        log.info("Retrieving alerts for equipment: {}", equipmentId);
        List<Alert> alerts = repository.findByEquipmentId(equipmentId);
        if (alerts.isEmpty()) {
            log.info("No alerts found for equipment: {}", equipmentId);
        }
        return alerts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AlertResponse> getAlertsByStatus(String status) {
        log.info("Retrieving alerts with status: {}", status);
        List<Alert> alerts = repository.findByStatus(status);
        if (alerts.isEmpty()) {
            log.info("No alerts found with status: {}", status);
        }
        return alerts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AlertResponse updateAlertStatus(String id, String status) {
        log.info("Updating alert {} status to {}", id, status);
        Alert alert = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus(status);
        Alert updated = repository.save(alert);
        return mapToResponse(updated);
    }

    public void deleteAlert(String id) {
        log.info("Deleting alert with ID: {}", id);
        if (!repository.existsById(id)) {
            throw new RuntimeException("Alert not found with ID: " + id);
        }
        repository.deleteById(id);
        log.info("Alert deleted successfully: {}", id);
    }

    public GroupedAlertResponse getGroupedAlertsByEquipment(String equipmentId) {
        log.info("Retrieving grouped alerts for equipment: {}", equipmentId);
        List<Alert> alerts = repository.findByEquipmentIdAndStatus(equipmentId, "open");

        GroupedAlertResponse response = new GroupedAlertResponse();
        response.setId(equipmentId);
        response.setEquipmentId(equipmentId);
        response.setStatus("open");
        response.setTimestamp(LocalDateTime.now());
        
        if (!alerts.isEmpty()) {
            response.setEquipmentName(alerts.get(0).getEquipmentName());
            response.setCategory(alerts.get(0).getCategory());
        }
        
        return response;
    }
    
    private AlertResponse mapToResponse(Alert alert) {
        AlertResponse response = new AlertResponse();
        response.setId(alert.getId());
        response.setEquipmentId(alert.getEquipmentId());
        response.setEquipmentName(alert.getEquipmentName());
        response.setCategory(alert.getCategory());
        response.setSeverity(alert.getSeverity());
        response.setMessage(alert.getMessage());
        response.setStatus(alert.getStatus());
        response.setTimestamp(alert.getTimestamp());
        response.setMetricType(alert.getMetricType());
        response.setMetricValue(alert.getMetricValue());
        response.setThresholdValue(alert.getThresholdValue());
        response.setNotes(alert.getNotes());
        return response;
    }
}
