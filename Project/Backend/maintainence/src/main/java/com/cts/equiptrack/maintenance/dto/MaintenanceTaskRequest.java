package com.cts.equiptrack.maintenance.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class MaintenanceTaskRequest {
    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;
    
    @NotBlank(message = "Equipment name is required")
    private String equipmentName;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Scheduled date is required")
    @FutureOrPresent(message = "Scheduled date must be today or in the future")
    private LocalDate scheduledDate;
    
    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "Priority must be HIGH, MEDIUM, or LOW")
    private String priority;
    
    @Pattern(regexp = "PENDING|SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED", message = "Invalid status")
    private String status;
    
    private String assignedOperatorId;

    public MaintenanceTaskRequest() {}

    public MaintenanceTaskRequest(String equipmentId, String equipmentName, String title, String description, LocalDate scheduledDate, String priority, String status, String assignedOperatorId) {
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.title = title;
        this.description = description;
        this.scheduledDate = scheduledDate;
        this.priority = priority;
        this.status = status;
        this.assignedOperatorId = assignedOperatorId;
    }

    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }
    
    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAssignedOperatorId() { 
        return assignedOperatorId; 
    }
    public void setAssignedOperatorId(String assignedOperatorId) { this.assignedOperatorId = assignedOperatorId; }
}