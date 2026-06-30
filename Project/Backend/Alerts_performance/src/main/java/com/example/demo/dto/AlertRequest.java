package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

/**
 * DTO used when creating an Alert.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertRequest {
    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;
    
    @NotBlank(message = "Equipment name is required")
    private String equipmentName;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "info|warning|critical", message = "Severity must be info, warning, or critical")
    private String severity;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @Pattern(regexp = "open|closed|acknowledged", message = "Status must be open, closed, or acknowledged")
    private String status = "open";
    
    private String metricType;
    
    @DecimalMin(value = "0.0", message = "Metric value must be positive")
    private Double metricValue;
    
    @DecimalMin(value = "0.0", message = "Threshold value must be positive")
    private Double thresholdValue;
    
    private String notes;
}
