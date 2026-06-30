package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "alert-service")
public interface AlertServiceClient {
    
    @PostMapping("/api/alerts")
    void createAlert(@RequestBody AlertRequest request);
    
    public static class AlertRequest {
        private String equipmentId;
        private String equipmentName;
        private String category;
        private String severity;
        private String status;
        private String metricType;
        private Double metricValue;
        private Double thresholdValue;
        private String notes;
        private Map<String, Double> metrics;
        private Map<String, String> levels;
        
        public AlertRequest() {}
        
        public String getEquipmentId() { return equipmentId; }
        public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }
        public String getEquipmentName() { return equipmentName; }
        public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getMetricType() { return metricType; }
        public void setMetricType(String metricType) { this.metricType = metricType; }
        public Double getMetricValue() { return metricValue; }
        public void setMetricValue(Double metricValue) { this.metricValue = metricValue; }
        public Double getThresholdValue() { return thresholdValue; }
        public void setThresholdValue(Double thresholdValue) { this.thresholdValue = thresholdValue; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public Map<String, Double> getMetrics() { return metrics; }
        public void setMetrics(Map<String, Double> metrics) { this.metrics = metrics; }
        public Map<String, String> getLevels() { return levels; }
        public void setLevels(Map<String, String> levels) { this.levels = levels; }
    }
}