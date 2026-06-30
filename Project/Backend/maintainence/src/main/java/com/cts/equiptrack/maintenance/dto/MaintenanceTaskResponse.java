package com.cts.equiptrack.maintenance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MaintenanceTaskResponse {
    private Long id;
    private String equipmentId;
    private String equipmentName;
    private String title;
    private String description;
    private LocalDate scheduledDate;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String assignedOperatorId;
    private String assignedOperatorName;

    public MaintenanceTaskResponse() {}

    public MaintenanceTaskResponse(Long id, String equipmentId, String equipmentName, String title, String description, LocalDate scheduledDate, String priority, String status, LocalDateTime createdAt, LocalDateTime updatedAt, String assignedOperatorId, String assignedOperatorName) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.title = title;
        this.description = description;
        this.scheduledDate = scheduledDate;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.assignedOperatorId = assignedOperatorId;
        this.assignedOperatorName = assignedOperatorName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getAssignedOperatorId() { return assignedOperatorId; }
    public void setAssignedOperatorId(String assignedOperatorId) { this.assignedOperatorId = assignedOperatorId; }
    
    public String getAssignedOperatorName() { return assignedOperatorName; }
    public void setAssignedOperatorName(String assignedOperatorName) { this.assignedOperatorName = assignedOperatorName; }
}