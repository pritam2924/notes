package cts.equipment.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EquipmentWithLifecycleResponse {
    private String id;
    private EquipmentDetails equipmentDetails;
    
    @Data
    public static class EquipmentDetails {
        private String equipmentName;
        private String category;
        private LocalDate installationDate;
        private String equipmentStatus;
        private String model;
        private Double weightKg;
        private Double powerKW;
        private String capacity;
        private String vendorId;
        private String vendorName;
        private String contactEmail;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<LifeCycleEntry> LifeCycleHistory;
    }
    
    @Data
    public static class LifeCycleEntry {
        private String status;
        private LocalDateTime date;
        private String cause;
        private String recommendations;
    }
}