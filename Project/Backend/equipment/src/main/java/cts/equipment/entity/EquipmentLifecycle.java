package cts.equipment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment_lifecycle")
@Data
public class EquipmentLifecycle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;
    
    @NotBlank
    @Column(name = "status", nullable = false)
    private String status;
    
    @NotNull
    @Column(name = "changed_at", nullable = false)
    private LocalDateTime statusChangedAt;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "cause")
    private String cause;
    
    @Column(name = "recommendations")
    private String recommendations;
    
    @PrePersist
    protected void onCreate() {
        if (statusChangedAt == null) {
            statusChangedAt = LocalDateTime.now();
        }
    }
}