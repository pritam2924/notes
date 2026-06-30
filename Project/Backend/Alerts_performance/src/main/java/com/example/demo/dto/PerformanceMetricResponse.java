package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceMetricResponse {
    private Long id;
    private String equipmentId;
    private LocalDateTime timestamp;
    private String category;
    private Double temperature;
    private Double loadPercentage;
    private Double vibration;
    private String notes;
    private LocalDateTime createdAt;
}
