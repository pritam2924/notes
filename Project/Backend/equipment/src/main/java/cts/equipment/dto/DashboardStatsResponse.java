package cts.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalEquipment;
    private Long activeVendors;
    private Long pendingMaintenance;
    private String uptime;
    private Long totalAlerts;
    private Long criticalAlerts;
    private Long warningAlerts;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> categoryDistribution;
}
