package com.example.demo.controller;

import com.example.demo.dto.SparePartRequest;
import com.example.demo.dto.SparePartResponse;
import com.example.demo.dto.EquipmentResponse;
import com.example.demo.service.SparePartService;
import com.example.demo.client.EquipmentServiceClient;
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
@RequestMapping("/api/spare-parts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Spare Parts", description = "API for managing spare parts")
public class SparePartController {

    private final SparePartService sparePartService;
    private final EquipmentServiceClient equipmentServiceClient;

    @PostMapping
    @Operation(summary = "Create a new spare part")
    public ResponseEntity<SparePartResponse> createSparePart(@Valid @RequestBody SparePartRequest request) {
        log.info("Creating spare part: {}", request.getSparePartName());
        SparePartResponse response = sparePartService.createSparePart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all spare parts")
    public ResponseEntity<List<SparePartResponse>> getAllSpareParts() {
        log.info("Fetching all spare parts");
        List<SparePartResponse> responses = sparePartService.getAllSpareParts();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific spare part by ID")
    public ResponseEntity<SparePartResponse> getSparePartById(@PathVariable String id) {
        log.info("Fetching spare part by ID: {}", id);
        SparePartResponse response = sparePartService.getSparePartById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get spare parts with low stock")
    public ResponseEntity<List<SparePartResponse>> getLowStockSpareParts() {
        log.info("Fetching low stock spare parts");
        List<SparePartResponse> responses = sparePartService.getLowStockSpareParts();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get spare parts for a specific equipment")
    public ResponseEntity<List<SparePartResponse>> getSparePartsByEquipment(@PathVariable String equipmentId) {
        log.info("Fetching spare parts for equipment: {}", equipmentId);
        List<SparePartResponse> responses = sparePartService.getSparePartsByEquipment(equipmentId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a spare part")
    public ResponseEntity<SparePartResponse> updateSparePart(@PathVariable String id, @Valid @RequestBody SparePartRequest request) {
        log.info("Updating spare part: {}", id);
        SparePartResponse response = sparePartService.updateSparePart(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a spare part")
    public ResponseEntity<Void> deleteSparePart(@PathVariable String id) {
        log.info("Deleting spare part: {}", id);
        sparePartService.deleteSparePart(id);
        return ResponseEntity.noContent().build();
    }
}
