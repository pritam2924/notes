package com.equiptrack.platformservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.equiptrack.platformservice.dto.EquipmentResponse;
import java.util.List;

@FeignClient(name = "EQUIPMENT-SERVICE")
public interface EquipmentServiceClient {
    
    @GetMapping("/api/equipment")
    List<EquipmentResponse> getAllEquipment();
    
    @GetMapping("/api/equipment/{id}")
    EquipmentResponse getEquipmentById(@PathVariable("id") String id);
    
    @GetMapping("/api/equipment/summary")
    EquipmentSummary getEquipmentSummary();
    
    public static class EquipmentSummary {
        private Long totalEquipment;
        private Long activeEquipment;
        private Long maintenanceEquipment;
        private Long inactiveEquipment;
        
        public Long getTotalEquipment() { return totalEquipment; }
        public void setTotalEquipment(Long totalEquipment) { this.totalEquipment = totalEquipment; }
        public Long getActiveEquipment() { return activeEquipment; }
        public void setActiveEquipment(Long activeEquipment) { this.activeEquipment = activeEquipment; }
        public Long getMaintenanceEquipment() { return maintenanceEquipment; }
        public void setMaintenanceEquipment(Long maintenanceEquipment) { this.maintenanceEquipment = maintenanceEquipment; }
        public Long getInactiveEquipment() { return inactiveEquipment; }
        public void setInactiveEquipment(Long inactiveEquipment) { this.inactiveEquipment = inactiveEquipment; }
    }
}