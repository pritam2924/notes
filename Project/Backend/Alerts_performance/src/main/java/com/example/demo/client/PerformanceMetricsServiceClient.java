package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.dto.PerformanceMetricResponse;
import java.util.List;

@FeignClient(name = "performance-metrics-service")
public interface PerformanceMetricsServiceClient {
    
    @GetMapping("/api/performance-metrics/equipment/{equipmentId}")
    List<PerformanceMetricResponse> getMetricsByEquipmentId(@PathVariable("equipmentId") Long equipmentId);
    
    @GetMapping("/api/performance-metrics/threshold-violations/{equipmentId}")
    List<PerformanceMetricResponse> getThresholdViolations(@PathVariable("equipmentId") Long equipmentId);
    
    @PostMapping("/api/performance-metrics/alert-created")
    void notifyAlertCreated(@RequestBody AlertNotification alertNotification);
    
    public static class AlertNotification {
        private Long equipmentId;
        private String alertType;
        private String message;
        
        // Constructors
        public AlertNotification() {}
        
        public AlertNotification(Long equipmentId, String alertType, String message) {
            this.equipmentId = equipmentId;
            this.alertType = alertType;
            this.message = message;
        }
        
        // Getters and setters
        public Long getEquipmentId() { return equipmentId; }
        public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }
        public String getAlertType() { return alertType; }
        public void setAlertType(String alertType) { this.alertType = alertType; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}