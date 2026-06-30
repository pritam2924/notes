package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movementId;
    private String sparePartId;
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
