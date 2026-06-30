package cts.equipment.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class EquipmentRequest {
    
    @NotBlank(message = "Equipment name is required")
    private String equipmentName;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Installation date is required")
    private LocalDate installationDate;
    
    @NotBlank(message = "Equipment status is required")
    private String equipmentStatus;
    
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weightKg;
    
    @NotNull(message = "Power is required")
    @Positive(message = "Power must be positive")
    private Double powerKW;
    
    @NotBlank(message = "Capacity is required")
    private String capacity;
    
    private String vendorId;

    // Default constructor
    public EquipmentRequest() {}

    // Getters and Setters
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
}