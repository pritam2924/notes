package cts.equipment.service;

import cts.equipment.dto.DashboardStatsResponse;
import cts.equipment.entity.Equipment;
import cts.equipment.repository.EquipmentRepository;
import cts.equipment.repository.VendorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EquipmentRepository equipmentRepository;
    private final VendorRepository vendorRepository;

    public DashboardService(EquipmentRepository equipmentRepository, VendorRepository vendorRepository) {
        this.equipmentRepository = equipmentRepository;
        this.vendorRepository = vendorRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        List<Equipment> allEquipment = equipmentRepository.findAll();
        
        long totalEquipment = allEquipment.size();
        long activeVendors = vendorRepository.count();
        
        // Count equipment in maintenance status
        long pendingMaintenance = allEquipment.stream()
                .filter(eq -> "Maintenance".equalsIgnoreCase(eq.getEquipmentStatus()) || 
                             "MAINTENANCE".equals(eq.getEquipmentStatus()))
                .count();
        
        // Calculate uptime (operational equipment percentage)
        long operationalEquipment = allEquipment.stream()
                .filter(eq -> "Operational".equalsIgnoreCase(eq.getEquipmentStatus()) || 
                             "OPERATIONAL".equals(eq.getEquipmentStatus()))
                .count();
        
        String uptime = totalEquipment > 0 
                ? Math.round((operationalEquipment * 100.0) / totalEquipment) + "%" 
                : "0%";
        
        // Status distribution
        Map<String, Long> statusDistribution = allEquipment.stream()
                .collect(Collectors.groupingBy(Equipment::getEquipmentStatus, Collectors.counting()));
        
        // Category distribution
        Map<String, Long> categoryDistribution = allEquipment.stream()
                .collect(Collectors.groupingBy(Equipment::getCategory, Collectors.counting()));
        
        DashboardStatsResponse response = new DashboardStatsResponse();
        response.setTotalEquipment(totalEquipment);
        response.setActiveVendors(activeVendors);
        response.setPendingMaintenance(pendingMaintenance);
        response.setUptime(uptime);
        response.setTotalAlerts(0L);
        response.setCriticalAlerts(0L);
        response.setWarningAlerts(0L);
        response.setStatusDistribution(statusDistribution);
        response.setCategoryDistribution(categoryDistribution);
        
        return response;
    }
}
