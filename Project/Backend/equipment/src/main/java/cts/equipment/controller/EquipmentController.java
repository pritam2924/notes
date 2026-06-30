package cts.equipment.controller;

import cts.equipment.dto.EquipmentRequest;
import cts.equipment.dto.EquipmentResponse;
import cts.equipment.entity.EquipmentLifecycle;
import cts.equipment.service.EquipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@Validated
@Tag(name = "Equipment Management", description = "APIs for managing equipment in the tracking system. " +
        "Includes operations for equipment registration, status updates, and lifecycle tracking.")
@SecurityRequirement(name = "Bearer Authentication")
public class EquipmentController {

    private final EquipmentService equipmentService;
    
    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }
    
    @PostMapping
    @Operation(
            summary = "Register new equipment",
            description = "Creates a new equipment entry in the system with all necessary details including " +
                    "equipment ID, name, type, category, vendor information, and initial status."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Equipment successfully registered",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EquipmentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data or validation error",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<EquipmentResponse> registerEquipment(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Equipment registration details",
                    required = true,
                    content = @Content(schema = @Schema(implementation = EquipmentRequest.class))
            )
            @jakarta.validation.Valid @RequestBody EquipmentRequest request) {
        try {
            EquipmentResponse response = equipmentService.registerEquipment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping
    @Operation(
            summary = "Get all equipment",
            description = "Retrieves a list of all equipment registered in the system with their current details."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved all equipment",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EquipmentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<List<EquipmentResponse>> getAllEquipment() {
        List<EquipmentResponse> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(equipment);
    }
    
    @GetMapping("/{equipmentId}")
    @Operation(
            summary = "Get equipment by ID",
            description = "Retrieves detailed information about a specific equipment using its unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Equipment found successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EquipmentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Equipment not found with the given ID",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<EquipmentResponse> getEquipmentById(
            @Parameter(description = "Unique identifier of the equipment", required = true, example = "EQ-001")
            @PathVariable String equipmentId) {
        try {
            EquipmentResponse response = equipmentService.getEquipmentById(equipmentId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{equipmentId}/status")
    @Operation(
            summary = "Update equipment status",
            description = "Updates the operational status of equipment. Valid statuses might include: " +
                    "ACTIVE, INACTIVE, MAINTENANCE, RETIRED, etc."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Equipment status updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EquipmentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid status value provided",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Equipment not found with the given ID",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<EquipmentResponse> updateEquipmentStatus(
            @Parameter(description = "Unique identifier of the equipment", required = true, example = "EQ-001")
            @PathVariable String equipmentId, 
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "New status for the equipment",
                    required = true,
                    content = @Content(
                            schema = @Schema(
                                    example = "{\"status\": \"MAINTENANCE\"}"
                            )
                    )
            )
            @RequestBody Map<String, String> statusRequest) {
        try {
            String newStatus = statusRequest.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            EquipmentResponse response = equipmentService.updateEquipmentStatus(equipmentId, newStatus.trim());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{equipmentId}/lifecycle")
    @Operation(
            summary = "Get equipment lifecycle history",
            description = "Retrieves the complete lifecycle history of an equipment, including all status changes " +
                    "and significant events from registration to current state."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lifecycle history retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EquipmentLifecycle.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Equipment not found with the given ID",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<List<EquipmentLifecycle>> getEquipmentLifecycle(
            @Parameter(description = "Unique identifier of the equipment", required = true, example = "EQ-001")
            @PathVariable String equipmentId) {
        try {
            List<EquipmentLifecycle> lifecycle = equipmentService.getEquipmentLifecycle(equipmentId);
            return ResponseEntity.ok(lifecycle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    
}