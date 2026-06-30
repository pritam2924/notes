package com.equiptrack.downtime_trend.service;

import com.equiptrack.downtime_trend.client.EquipmentServiceClient;
import com.equiptrack.downtime_trend.client.MaintenanceServiceClient;
import com.equiptrack.downtime_trend.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    private static final double RATE_PER_KWH = 0.15; // $0.15 per kWh
    private static final double MAINTENANCE_COST_PER_HOUR = 50.0; // $50 per hour

    private final EquipmentServiceClient equipmentClient;
    private final MaintenanceServiceClient maintenanceClient;

    public AnalyticsService(EquipmentServiceClient equipmentClient, MaintenanceServiceClient maintenanceClient) {
        this.equipmentClient = equipmentClient;
        this.maintenanceClient = maintenanceClient;
    }

    public AnalyticsSummaryResponse getAnalyticsSummary() {
        logger.info("Calculating analytics summary");
        
        List<MaintenanceTaskResponse> allTasks = maintenanceClient.getAllMaintenanceTasks();
        
        double totalMaintenanceHours = calculateTotalMaintenanceHours(allTasks);
        double totalMaintenanceCost = totalMaintenanceHours * MAINTENANCE_COST_PER_HOUR;
        
        Map<String, Double> costByCategory = new HashMap<>();
        Map<String, Integer> operationalCount = new HashMap<>();
        Map<String, Integer> maintenanceCount = new HashMap<>();
        
        double totalRevenue = 0.0;
        int operationalEquipment = 0;
        int underMaintenance = 0;
        double totalAvailability = 0.0;
        int equipmentCount = 0;

        Set<String> processedEquipment = new HashSet<>();
        
        for (MaintenanceTaskResponse task : allTasks) {
            if (!processedEquipment.contains(task.getEquipmentId())) {
                processedEquipment.add(task.getEquipmentId());
                
                try {
                    EquipmentResponse equipment = equipmentClient.getEquipmentById(task.getEquipmentId());
                    equipmentCount++;
                    
                    List<MaintenanceTaskResponse> equipmentTasks = allTasks.stream()
                        .filter(t -> t.getEquipmentId().equals(equipment.getEquipmentId()))
                        .collect(Collectors.toList());
                    
                    double equipmentMaintenanceHours = calculateEquipmentMaintenanceHours(equipmentTasks);
                    double equipmentMaintenanceCost = equipmentMaintenanceHours * MAINTENANCE_COST_PER_HOUR;
                    
                    costByCategory.merge(equipment.getCategory(), equipmentMaintenanceCost, Double::sum);
                    
                    if ("Operational".equalsIgnoreCase(equipment.getEquipmentStatus())) {
                        operationalEquipment++;
                        operationalCount.merge(equipment.getCategory(), 1, Integer::sum);
                        
                        double operationalHours = calculateOperationalHours(equipment.getInstallationDate());
                        double revenue = calculateRevenue(equipment.getPowerKW(), operationalHours);
                        totalRevenue += revenue;
                    } else if ("Under Maintenance".equalsIgnoreCase(equipment.getEquipmentStatus())) {
                        underMaintenance++;
                        maintenanceCount.merge(equipment.getCategory(), 1, Integer::sum);
                    }
                    
                    double availability = calculateAvailability(equipment.getInstallationDate(), equipmentMaintenanceHours);
                    totalAvailability += availability;
                    
                } catch (Exception e) {
                    logger.warn("Could not fetch equipment {}: {}", task.getEquipmentId(), e.getMessage());
                }
            }
        }

        AnalyticsSummaryResponse response = new AnalyticsSummaryResponse();
        response.setTotalMaintenanceCost(Math.round(totalMaintenanceCost * 100.0) / 100.0);
        response.setTotalMaintenanceHours(Math.round(totalMaintenanceHours * 100.0) / 100.0);
        response.setTotalRevenue(Math.round(totalRevenue * 100.0) / 100.0);
        response.setNetProfit(Math.round((totalRevenue - totalMaintenanceCost) * 100.0) / 100.0);
        response.setAvailabilityPercentage(equipmentCount > 0 ? Math.round((totalAvailability / equipmentCount) * 100.0) / 100.0 : 0.0);
        response.setOperationalEquipmentCount(operationalEquipment);
        response.setUnderMaintenanceCount(underMaintenance);
        response.setMaintenanceCostByCategory(costByCategory);

        logger.info("Analytics summary calculated: Revenue={}, Cost={}, Profit={}", 
            response.getTotalRevenue(), response.getTotalMaintenanceCost(), response.getNetProfit());
        
        return response;
    }

    public List<EquipmentAnalyticsData> getEquipmentAnalytics() {
        logger.info("Calculating equipment analytics");
        
        List<MaintenanceTaskResponse> allTasks = maintenanceClient.getAllMaintenanceTasks();
        List<EquipmentAnalyticsData> analyticsData = new ArrayList<>();
        
        Set<String> processedEquipment = new HashSet<>();
        
        for (MaintenanceTaskResponse task : allTasks) {
            if (!processedEquipment.contains(task.getEquipmentId())) {
                processedEquipment.add(task.getEquipmentId());
                
                try {
                    EquipmentResponse equipment = equipmentClient.getEquipmentById(task.getEquipmentId());
                    
                    List<MaintenanceTaskResponse> equipmentTasks = allTasks.stream()
                        .filter(t -> t.getEquipmentId().equals(equipment.getEquipmentId()))
                        .collect(Collectors.toList());
                    
                    EquipmentAnalyticsData data = new EquipmentAnalyticsData();
                    data.setEquipmentId(equipment.getEquipmentId());
                    data.setEquipmentName(equipment.getEquipmentName());
                    data.setCategory(equipment.getCategory());
                    data.setStatus(equipment.getEquipmentStatus());
                    data.setPowerKW(equipment.getPowerKW() != null ? equipment.getPowerKW() : 0.0);
                    
                    double maintenanceHours = calculateEquipmentMaintenanceHours(equipmentTasks);
                    data.setMaintenanceHours(Math.round(maintenanceHours * 100.0) / 100.0);
                    data.setMaintenanceCost(Math.round((maintenanceHours * MAINTENANCE_COST_PER_HOUR) * 100.0) / 100.0);
                    
                    double operationalHours = calculateOperationalHours(equipment.getInstallationDate());
                    data.setOperationalHours(Math.round(operationalHours * 100.0) / 100.0);
                    
                    double revenue = calculateRevenue(equipment.getPowerKW(), operationalHours);
                    data.setEstimatedRevenue(Math.round(revenue * 100.0) / 100.0);
                    
                    double availability = calculateAvailability(equipment.getInstallationDate(), maintenanceHours);
                    data.setAvailabilityPercentage(Math.round(availability * 100.0) / 100.0);
                    
                    analyticsData.add(data);
                    
                } catch (Exception e) {
                    logger.warn("Could not process equipment {}: {}", task.getEquipmentId(), e.getMessage());
                }
            }
        }
        
        return analyticsData;
    }

    private double calculateTotalMaintenanceHours(List<MaintenanceTaskResponse> tasks) {
        return tasks.stream()
            .filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus()))
            .count() * 4.0; // Assume 4 hours per completed task
    }

    private double calculateEquipmentMaintenanceHours(List<MaintenanceTaskResponse> tasks) {
        return tasks.stream()
            .filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus()))
            .count() * 4.0;
    }

    private double calculateOperationalHours(java.time.LocalDate installationDate) {
        if (installationDate == null) return 0.0;
        
        LocalDateTime installDateTime = installationDate.atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(installDateTime, now);
        
        return duration.toHours() * 0.7; // Assume 70% operational time
    }

    private double calculateRevenue(Double powerKW, double operationalHours) {
        if (powerKW == null || powerKW == 0.0) return 0.0;
        return powerKW * operationalHours * RATE_PER_KWH;
    }

    private double calculateAvailability(java.time.LocalDate installationDate, double maintenanceHours) {
        double totalHours = calculateOperationalHours(installationDate) / 0.7; // Get actual total hours
        if (totalHours == 0) return 100.0;
        
        double availableHours = totalHours - maintenanceHours;
        return (availableHours / totalHours) * 100.0;
    }
}
