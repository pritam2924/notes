package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementResponse {
    private Long movementId;
    private String sparePartId;
    private String sparePartName;
    private String movementType; // "IN" or "OUT"
    private Integer quantity;
    private String reason; // "PURCHASE", "ISSUE", "RETURN", "ADJUSTMENT", etc.
    private String referenceNumber;
    private String performedBy;
    private Integer previousStock;
    private Integer newStock;
    private LocalDateTime movementDate;
    private String notes;
}
