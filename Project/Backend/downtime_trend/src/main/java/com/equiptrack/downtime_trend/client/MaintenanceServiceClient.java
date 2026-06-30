package com.equiptrack.downtime_trend.client;

import com.equiptrack.downtime_trend.dto.MaintenanceTaskResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "maintenance-service")
public interface MaintenanceServiceClient {
    
    @GetMapping("/api/maintenance-tasks")
    List<MaintenanceTaskResponse> getAllMaintenanceTasks();
    
    @GetMapping("/api/maintenance-tasks/equipment/{equipmentId}")
    List<MaintenanceTaskResponse> getMaintenanceTasksByEquipment(@PathVariable("equipmentId") String equipmentId);
    
    @GetMapping("/api/maintenance-tasks/{taskId}")
    MaintenanceTaskResponse getMaintenanceTaskById(@PathVariable("taskId") String taskId);
}