package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequisitionResponse {
    private Long id;
    private String sparePartId;
    private String sparePartName;
    private String equipmentId;
    private String equipmentName;
    private String requestedBy;
    private Integer requestedQuantity;
    private String status;
    private String adminComment;
    private String processedBy;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String notes;
}
