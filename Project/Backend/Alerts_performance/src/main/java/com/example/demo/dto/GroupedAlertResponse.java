package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Response DTO representing a grouped (aggregated) alert for an equipment.
 *
 * The application creates individual Alert entities per metric breach but exposes
 * grouped alerts for UI/consumption. A GroupedAlertResponse contains merged
 * metrics and levels across the group's alerts, the worst (most severe) overall
 * severity, and a list of underlying {@code alertIds} that were merged.
 *
 * Convention: underlying Alert entities that represent multiple metrics will have
 * {@code metricType == "multiple"} and carry the full {@code metrics} and
 * {@code levels} maps. Clients should inspect {@code alertIds} when performing
 * actions that must operate on each underlying alert (e.g., resolving or acknowledging).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupedAlertResponse {
    private String id; // group id (we'll use equipmentId)
    private String equipmentId;
    private String equipmentName;
    private String category;
    private String severity;
    private String status;
    private LocalDateTime timestamp;
    private Map<String, Double> metrics;
    private Map<String, String> levels;
    private List<String> alertIds;
    private String notes;
}
