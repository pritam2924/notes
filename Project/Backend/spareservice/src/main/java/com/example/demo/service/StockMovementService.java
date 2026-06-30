package com.example.demo.service;

import com.example.demo.dto.StockMovementRequest;
import com.example.demo.dto.StockMovementResponse;
import com.example.demo.entity.SparePart;
import com.example.demo.entity.StockMovement;
import com.example.demo.repository.SparePartRepository;
import com.example.demo.repository.StockMovementRepository;
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
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final SparePartRepository sparePartRepository;
    private final ModelMapper modelMapper;

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public StockMovementResponse recordStockMovementOnly(String sparePartId, String movementType, 
                                                         Integer quantity, Integer previousStock, 
                                                         Integer newStock, String reason, String performedBy) {
        log.info("Recording stock movement history for spare part: {}", sparePartId);
        
        StockMovement movement = new StockMovement();
        movement.setSparePartId(sparePartId);
        movement.setMovementType(movementType);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setPerformedBy(performedBy);
        movement.setPreviousStock(previousStock);
        movement.setNewStock(newStock);
        movement.setMovementDate(LocalDateTime.now());
        movement.setNotes("Stock adjusted via spare part update");

        StockMovement saved = stockMovementRepository.save(movement);
        log.info("Stock movement recorded with ID: {}", saved.getMovementId());
        
        SparePart sparePart = sparePartRepository.findById(sparePartId)
                .orElseThrow(() -> new RuntimeException("Spare part not found"));
        return mapToResponse(saved, sparePart.getSparePartName());
    }

    @Transactional
    public StockMovementResponse recordStockMovement(StockMovementRequest request) {
        log.info("Recording stock movement for spare part: {}", request.getSparePartId());
        SparePart sparePart = sparePartRepository.findById(request.getSparePartId())
                .orElseThrow(() -> new RuntimeException("Spare part not found"));

        int previousStock = sparePart.getStockQuantity();
        int newStock;

        if ("OUT".equals(request.getMovementType())) {
            if (previousStock < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }
            newStock = previousStock - request.getQuantity();
        } else if ("IN".equals(request.getMovementType())) {
            newStock = previousStock + request.getQuantity();
        } else {
            throw new RuntimeException("Invalid movement type");
        }

        sparePart.setStockQuantity(newStock);
        sparePart.setUpdatedAt(LocalDateTime.now());
        sparePartRepository.save(sparePart);

        StockMovement movement = new StockMovement();
        movement.setSparePartId(request.getSparePartId());
        movement.setMovementType(request.getMovementType());
        movement.setQuantity(request.getQuantity());
        movement.setReason(request.getReason());
        movement.setReferenceNumber(request.getReferenceNumber());
        movement.setPerformedBy(request.getPerformedBy());
        movement.setNotes(request.getNotes());
        movement.setPreviousStock(previousStock);
        movement.setNewStock(newStock);
        movement.setMovementDate(LocalDateTime.now());

        StockMovement saved = stockMovementRepository.save(movement);
        log.info("Stock movement recorded with ID: {}", saved.getMovementId());
        return mapToResponse(saved, sparePart.getSparePartName());
    }

    public List<StockMovementResponse> getAllStockMovements() {
        log.info("Fetching all stock movements");
        return stockMovementRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StockMovementResponse getStockMovementById(Long id) {
        log.info("Fetching stock movement by ID: {}", id);
        StockMovement movement = stockMovementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock movement not found"));
        return mapToResponse(movement);
    }

    public List<StockMovementResponse> getStockMovementsBySparePart(String sparePartId) {
        log.info("Fetching stock movements for spare part: {}", sparePartId);
        return stockMovementRepository.findBySparePartId(sparePartId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StockMovementResponse createTestMovement(String sparePartId) {
        log.info("Creating test stock movement for spare part: {}", sparePartId);
        StockMovementRequest request = new StockMovementRequest();
        request.setSparePartId(sparePartId);
        request.setMovementType("IN");
        request.setQuantity(10);
        request.setReason("TEST");
        request.setPerformedBy("System");
        request.setNotes("Test movement");
        return recordStockMovement(request);
    }

    public String getHealth() {
        log.info("Health check for stock movements API");
        return "Stock Movements API is healthy";
    }

    private StockMovementResponse mapToResponse(StockMovement movement) {
        SparePart sparePart = sparePartRepository.findById(movement.getSparePartId())
                .orElseThrow(() -> new RuntimeException("Spare part not found"));
        return mapToResponse(movement, sparePart.getSparePartName());
    }

    private StockMovementResponse mapToResponse(StockMovement movement, String sparePartName) {
        StockMovementResponse response = modelMapper.map(movement, StockMovementResponse.class);
        response.setSparePartName(sparePartName);
        return response;
    }
}
