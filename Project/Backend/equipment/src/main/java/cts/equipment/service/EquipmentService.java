package cts.equipment.service;

import cts.equipment.dto.EquipmentRequest;
import cts.equipment.dto.EquipmentResponse;
import cts.equipment.entity.Equipment;
import cts.equipment.entity.EquipmentLifecycle;
import cts.equipment.entity.Vendor;
import cts.equipment.enums.EquipmentStatus;
import cts.equipment.repository.EquipmentRepository;
import cts.equipment.repository.EquipmentLifecycleRepository;
import cts.equipment.repository.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EquipmentService {
    
    private final EquipmentRepository equipmentRepository;
    private final VendorRepository vendorRepository;
    private final EquipmentLifecycleRepository lifecycleRepository;
    
    public EquipmentService(EquipmentRepository equipmentRepository, 
                           VendorRepository vendorRepository,
                           EquipmentLifecycleRepository lifecycleRepository) {
        this.equipmentRepository = equipmentRepository;
        this.vendorRepository = vendorRepository;
        this.lifecycleRepository = lifecycleRepository;
    }
    
    private static final Map<String, String> CATEGORY_MAP = new HashMap<>();
    static {
        CATEGORY_MAP.put("Mechanical", "MECH");
        CATEGORY_MAP.put("Electrical", "ELEC");
        CATEGORY_MAP.put("Instrumentation", "INST");
        CATEGORY_MAP.put("Automation", "AUTO");
        CATEGORY_MAP.put("Heating & Cooling", "HTCL");
        CATEGORY_MAP.put("Safety & Utilization", "SAFE");
    }
    
    @Transactional
    public EquipmentResponse registerEquipment(EquipmentRequest request) {
        // Validate status
        EquipmentStatus.fromString(request.getEquipmentStatus());
        
        String equipmentId = generateEquipmentId(request.getCategory(), request.getInstallationDate().getYear());
        
        // Validate vendor exists and get vendor details
        Vendor vendor = null;
        if (request.getVendorId() != null && !request.getVendorId().trim().isEmpty()) {
            vendor = vendorRepository.findByVendorId(request.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + request.getVendorId()));
        }
        
        Equipment equipment = new Equipment();
        equipment.setEquipmentId(equipmentId);
        equipment.setEquipmentName(request.getEquipmentName());
        equipment.setCategory(request.getCategory());
        equipment.setInstallationDate(request.getInstallationDate());
        equipment.setEquipmentStatus(request.getEquipmentStatus());
        equipment.setModel(request.getModel());
        equipment.setWeightKg(request.getWeightKg());
        equipment.setPowerKW(request.getPowerKW());
        equipment.setCapacity(request.getCapacity());
        
        // Set vendor details from vendor table
        if (vendor != null) {
            equipment.setVendorId(vendor.getVendorId());
            equipment.setVendorName(vendor.getVendorName());
            equipment.setContactEmail(vendor.getContactEmail());
        }
        
        Equipment saved = equipmentRepository.save(equipment);
        
        // Record initial lifecycle status
        recordLifecycleChange(equipmentId, request.getEquipmentStatus(), "Equipment registered");
        
        return mapToResponse(saved);
    }
    
    public List<EquipmentResponse> getAllEquipment() {
        return equipmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public EquipmentResponse getEquipmentById(String equipmentId) {
        Equipment equipment = equipmentRepository.findByEquipmentId(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found with ID: " + equipmentId));
        return mapToResponse(equipment);
    }
    
    @Transactional
    public EquipmentResponse updateEquipmentStatus(String equipmentId, String newStatus) {
        // Validate status
        EquipmentStatus.fromString(newStatus);
        
        Equipment equipment = equipmentRepository.findByEquipmentId(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found with ID: " + equipmentId));
        
        String oldStatus = equipment.getEquipmentStatus();
        equipment.setEquipmentStatus(newStatus);
        Equipment updated = equipmentRepository.save(equipment);
        
        // Record lifecycle change
        recordLifecycleChange(equipmentId, newStatus, "Status changed from " + oldStatus + " to " + newStatus);
        
        return mapToResponse(updated);
    }
    
    public List<EquipmentLifecycle> getEquipmentLifecycle(String equipmentId) {
        return lifecycleRepository.findByEquipmentIdOrderByStatusChangedAtDesc(equipmentId);
    }
    
    private void recordLifecycleChange(String equipmentId, String status, String remarks) {
        EquipmentLifecycle lifecycle = new EquipmentLifecycle();
        lifecycle.setEquipmentId(equipmentId);
        lifecycle.setStatus(status);
        lifecycle.setRemarks(remarks);
        lifecycle.setCause(determineCause(status, remarks));
        lifecycle.setRecommendations(generateRecommendations(status));
        lifecycleRepository.save(lifecycle);
    }
    
    private String determineCause(String status, String remarks) {
        if (remarks != null && !remarks.trim().isEmpty() && !remarks.contains("Status changed")) {
            return remarks;
        }
        
        String lowerStatus = status.toLowerCase();
        if (lowerStatus.contains("scheduled")) return "Scheduled Maintenance";
        if (lowerStatus.contains("emergency")) return "Emergency Repair";
        if (lowerStatus.contains("breakdown")) return "Equipment Breakdown";
        if (lowerStatus.contains("preventive")) return "Preventive Maintenance";
        if (lowerStatus.contains("maintenance")) return "Scheduled Maintenance";
        
        return "Status Update";
    }
    
    private String generateRecommendations(String status) {
        String lowerStatus = status.toLowerCase();
        
        if (lowerStatus.contains("emergency")) {
            return "Investigate root cause and implement preventive measures.";
        }
        if (lowerStatus.contains("breakdown")) {
            return "Review maintenance schedule and consider predictive maintenance.";
        }
        if (lowerStatus.contains("scheduled") || lowerStatus.contains("preventive")) {
            return "Regular maintenance completed successfully.";
        }
        if (lowerStatus.contains("operational")) {
            return "Monitor equipment performance and schedule next maintenance.";
        }
        
        return "Continue monitoring equipment status.";
    }
    
    private String generateEquipmentId(String category, int year) {
        String categoryCode = CATEGORY_MAP.getOrDefault(category, "GEN");
        
        // Get all equipment to find the highest sequence number globally
        List<Equipment> allEquipment = equipmentRepository.findAll();
        
        // Find the highest sequence number across all equipment
        int maxSequence = 1000;
        for (Equipment eq : allEquipment) {
            String[] parts = eq.getEquipmentId().split("-");
            if (parts.length == 4) {
                try {
                    int sequence = Integer.parseInt(parts[3]);
                    if (sequence > maxSequence) {
                        maxSequence = sequence;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        
        int nextSequence = maxSequence + 1;
        return String.format("EQ-%s-%d-%d", categoryCode, year, nextSequence);
    }
    
    private EquipmentResponse mapToResponse(Equipment equipment) {
        EquipmentResponse response = new EquipmentResponse();
        response.setEquipmentId(equipment.getEquipmentId());
        response.setEquipmentName(equipment.getEquipmentName());
        response.setCategory(equipment.getCategory());
        response.setInstallationDate(equipment.getInstallationDate());
        response.setEquipmentStatus(equipment.getEquipmentStatus());
        response.setModel(equipment.getModel());
        response.setWeightKg(equipment.getWeightKg());
        response.setPowerKW(equipment.getPowerKW());
        response.setCapacity(equipment.getCapacity());
        response.setVendorId(equipment.getVendorId());
        response.setVendorName(equipment.getVendorName());
        response.setContactEmail(equipment.getContactEmail());
        response.setCreatedAt(equipment.getCreatedAt());
        response.setUpdatedAt(equipment.getUpdatedAt());
        return response;
    }
}