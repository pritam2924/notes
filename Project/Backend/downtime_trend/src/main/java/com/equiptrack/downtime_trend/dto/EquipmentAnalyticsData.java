package com.equiptrack.downtime_trend.dto;

public class EquipmentAnalyticsData {
    private String equipmentId;
    private String equipmentName;
    private String category;
    private String status;
    private double powerKW;
    private double operationalHours;
    private double maintenanceHours;
    private double maintenanceCost;
    private double estimatedRevenue;
    private double availabilityPercentage;

    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getPowerKW() { return powerKW; }
    public void setPowerKW(double powerKW) { this.powerKW = powerKW; }

    public double getOperationalHours() { return operationalHours; }
    public void setOperationalHours(double operationalHours) { this.operationalHours = operationalHours; }

    public double getMaintenanceHours() { return maintenanceHours; }
    public void setMaintenanceHours(double maintenanceHours) { this.maintenanceHours = maintenanceHours; }

    public double getMaintenanceCost() { return maintenanceCost; }
    public void setMaintenanceCost(double maintenanceCost) { this.maintenanceCost = maintenanceCost; }

    public double getEstimatedRevenue() { return estimatedRevenue; }
    public void setEstimatedRevenue(double estimatedRevenue) { this.estimatedRevenue = estimatedRevenue; }

    public double getAvailabilityPercentage() { return availabilityPercentage; }
    public void setAvailabilityPercentage(double availabilityPercentage) { this.availabilityPercentage = availabilityPercentage; }
}
