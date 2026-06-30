package com.equiptrack.downtime_trend.dto;

import java.util.Map;

public class AnalyticsSummaryResponse {
    private double totalMaintenanceCost;
    private double totalMaintenanceHours;
    private double totalRevenue;
    private double netProfit;
    private double availabilityPercentage;
    private int operationalEquipmentCount;
    private int underMaintenanceCount;
    private Map<String, Double> maintenanceCostByCategory;

    public double getTotalMaintenanceCost() { return totalMaintenanceCost; }
    public void setTotalMaintenanceCost(double totalMaintenanceCost) { this.totalMaintenanceCost = totalMaintenanceCost; }

    public double getTotalMaintenanceHours() { return totalMaintenanceHours; }
    public void setTotalMaintenanceHours(double totalMaintenanceHours) { this.totalMaintenanceHours = totalMaintenanceHours; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getNetProfit() { return netProfit; }
    public void setNetProfit(double netProfit) { this.netProfit = netProfit; }

    public double getAvailabilityPercentage() { return availabilityPercentage; }
    public void setAvailabilityPercentage(double availabilityPercentage) { this.availabilityPercentage = availabilityPercentage; }

    public int getOperationalEquipmentCount() { return operationalEquipmentCount; }
    public void setOperationalEquipmentCount(int operationalEquipmentCount) { this.operationalEquipmentCount = operationalEquipmentCount; }

    public int getUnderMaintenanceCount() { return underMaintenanceCount; }
    public void setUnderMaintenanceCount(int underMaintenanceCount) { this.underMaintenanceCount = underMaintenanceCount; }

    public Map<String, Double> getMaintenanceCostByCategory() { return maintenanceCostByCategory; }
    public void setMaintenanceCostByCategory(Map<String, Double> maintenanceCostByCategory) { this.maintenanceCostByCategory = maintenanceCostByCategory; }
}
