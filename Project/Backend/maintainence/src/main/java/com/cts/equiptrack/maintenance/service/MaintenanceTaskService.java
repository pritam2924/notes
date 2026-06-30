package com.cts.equiptrack.maintenance.service;

import com.cts.equiptrack.maintenance.exception.ResourceNotFoundException;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskRequest;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskResponse;
import com.cts.equiptrack.maintenance.client.EquipmentServiceClient;
import com.cts.equiptrack.maintenance.client.UserServiceClient;
import com.cts.equiptrack.maintenance.dto.EquipmentResponse;
import com.cts.equiptrack.maintenance.dto.UserResponse;
import com.cts.equiptrack.maintenance.entity.MaintenanceTask;
import com.cts.equiptrack.maintenance.repository.MaintenanceTaskRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceTaskService {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceTaskService.class);

    @Autowired
    private MaintenanceTaskRepository maintenanceTaskRepository;
    
    @Autowired
    private EquipmentServiceClient equipmentServiceClient;
    
    @Autowired
    private UserServiceClient userServiceClient;

    public MaintenanceTaskResponse createTask(MaintenanceTaskRequest request) {
        logger.info("Creating maintenance task for equipment: {}", request.getEquipmentId());
        
        // Validate equipment exists
        try {
            EquipmentResponse equipment = equipmentServiceClient.getEquipmentById(request.getEquipmentId());
            logger.info("Equipment validated: {} - {}", equipment.getEquipmentId(), equipment.getEquipmentName());
        } catch (Exception e) {
            logger.error("Equipment not found: {}", request.getEquipmentId());
            throw new ResourceNotFoundException("Equipment not found with id: " + request.getEquipmentId());
        }
        
        MaintenanceTask task = new MaintenanceTask();
        task.setEquipmentId(request.getEquipmentId());
        task.setEquipmentName(request.getEquipmentName());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setScheduledDate(request.getScheduledDate());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        task.setAssignedOperatorId(request.getAssignedOperatorId());
        
        // Fetch and set operator name if operator is assigned
        if (request.getAssignedOperatorId() != null && !request.getAssignedOperatorId().isEmpty()) {
            try {
                Long operatorId = Long.parseLong(request.getAssignedOperatorId());
                UserResponse operator = userServiceClient.getUserById(operatorId);
                task.setAssignedOperatorName(operator.getFirstName() + " " + operator.getLastName());
                logger.info("Assigned operator: {}", task.getAssignedOperatorName());
            } catch (Exception e) {
                logger.warn("Could not fetch operator details for ID: {}", request.getAssignedOperatorId(), e);
            }
        }
        
        MaintenanceTask savedTask = maintenanceTaskRepository.save(task);
        logger.info("Successfully created maintenance task with ID: {}", savedTask.getId());
        return convertToResponse(savedTask);
    }

    public List<MaintenanceTaskResponse> getAllTasks() {
        logger.info("Fetching all maintenance tasks");
        List<MaintenanceTask> tasks = maintenanceTaskRepository.findAll();
        logger.info("Found {} maintenance tasks", tasks.size());
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public MaintenanceTaskResponse getTaskById(Long id) {
        logger.info("Fetching maintenance task with ID: {}", id);
        MaintenanceTask task = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Maintenance task not found with ID: {}", id);
                    return new ResourceNotFoundException("Maintenance task not found with id: " + id);
                });
        return convertToResponse(task);
    }

    public List<MaintenanceTaskResponse> getTasksByEquipmentId(String equipmentId) {
        return maintenanceTaskRepository.findByEquipmentId(equipmentId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceTaskResponse> getTasksByStatus(String status) {
        return maintenanceTaskRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceTaskResponse> getTasksByPriority(String priority) {
        return maintenanceTaskRepository.findByPriority(priority).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceTaskResponse> getTasksByScheduledDate(LocalDate scheduledDate) {
        return maintenanceTaskRepository.findByScheduledDate(scheduledDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceTaskResponse> getTasksByDateRange(LocalDate startDate, LocalDate endDate) {
        return maintenanceTaskRepository.findByScheduledDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public boolean hasActiveMaintenance(String equipmentId) {
        List<MaintenanceTask> activeTasks = maintenanceTaskRepository.findActiveMaintenanceByEquipmentId(equipmentId);
        return !activeTasks.isEmpty();
    }

    public MaintenanceTaskResponse updateTaskStatus(Long id, String status) {
        logger.info("Updating status for task ID: {} to: {}", id, status);
        MaintenanceTask task = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Maintenance task not found with ID: {}", id);
                    return new ResourceNotFoundException("Maintenance task not found with id: " + id);
                });
        
        task.setStatus(status);
        MaintenanceTask updatedTask = maintenanceTaskRepository.save(task);
        logger.info("Successfully updated task ID: {} status to: {}", id, status);
        return convertToResponse(updatedTask);
    }

    public void deleteTask(Long id) {
        logger.info("Deleting maintenance task with ID: {}", id);
        if (!maintenanceTaskRepository.existsById(id)) {
            logger.error("Maintenance task not found with ID: {}", id);
            throw new ResourceNotFoundException("Maintenance task not found with id: " + id);
        }
        maintenanceTaskRepository.deleteById(id);
        logger.info("Successfully deleted maintenance task with ID: {}", id);
    }

    public List<MaintenanceTaskResponse> getTasksByOperatorId(String operatorId) {
        logger.info("Fetching tasks for operator ID: {}", operatorId);
        List<MaintenanceTask> tasks = maintenanceTaskRepository.findByAssignedOperatorId(operatorId);
        logger.info("Found {} tasks for operator ID: {}", tasks.size(), operatorId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private MaintenanceTaskResponse convertToResponse(MaintenanceTask task) {
        return new MaintenanceTaskResponse(
                task.getId(),
                task.getEquipmentId(),
                task.getEquipmentName(),
                task.getTitle(),
                task.getDescription(),
                task.getScheduledDate(),
                task.getPriority(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getAssignedOperatorId(),
                task.getAssignedOperatorName()
        );
    }
}