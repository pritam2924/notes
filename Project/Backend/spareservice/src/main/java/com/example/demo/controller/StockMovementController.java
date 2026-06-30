package com.example.demo.controller;

import com.example.demo.dto.StockMovementRequest;
import com.example.demo.dto.StockMovementResponse;
import com.example.demo.service.StockMovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Stock Movements", description = "API for managing stock movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @PostMapping
    @Operation(summary = "Record a stock movement for a spare part")
    public ResponseEntity<StockMovementResponse> recordStockMovement(@Valid @RequestBody StockMovementRequest request) {
        log.info("Recording stock movement for spare part: {}", request.getSparePartId());
        StockMovementResponse response = stockMovementService.recordStockMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all stock movements")
    public ResponseEntity<List<StockMovementResponse>> getAllStockMovements() {
        log.info("Fetching all stock movements");
        List<StockMovementResponse> responses = stockMovementService.getAllStockMovements();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{movementId}")
    @Operation(summary = "Get a specific stock movement by ID")
    public ResponseEntity<StockMovementResponse> getStockMovementById(@PathVariable Long movementId) {
        log.info("Fetching stock movement by ID: {}", movementId);
        StockMovementResponse response = stockMovementService.getStockMovementById(movementId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/spare-part/{sparePartId}")
    @Operation(summary = "Get stock movements for a specific spare part")
    public ResponseEntity<List<StockMovementResponse>> getStockMovementsBySparePart(@PathVariable String sparePartId) {
        log.info("Fetching stock movements for spare part: {}", sparePartId);
        List<StockMovementResponse> responses = stockMovementService.getStockMovementsBySparePart(sparePartId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/test/{sparePartId}")
    @Operation(summary = "Create a test stock movement for a spare part")
    public ResponseEntity<StockMovementResponse> createTestMovement(@PathVariable String sparePartId) {
        log.info("Creating test stock movement for spare part: {}", sparePartId);
        StockMovementResponse response = stockMovementService.createTestMovement(sparePartId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check for stock movements API")
    public ResponseEntity<String> getHealth() {
        log.info("Health check for stock movements API");
        String health = stockMovementService.getHealth();
        return ResponseEntity.ok(health);
    }
}
