package cts.equipment.controller;

import cts.equipment.dto.VendorRequest;
import cts.equipment.dto.VendorResponse;
import cts.equipment.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@Validated
@Tag(name = "Vendor Management", description = "APIs for managing vendors in the equipment tracking system. " +
        "Vendors are suppliers and service providers for equipment.")
@SecurityRequirement(name = "Bearer Authentication")
public class VendorController {

    private final VendorService vendorService;
    
    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping
    @Operation(
            summary = "Register new vendor",
            description = "Creates a new vendor entry in the system with details including vendor ID, name, " +
                    "contact information, and other relevant details."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Vendor successfully registered",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VendorResponse.class)
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
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Vendor with the given ID already exists",
                    content = @Content
            )
    })
    public ResponseEntity<VendorResponse> registerVendor(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Vendor registration details",
                    required = true,
                    content = @Content(schema = @Schema(implementation = VendorRequest.class))
            )
            @Valid @RequestBody VendorRequest request) {
        VendorResponse response = vendorService.registerVendor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "Get all vendors",
            description = "Retrieves a list of all vendors registered in the system."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved all vendors",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VendorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        List<VendorResponse> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/{vendorId}")
    @Operation(
            summary = "Get vendor by ID",
            description = "Retrieves detailed information about a specific vendor using their unique identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vendor found successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VendorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Vendor not found with the given ID",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - Invalid or missing JWT token",
                    content = @Content
            )
    })
    public ResponseEntity<VendorResponse> getVendorById(
            @Parameter(description = "Unique identifier of the vendor", required = true, example = "VEN-001")
            @PathVariable String vendorId) {
        VendorResponse response = vendorService.getVendorById(vendorId);
        return ResponseEntity.ok(response);
    }

}
