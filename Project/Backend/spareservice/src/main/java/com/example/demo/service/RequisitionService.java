package com.example.demo.service;

import com.example.demo.client.EquipmentServiceClient;
import com.example.demo.client.PlatformServiceClient;
import com.example.demo.dto.RequisitionRequest;
import com.example.demo.dto.RequisitionResponse;
import com.example.demo.dto.EquipmentResponse;
import com.example.demo.entity.Requisition;
import com.example.demo.entity.SparePart;
import com.example.demo.repository.RequisitionRepository;
import com.example.demo.repository.SparePartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RequisitionService {

    private final RequisitionRepository requisitionRepository;
    private final SparePartRepository sparePartRepository;
    private final EquipmentServiceClient equipmentServiceClient;
    private final PlatformServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Transactional
    public RequisitionResponse createRequisition(RequisitionRequest request) {
        log.info("Creating requisition for spare part: {}", request.getSparePartId());
        
        // Validate equipment exists via EquipmentServiceClient (optional validation)
        try {
            EquipmentResponse equipment = equipmentServiceClient.getEquipmentById(request.getEquipmentId());
            log.info("Equipment validated: {}", equipment.getEquipmentName());
        } catch (Exception e) {
            log.warn("Equipment validation failed for ID: {} - proceeding without validation", request.getEquipmentId());
            // Continue without failing the request
        }
        
        Requisition requisition = new Requisition();
        requisition.setSparePartId(request.getSparePartId());
        requisition.setEquipmentId(request.getEquipmentId());
        requisition.setRequestedQuantity(request.getRequestedQuantity());
        requisition.setRequestedBy(request.getRequestedBy());
        requisition.setNotes(request.getNotes());
        requisition.setStatus("PENDING");
        requisition.setCreatedAt(LocalDateTime.now());
        requisition.setUpdatedAt(LocalDateTime.now());

        Requisition saved = requisitionRepository.save(requisition);
        log.info("Requisition created with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    public List<RequisitionResponse> getAllRequisitions() {
        log.info("Fetching all requisitions");
        return requisitionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RequisitionResponse> getPendingRequisitions() {
        log.info("Fetching pending requisitions");
        return requisitionRepository.findByStatus("PENDING").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RequisitionResponse approveRequisition(Long id, String adminComment, String processedBy) {
        log.info("Approving requisition: {}", id);
        
        // Verify admin role via UserServiceClient (optional validation)
        try {
            String userRole = userServiceClient.getUserRole(processedBy);
            if (!"ADMIN".equalsIgnoreCase(userRole)) {
                log.error("User {} does not have admin role. Role: {}", processedBy, userRole);
                throw new RuntimeException("Only admin users can approve requisitions");
            }
            log.info("Admin role verified for user: {}", processedBy);
        } catch (Exception e) {
            log.warn("Admin role verification failed for user: {} - proceeding without verification", processedBy);
            // Continue without failing the request
        }
        
        Requisition requisition = requisitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisition not found"));
        
        // Reduce inventory count in local database
        SparePart sparePart = sparePartRepository.findById(requisition.getSparePartId())
                .orElseThrow(() -> new RuntimeException("Spare part not found"));
        
        if (sparePart.getStockQuantity() < requisition.getRequestedQuantity()) {
            throw new RuntimeException("Insufficient stock available");
        }
        
        sparePart.setStockQuantity(sparePart.getStockQuantity() - requisition.getRequestedQuantity());
        sparePartRepository.save(sparePart);
        log.info("Inventory reduced for spare part: {} by quantity: {}", sparePart.getSparePartId(), requisition.getRequestedQuantity());
        
        requisition.setStatus("APPROVED");
        requisition.setAdminComment(adminComment);
        requisition.setProcessedBy(processedBy);
        requisition.setProcessedAt(LocalDateTime.now());
        requisition.setUpdatedAt(LocalDateTime.now());
        Requisition updated = requisitionRepository.save(requisition);
        log.info("Requisition approved: {}", id);
        return mapToResponse(updated);
    }

    @Transactional
    public RequisitionResponse rejectRequisition(Long id, String adminComment, String processedBy) {
        log.info("Rejecting requisition: {}", id);
        
        // Verify admin role via UserServiceClient (optional validation)
        try {
            String userRole = userServiceClient.getUserRole(processedBy);
            if (!"ADMIN".equalsIgnoreCase(userRole)) {
                log.error("User {} does not have admin role. Role: {}", processedBy, userRole);
                throw new RuntimeException("Only admin users can reject requisitions");
            }
            log.info("Admin role verified for user: {}", processedBy);
        } catch (Exception e) {
            log.warn("Admin role verification failed for user: {} - proceeding without verification", processedBy);
            // Continue without failing the request
        }
        
        Requisition requisition = requisitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisition not found"));
        requisition.setStatus("REJECTED");
        requisition.setAdminComment(adminComment);
        requisition.setProcessedBy(processedBy);
        requisition.setProcessedAt(LocalDateTime.now());
        requisition.setUpdatedAt(LocalDateTime.now());
        Requisition updated = requisitionRepository.save(requisition);
        log.info("Requisition rejected: {}", id);
        return mapToResponse(updated);
    }

    private RequisitionResponse mapToResponse(Requisition requisition) {
        RequisitionResponse response = modelMapper.map(requisition, RequisitionResponse.class);
        
        // Fetch spare part name from local database
        try {
            SparePart sparePart = sparePartRepository.findById(requisition.getSparePartId()).orElse(null);
            response.setSparePartName(sparePart != null ? sparePart.getSparePartName() : "");
        } catch (Exception e) {
            response.setSparePartName("");
        }
        
        // Fetch equipment name from equipment service
        try {
            EquipmentResponse equipment = equipmentServiceClient.getEquipmentById(requisition.getEquipmentId());
            response.setEquipmentName(equipment != null ? equipment.getEquipmentName() : "");
        } catch (Exception e) {
            response.setEquipmentName("");
        }
        
        return response;
    }
}
