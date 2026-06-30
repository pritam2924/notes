package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "requisitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Requisition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sparePartId;
    private String equipmentId;
    private Integer requestedQuantity;
    private String requestedBy;
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private String adminComment;
    private String processedBy;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String notes;
}
