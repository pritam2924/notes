package com.example.demo.controller;

import com.example.demo.dto.RequisitionRequest;
import com.example.demo.dto.RequisitionResponse;
import com.example.demo.service.RequisitionService;
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
@RequestMapping("/api/spare-parts-requests")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Spare Part Requisitions", description = "API for managing spare part requisitions")
public class SparePartRequisitionController {

    private final RequisitionService requisitionService;

    @PostMapping
    @Operation(summary = "Create a spare part requisition request")
    public ResponseEntity<RequisitionResponse> createRequisition(@Valid @RequestBody RequisitionRequest request) {
        log.info("Creating requisition for spare part: {}", request.getSparePartId());
        RequisitionResponse response = requisitionService.createRequisition(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all spare part requisitions")
    public ResponseEntity<List<RequisitionResponse>> getAllRequisitions() {
        log.info("Fetching all requisitions");
        List<RequisitionResponse> responses = requisitionService.getAllRequisitions();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending spare part requisitions")
    public ResponseEntity<List<RequisitionResponse>> getPendingRequisitions() {
        log.info("Fetching pending requisitions");
        List<RequisitionResponse> responses = requisitionService.getPendingRequisitions();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve a spare part requisition")
    public ResponseEntity<RequisitionResponse> approveRequisition(@PathVariable Long id, @RequestParam String adminComment, @RequestParam String processedBy) {
        log.info("Approving requisition: {}", id);
        RequisitionResponse response = requisitionService.approveRequisition(id, adminComment, processedBy);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a spare part requisition")
    public ResponseEntity<RequisitionResponse> rejectRequisition(@PathVariable Long id, @RequestParam String adminComment, @RequestParam String processedBy) {
        log.info("Rejecting requisition: {}", id);
        RequisitionResponse response = requisitionService.rejectRequisition(id, adminComment, processedBy);
        return ResponseEntity.ok(response);
    }
}
