package com.cts.equiptrack.maintenance.service;

import com.cts.equiptrack.maintenance.client.EquipmentServiceClient;
import com.cts.equiptrack.maintenance.dto.EquipmentResponse;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskRequest;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskResponse;
import com.cts.equiptrack.maintenance.entity.MaintenanceTask;
import com.cts.equiptrack.maintenance.exception.ResourceNotFoundException;
import com.cts.equiptrack.maintenance.repository.MaintenanceTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaintenanceTaskServiceTest {

    @Mock
    private MaintenanceTaskRepository maintenanceTaskRepository;

    @Mock
    private EquipmentServiceClient equipmentServiceClient;

    @InjectMocks
    private MaintenanceTaskService maintenanceTaskService;

    private MaintenanceTaskRequest request;
    private MaintenanceTask task;
    private EquipmentResponse equipmentResponse;

    @BeforeEach
    void setUp() {
        equipmentResponse = new EquipmentResponse();
        equipmentResponse.setEquipmentId("EQ-001");
        equipmentResponse.setEquipmentName("CNC Machine");

        request = new MaintenanceTaskRequest();
        request.setEquipmentId("EQ-001");
        request.setEquipmentName("CNC Machine");
        request.setTitle("Scheduled Maintenance");
        request.setDescription("Regular maintenance check");
        request.setScheduledDate(LocalDate.now().plusDays(7));
        request.setPriority("HIGH");
        request.setStatus("PENDING");
        request.setAssignedOperatorId("1");

        task = new MaintenanceTask();
        task.setId(1L);
        task.setEquipmentId("EQ-001");
        task.setEquipmentName("CNC Machine");
        task.setTitle("Scheduled Maintenance");
        task.setDescription("Regular maintenance check");
        task.setScheduledDate(LocalDate.now().plusDays(7));
        task.setPriority("HIGH");
        task.setStatus("PENDING");
        task.setAssignedOperatorId("1");
    }

    @Test
    void testCreateTask_Success() {
        when(equipmentServiceClient.getEquipmentById("EQ-001")).thenReturn(equipmentResponse);
        when(maintenanceTaskRepository.save(any(MaintenanceTask.class))).thenReturn(task);

        MaintenanceTaskResponse response = maintenanceTaskService.createTask(request);

        assertNotNull(response);
        assertEquals("EQ-001", response.getEquipmentId());
        assertEquals("Scheduled Maintenance", response.getTitle());
        verify(maintenanceTaskRepository, times(1)).save(any(MaintenanceTask.class));
    }

    @Test
    void testCreateTask_EquipmentNotFound() {
        when(equipmentServiceClient.getEquipmentById("EQ-001")).thenThrow(new RuntimeException("Equipment not found"));

        assertThrows(ResourceNotFoundException.class, () -> maintenanceTaskService.createTask(request));
        verify(maintenanceTaskRepository, never()).save(any(MaintenanceTask.class));
    }

    @Test
    void testGetAllTasks_ReturnsMultiple() {
        MaintenanceTask task2 = new MaintenanceTask();
        task2.setId(2L);
        task2.setEquipmentId("EQ-002");

        when(maintenanceTaskRepository.findAll()).thenReturn(Arrays.asList(task, task2));

        List<MaintenanceTaskResponse> responses = maintenanceTaskService.getAllTasks();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetTaskById_Found() {
        when(maintenanceTaskRepository.findById(1L)).thenReturn(Optional.of(task));

        MaintenanceTaskResponse response = maintenanceTaskService.getTaskById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void testGetTaskById_NotFound() {
        when(maintenanceTaskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> maintenanceTaskService.getTaskById(999L));
    }

    @Test
    void testGetTasksByEquipmentId() {
        when(maintenanceTaskRepository.findByEquipmentId("EQ-001")).thenReturn(Arrays.asList(task));

        List<MaintenanceTaskResponse> responses = maintenanceTaskService.getTasksByEquipmentId("EQ-001");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("EQ-001", responses.get(0).getEquipmentId());
    }

    @Test
    void testGetTasksByStatus() {
        when(maintenanceTaskRepository.findByStatus("PENDING")).thenReturn(Arrays.asList(task));

        List<MaintenanceTaskResponse> responses = maintenanceTaskService.getTasksByStatus("PENDING");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("PENDING", responses.get(0).getStatus());
    }

    @Test
    void testHasActiveMaintenance_True() {
        when(maintenanceTaskRepository.findActiveMaintenanceByEquipmentId("EQ-001")).thenReturn(Arrays.asList(task));

        boolean result = maintenanceTaskService.hasActiveMaintenance("EQ-001");

        assertTrue(result);
    }

    @Test
    void testHasActiveMaintenance_False() {
        when(maintenanceTaskRepository.findActiveMaintenanceByEquipmentId("EQ-001")).thenReturn(Collections.emptyList());

        boolean result = maintenanceTaskService.hasActiveMaintenance("EQ-001");

        assertFalse(result);
    }

    @Test
    void testUpdateTaskStatus_Success() {
        when(maintenanceTaskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(maintenanceTaskRepository.save(any(MaintenanceTask.class))).thenReturn(task);

        MaintenanceTaskResponse response = maintenanceTaskService.updateTaskStatus(1L, "COMPLETED");

        assertNotNull(response);
        verify(maintenanceTaskRepository, times(1)).save(any(MaintenanceTask.class));
    }

    @Test
    void testDeleteTask_Success() {
        when(maintenanceTaskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(maintenanceTaskRepository).deleteById(1L);

        assertDoesNotThrow(() -> maintenanceTaskService.deleteTask(1L));
        verify(maintenanceTaskRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteTask_NotFound() {
        when(maintenanceTaskRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> maintenanceTaskService.deleteTask(999L));
    }

    @Test
    void testGetTasksByOperatorId() {
        when(maintenanceTaskRepository.findByAssignedOperatorId("1")).thenReturn(Arrays.asList(task));

        List<MaintenanceTaskResponse> responses = maintenanceTaskService.getTasksByOperatorId("1");

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }
}
