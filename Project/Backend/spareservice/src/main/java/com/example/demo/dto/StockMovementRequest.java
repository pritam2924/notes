package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementRequest {
    @NotBlank(message = "Spare part ID is required")
    private String sparePartId;
    @NotBlank(message = "Movement type is required")
    @Pattern(regexp = "^(IN|OUT)$", message = "Movement type must be 'IN' or 'OUT'")
    private String movementType; // "IN" or "OUT"
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    @NotBlank(message = "Reason is required")
    private String reason; // "PURCHASE", "ISSUE", "RETURN", "ADJUSTMENT", etc.
    private String referenceNumber;
    @NotBlank(message = "Performed by is required")
    private String performedBy;
    private String notes;
}
