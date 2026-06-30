package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {
    private String id;
    private String equipmentId;
    private String equipmentName;
    private String category;
    private String severity;
    private String message;
    private String status;
    private LocalDateTime timestamp;
    private String metricType;
    private Double metricValue;
    private Double thresholdValue;
    private String notes;
}