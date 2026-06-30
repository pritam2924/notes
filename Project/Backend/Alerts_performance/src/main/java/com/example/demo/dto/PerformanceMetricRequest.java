package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceMetricRequest {

    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;

    @NotNull(message = "Timestamp is required")
    private LocalDateTime timestamp;

    private String category;
    
    @DecimalMin(value = "-50.0", message = "Temperature must be above -50°C")
    @DecimalMax(value = "200.0", message = "Temperature must be below 200°C")
    private Double temperature;
    
    @DecimalMin(value = "0.0", message = "Load percentage must be positive")
    @DecimalMax(value = "100.0", message = "Load percentage cannot exceed 100%")
    private Double loadPercentage;
    
    @DecimalMin(value = "0.0", message = "Vibration must be positive")
    private Double vibration;
    
    private String notes;
}
