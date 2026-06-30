package com.equiptrack.platformservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.equiptrack.platformservice.dto.AlertResponse;
import java.util.List;

@FeignClient(name = "ALERTS-PERFORMANCE-SERVICE")
public interface AlertServiceClient {
    
    @GetMapping("/api/alerts")
    List<AlertResponse> getAllAlerts();
    
    @GetMapping("/api/alerts/active")
    List<AlertResponse> getActiveAlerts();
    
    @GetMapping("/api/alerts/equipment/{equipmentId}")
    List<AlertResponse> getAlertsByEquipment(@PathVariable("equipmentId") String equipmentId);
    
    @GetMapping("/api/alerts/summary")
    AlertSummary getAlertSummary();
    
    public static class AlertSummary {
        private Long totalAlerts;
        private Long criticalAlerts;
        private Long warningAlerts;
        private Long infoAlerts;
        private Long resolvedAlerts;
        
        public Long getTotalAlerts() { return totalAlerts; }
        public void setTotalAlerts(Long totalAlerts) { this.totalAlerts = totalAlerts; }
        public Long getCriticalAlerts() { return criticalAlerts; }
        public void setCriticalAlerts(Long criticalAlerts) { this.criticalAlerts = criticalAlerts; }
        public Long getWarningAlerts() { return warningAlerts; }
        public void setWarningAlerts(Long warningAlerts) { this.warningAlerts = warningAlerts; }
        public Long getInfoAlerts() { return infoAlerts; }
        public void setInfoAlerts(Long infoAlerts) { this.infoAlerts = infoAlerts; }
        public Long getResolvedAlerts() { return resolvedAlerts; }
        public void setResolvedAlerts(Long resolvedAlerts) { this.resolvedAlerts = resolvedAlerts; }
    }
}