package cts.equipment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Response containing complete equipment details including vendor information")
public class EquipmentResponse {
    
    @Schema(
            description = "Unique identifier for the equipment (auto-generated)",
            example = "EQ-001",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private String equipmentId;
    
    @Schema(
            description = "Name/title of the equipment",
            example = "Industrial CNC Machine"
    )
    private String equipmentName;
    
    @Schema(
            description = "Category or type of equipment",
            example = "Manufacturing"
    )
    private String category;
    
    @Schema(
            description = "Date when the equipment was installed",
            example = "2024-01-15",
            type = "string",
            format = "date"
    )
    private LocalDate installationDate;
    
    @Schema(
            description = "Current operational status of the equipment",
            example = "ACTIVE"
    )
    private String equipmentStatus;
    
    @Schema(
            description = "Model number or name of the equipment",
            example = "CNC-5000X"
    )
    private String model;
    
    @Schema(
            description = "Weight of the equipment in kilograms",
            example = "2500.5"
    )
    private Double weightKg;
    
    @Schema(
            description = "Power consumption in kilowatts",
            example = "15.5"
    )
    private Double powerKW;
    
    @Schema(
            description = "Operating capacity or throughput of the equipment",
            example = "500 units/hour"
    )
    private String capacity;
    
    @Schema(
            description = "Unique identifier of the vendor",
            example = "VEN-001"
    )
    private String vendorId;
    
    @Schema(
            description = "Name of the vendor who supplied the equipment",
            example = "Tech Equipment Suppliers Inc."
    )
    private String vendorName;
    
    @Schema(
            description = "Contact email of the vendor",
            example = "contact@techequipment.com"
    )
    private String contactEmail;
    
    @Schema(
            description = "Timestamp when the equipment was registered in the system",
            example = "2024-01-15T10:30:00",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private LocalDateTime createdAt;
    
    @Schema(
            description = "Timestamp when the equipment details were last updated",
            example = "2024-01-20T14:45:00",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private LocalDateTime updatedAt;

    // Getters and Setters
    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }
    
    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }
    
    public String getEquipmentStatus() { return equipmentStatus; }
    public void setEquipmentStatus(String equipmentStatus) { this.equipmentStatus = equipmentStatus; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    
    public Double getPowerKW() { return powerKW; }
    public void setPowerKW(Double powerKW) { this.powerKW = powerKW; }
    
    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }
    
    public String getVendorId() { return vendorId; }
    public void setVendorId(String vendorId) { this.vendorId = vendorId; }
    
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}