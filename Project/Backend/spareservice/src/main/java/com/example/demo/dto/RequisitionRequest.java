package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequisitionRequest {
    @NotBlank(message = "Spare part ID is required")
    private String sparePartId;
    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;
    @NotNull(message = "Requested quantity is required")
    @Positive(message = "Requested quantity must be positive")
    private Integer requestedQuantity;
    @NotBlank(message = "Requested by is required")
    private String requestedBy; // operator name or id
    private String notes;
}
