package com.cts.equiptrack.maintenance.repository;

import com.cts.equiptrack.maintenance.entity.MaintenanceTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long> {
    
    List<MaintenanceTask> findByEquipmentId(String equipmentId);
    
    List<MaintenanceTask> findByStatus(String status);
    
    List<MaintenanceTask> findByPriority(String priority);
    
    List<MaintenanceTask> findByScheduledDate(LocalDate scheduledDate);
    
    @Query("SELECT m FROM MaintenanceTask m WHERE m.equipmentId = :equipmentId AND m.status IN ('Scheduled', 'In Progress')")
    List<MaintenanceTask> findActiveMaintenanceByEquipmentId(@Param("equipmentId") String equipmentId);
    
    @Query("SELECT m FROM MaintenanceTask m WHERE m.scheduledDate BETWEEN :startDate AND :endDate")
    List<MaintenanceTask> findByScheduledDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    List<MaintenanceTask> findByAssignedOperatorId(String assignedOperatorId);

    @Query("SELECT m FROM MaintenanceTask m WHERE m.assignedOperatorId = :operatorId AND m.status IN ('Scheduled', 'In Progress')")
    List<MaintenanceTask> findActiveTasksByOperatorId(@Param("operatorId") String operatorId);
}