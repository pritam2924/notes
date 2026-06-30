package com.cts.equiptrack.maintenance.controller;

import com.cts.equiptrack.maintenance.dto.MaintenanceTaskRequest;
import com.cts.equiptrack.maintenance.dto.MaintenanceTaskResponse;
import com.cts.equiptrack.maintenance.service.MaintenanceTaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MaintenanceTaskController.class)
class MaintenanceTaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MaintenanceTaskService maintenanceTaskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTask_ShouldReturnCreatedTask() throws Exception {
        MaintenanceTaskRequest request = new MaintenanceTaskRequest(
                "EQ001", "Test Equipment", "Test Task", "Description",
                LocalDate.now().plusDays(1), "HIGH", "PENDING", "1"
        );

        MaintenanceTaskResponse response = new MaintenanceTaskResponse(
                1L, "EQ001", "Test Equipment", "Test Task", "Description",
                LocalDate.now().plusDays(1), "HIGH", "PENDING",
                LocalDateTime.now(), LocalDateTime.now(), "1", "Operator 1"
        );

        when(maintenanceTaskService.createTask(any(MaintenanceTaskRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/maintenance-tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.equipmentId").value("EQ001"));
    }

    @Test
    void getAllTasks_ShouldReturnTaskList() throws Exception {
        List<MaintenanceTaskResponse> tasks = Arrays.asList(
                new MaintenanceTaskResponse(1L, "EQ001", "Equipment 1", "Task 1", "Desc 1",
                        LocalDate.now(), "HIGH", "PENDING", LocalDateTime.now(), LocalDateTime.now(), "1", "Op 1"),
                new MaintenanceTaskResponse(2L, "EQ002", "Equipment 2", "Task 2", "Desc 2",
                        LocalDate.now(), "MEDIUM", "IN_PROGRESS", LocalDateTime.now(), LocalDateTime.now(), "2", "Op 2")
        );

        when(maintenanceTaskService.getAllTasks()).thenReturn(tasks);

        mockMvc.perform(get("/api/maintenance-tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getTaskById_ShouldReturnTask() throws Exception {
        MaintenanceTaskResponse response = new MaintenanceTaskResponse(
                1L, "EQ001", "Test Equipment", "Test Task", "Description",
                LocalDate.now(), "HIGH", "PENDING",
                LocalDateTime.now(), LocalDateTime.now(), "1", "Operator 1"
        );

        when(maintenanceTaskService.getTaskById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/maintenance-tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.equipmentId").value("EQ001"));
    }
}