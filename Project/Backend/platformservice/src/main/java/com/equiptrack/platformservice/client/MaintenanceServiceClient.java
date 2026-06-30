package com.equiptrack.platformservice.client;

import com.equiptrack.platformservice.dto.MaintenanceTaskResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "MAINTENANCE-SERVICE")
public interface MaintenanceServiceClient {
    
    @GetMapping("/api/maintenance-tasks")
    List<MaintenanceTaskResponse> getAllMaintenanceTasks();
    
    @GetMapping("/api/maintenance-tasks/equipment/{equipmentId}")
    List<MaintenanceTaskResponse> getMaintenanceTasksByEquipment(@PathVariable("equipmentId") String equipmentId);
    
    @GetMapping("/api/maintenance-tasks/summary")
    MaintenanceSummary getMaintenanceSummary();
    
    public static class MaintenanceSummary {
        private Long totalTasks;
        private Long pendingTasks;
        private Long inProgressTasks;
        private Long completedTasks;
        private Long overdueTasks;
        
        public Long getTotalTasks() { return totalTasks; }
        public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }
        public Long getPendingTasks() { return pendingTasks; }
        public void setPendingTasks(Long pendingTasks) { this.pendingTasks = pendingTasks; }
        public Long getInProgressTasks() { return inProgressTasks; }
        public void setInProgressTasks(Long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
        public Long getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(Long completedTasks) { this.completedTasks = completedTasks; }
        public Long getOverdueTasks() { return overdueTasks; }
        public void setOverdueTasks(Long overdueTasks) { this.overdueTasks = overdueTasks; }
    }
}