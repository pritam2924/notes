package com.equiptrack.downtime_trend.dto;

import java.time.LocalDateTime;

public class DowntimeReportResponse {
    private String id;
    private String equipmentName;
    private Double duration;
    private LocalDateTime downtimeStart;
    private LocalDateTime downtimeEnd;
    private String cause;
    private String recommendations;
    private Boolean isOngoing;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
    public Double getDuration() { return duration; }
    public void setDuration(Double duration) { this.duration = duration; }
    public LocalDateTime getDowntimeStart() { return downtimeStart; }
    public void setDowntimeStart(LocalDateTime downtimeStart) { this.downtimeStart = downtimeStart; }
    public LocalDateTime getDowntimeEnd() { return downtimeEnd; }
    public void setDowntimeEnd(LocalDateTime downtimeEnd) { this.downtimeEnd = downtimeEnd; }
    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    public Boolean getIsOngoing() { return isOngoing; }
    public void setIsOngoing(Boolean isOngoing) { this.isOngoing = isOngoing; }
}
