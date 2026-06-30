package com.cts.equiptrack.maintenance.controller;

import com.cts.equiptrack.maintenance.dto.MaintenanceTaskRequest;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskResponse;
import com.cts.equiptrack.maintenance.client.EquipmentServiceClient;
import com.cts.equiptrack.maintenance.dto.EquipmentResponse;
import com.cts.equiptrack.maintenance.service.MaintenanceTaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance-tasks")
@Tag(name = "Maintenance Tasks", description = "API for managing maintenance tasks")
public class MaintenanceTaskController {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceTaskController.class);

    @Autowired
    private MaintenanceTaskService maintenanceTaskService;
    
    @Autowired
    private EquipmentServiceClient equipmentServiceClient;

    @PostMapping
    @Operation(summary = "Create a new maintenance task")
    public ResponseEntity<MaintenanceTaskResponse> createTask(@Valid @RequestBody MaintenanceTaskRequest request) {
        logger.info("Creating maintenance task for equipment: {}", request.getEquipmentId());
        MaintenanceTaskResponse response = maintenanceTaskService.createTask(request);
        logger.info("Created maintenance task with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all maintenance tasks")
    public ResponseEntity<List<MaintenanceTaskResponse>> getAllTasks() {
        logger.info("Fetching all maintenance tasks");
        List<MaintenanceTaskResponse> tasks = maintenanceTaskService.getAllTasks();
        logger.info("Retrieved {} maintenance tasks", tasks.size());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance task by ID")
    public ResponseEntity<MaintenanceTaskResponse> getTaskById(
            @Parameter(description = "Task ID") @PathVariable Long id) {
        logger.info("Fetching maintenance task with ID: {}", id);
        MaintenanceTaskResponse task = maintenanceTaskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update maintenance task status")
    public ResponseEntity<MaintenanceTaskResponse> updateTaskStatus(
            @Parameter(description = "Task ID") @PathVariable Long id, 
            @RequestBody Map<String, String> updates) {
        logger.info("Updating status for task ID: {}", id);
        String status = updates.get("status");
        if (status == null) {
            logger.warn("Status not provided in update request for task ID: {}", id);
            return ResponseEntity.badRequest().build();
        }
        MaintenanceTaskResponse updatedTask = maintenanceTaskService.updateTaskStatus(id, status);
        logger.info("Updated task ID: {} to status: {}", id, status);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete maintenance task")
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "Task ID") @PathVariable Long id) {
        logger.info("Deleting maintenance task with ID: {}", id);
        maintenanceTaskService.deleteTask(id);
        logger.info("Deleted maintenance task with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/operator/{operatorId}")
    @Operation(summary = "Get tasks by operator ID")
    public ResponseEntity<List<MaintenanceTaskResponse>> getTasksByOperatorId(
            @Parameter(description = "Operator ID") @PathVariable String operatorId) {
        logger.info("Fetching tasks for operator ID: {}", operatorId);
        List<MaintenanceTaskResponse> tasks = maintenanceTaskService.getTasksByOperatorId(operatorId);
        logger.info("Retrieved {} tasks for operator ID: {}", tasks.size(), operatorId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check endpoint")
    public ResponseEntity<String> health() {
        logger.info("Health check requested");
        return ResponseEntity.ok("Maintenance Service is running!");
    }
    
    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get maintenance tasks by equipment ID")
    public ResponseEntity<List<MaintenanceTaskResponse>> getTasksByEquipmentId(
            @Parameter(description = "Equipment ID") @PathVariable String equipmentId) {
        logger.info("Fetching maintenance tasks for equipment ID: {}", equipmentId);
        List<MaintenanceTaskResponse> tasks = maintenanceTaskService.getTasksByEquipmentId(equipmentId);
        logger.info("Retrieved {} maintenance tasks for equipment ID: {}", tasks.size(), equipmentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/equipment/{equipmentId}/details")
    @Operation(summary = "Get equipment details via maintenance service")
    public ResponseEntity<EquipmentResponse> getEquipmentDetails(
            @Parameter(description = "Equipment ID") @PathVariable String equipmentId) {
        logger.info("Fetching equipment details for ID: {}", equipmentId);
        try {
            EquipmentResponse equipment = equipmentServiceClient.getEquipmentById(equipmentId);
            logger.info("Retrieved equipment: {} - {}", equipment.getEquipmentId(), equipment.getEquipmentName());
            return ResponseEntity.ok(equipment);
        } catch (Exception e) {
            logger.error("Failed to fetch equipment details for ID: {}", equipmentId, e);
            return ResponseEntity.notFound().build();
        }
    }
}