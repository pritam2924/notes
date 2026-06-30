package com.example.demo.service;

import com.example.demo.dto.SparePartRequest;
import com.example.demo.dto.SparePartResponse;
import com.example.demo.entity.SparePart;
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
@Slf4j
public class SparePartService {

    private final SparePartRepository sparePartRepository;
    private final ModelMapper modelMapper;

    public SparePartService(SparePartRepository sparePartRepository, 
                           ModelMapper modelMapper) {
        this.sparePartRepository = sparePartRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public SparePartResponse createSparePart(SparePartRequest request) {
        log.info("Creating new spare part: {}", request.getSparePartName());

        SparePart sparePart = modelMapper.map(request, SparePart.class);
        sparePart.setSparePartId(generateSparePartId());
        sparePart.setCreatedAt(LocalDateTime.now());
        sparePart.setUpdatedAt(LocalDateTime.now());
        SparePart saved = sparePartRepository.save(sparePart);
        log.info("Spare part created with ID: {}", saved.getSparePartId());
        return mapToResponse(saved);
    }

    public List<SparePartResponse> getAllSpareParts() {
        log.info("Fetching all spare parts");
        return sparePartRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SparePartResponse getSparePartById(String id) {
        log.info("Fetching spare part by ID: {}", id);
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found"));
        return mapToResponse(sparePart);
    }

    public List<SparePartResponse> getLowStockSpareParts() {
        log.info("Fetching low stock spare parts");
        return sparePartRepository.findLowStockSpareParts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SparePartResponse> getSparePartsByEquipment(String equipmentId) {
        log.info("Fetching spare parts for equipment: {}", equipmentId);
        return sparePartRepository.findByEquipmentId(equipmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SparePartResponse updateSparePart(String id, SparePartRequest request) {
        log.info("Updating spare part: {}", id);
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found"));
        
        sparePart.setSparePartName(request.getSparePartName());
        sparePart.setDescription(request.getDescription());
        sparePart.setStockQuantity(request.getStockQuantity());
        sparePart.setMinimumStockLevel(request.getMinimumStockLevel());
        sparePart.setUnitPrice(request.getUnitPrice());
        sparePart.setEquipmentId(request.getEquipmentId());
        sparePart.setEquipmentName(request.getEquipmentName());
        sparePart.setUpdatedAt(LocalDateTime.now());
        
        SparePart updated = sparePartRepository.save(sparePart);
        log.info("Spare part updated: {}", id);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSparePart(String id) {
        log.info("Deleting spare part: {}", id);
        if (!sparePartRepository.existsById(id)) {
            throw new RuntimeException("Spare part not found");
        }
        sparePartRepository.deleteById(id);
        log.info("Spare part deleted: {}", id);
    }

    private SparePartResponse mapToResponse(SparePart sparePart) {
        SparePartResponse response = modelMapper.map(sparePart, SparePartResponse.class);
        response.setLowStock(sparePart.getStockQuantity() < sparePart.getMinimumStockLevel());
        response.setStockStatus(calculateStockStatus(sparePart));
        return response;
    }

    private String calculateStockStatus(SparePart sparePart) {
        int stock = sparePart.getStockQuantity();
        int minStock = sparePart.getMinimumStockLevel();
        if (stock < minStock / 2) {
            return "CRITICAL";
        } else if (stock < minStock) {
            return "WARNING";
        } else {
            return "NORMAL";
        }
    }
    
    private String generateSparePartId() {
        String prefix = "SP-";
        long count = sparePartRepository.count() + 1;
        return prefix + String.format("%04d", count);
    }
}
