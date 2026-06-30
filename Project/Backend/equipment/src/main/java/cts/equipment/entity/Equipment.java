package cts.equipment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Data
public class Equipment {
    
    @Id
    @NotBlank
    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;
    
    @NotBlank
    @Column(name = "equipment_name", nullable = false)
    private String equipmentName;
    
    @NotBlank
    @Column(nullable = false)
    private String category;
    
    @NotNull
    @Column(name = "installation_date", nullable = false)
    private LocalDate installationDate;
    
    @NotBlank
    @Column(name = "equipment_status", nullable = false)
    private String equipmentStatus;
    
    @NotBlank
    @Column(nullable = false)
    private String model;
    
    @NotNull
    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;
    
    @NotNull
    @Column(name = "power_kw", nullable = false)
    private Double powerKW;
    
    @NotBlank
    @Column(nullable = false)
    private String capacity;
    
    @Column(name = "vendor_id")
    private String vendorId;
    
    @Column(name = "vendor_name")
    private String vendorName;
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}