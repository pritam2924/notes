package cts.equipment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor")
@Data
public class Vendor {
    
    @Id
    @NotBlank
    @Column(name = "vendor_id", nullable = false)
    private String vendorId;
    
    @NotBlank
    @Column(name = "vendor_name", nullable = false)
    private String vendorName;
    
    @NotBlank
    @Email
    @Column(name = "contact_email", nullable = false)
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