package com.example.demo.service;

import com.example.demo.dto.AlertRequest;
import com.example.demo.dto.AlertResponse;
import com.example.demo.entity.Alert;
import com.example.demo.repository.AlertRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private AlertRepository repository;

    @InjectMocks
    private AlertService alertService;

    private AlertRequest request;
    private Alert alert;

    @BeforeEach
    void setUp() {
        request = new AlertRequest();
        request.setEquipmentId("EQ-001");
        request.setEquipmentName("CNC Machine");
        request.setCategory("Mechanical");
        request.setSeverity("HIGH");
        request.setMessage("Temperature exceeds threshold");
        request.setStatus("open");
        request.setMetricType("temperature");
        request.setMetricValue(95.0);
        request.setThresholdValue(80.0);

        alert = new Alert();
        alert.setId("ALERT-001");
        alert.setEquipmentId("EQ-001");
        alert.setEquipmentName("CNC Machine");
        alert.setCategory("Mechanical");
        alert.setSeverity("HIGH");
        alert.setMessage("Temperature exceeds threshold");
        alert.setStatus("open");
        alert.setMetricType("temperature");
        alert.setMetricValue(95.0);
        alert.setThresholdValue(80.0);
        alert.setTimestamp(LocalDateTime.now());
    }

    @Test
    void testCreateAlert_Success() {
        when(repository.save(any(Alert.class))).thenReturn(alert);

        AlertResponse response = alertService.createAlert(request);

        assertNotNull(response);
        assertEquals("EQ-001", response.getEquipmentId());
        assertEquals("HIGH", response.getSeverity());
        verify(repository, times(1)).save(any(Alert.class));
    }

    @Test
    void testGetAllAlerts_ReturnsMultiple() {
        Alert alert2 = new Alert();
        alert2.setId("ALERT-002");
        alert2.setEquipmentId("EQ-002");

        when(repository.findAll()).thenReturn(Arrays.asList(alert, alert2));

        List<AlertResponse> responses = alertService.getAllAlerts();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetAlertById_Found() {
        when(repository.findById("ALERT-001")).thenReturn(Optional.of(alert));

        AlertResponse response = alertService.getAlertById("ALERT-001");

        assertNotNull(response);
        assertEquals("ALERT-001", response.getId());
    }

    @Test
    void testGetAlertById_NotFound() {
        when(repository.findById("ALERT-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> alertService.getAlertById("ALERT-999"));
    }

    @Test
    void testGetAlertsByEquipment() {
        when(repository.findByEquipmentId("EQ-001")).thenReturn(Arrays.asList(alert));

        List<AlertResponse> responses = alertService.getAlertsByEquipment("EQ-001");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("EQ-001", responses.get(0).getEquipmentId());
    }

    @Test
    void testGetAlertsByStatus() {
        when(repository.findByStatus("open")).thenReturn(Arrays.asList(alert));

        List<AlertResponse> responses = alertService.getAlertsByStatus("open");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("open", responses.get(0).getStatus());
    }

    @Test
    void testUpdateAlertStatus_Success() {
        when(repository.findById("ALERT-001")).thenReturn(Optional.of(alert));
        when(repository.save(any(Alert.class))).thenReturn(alert);

        AlertResponse response = alertService.updateAlertStatus("ALERT-001", "closed");

        assertNotNull(response);
        verify(repository, times(1)).save(any(Alert.class));
    }

    @Test
    void testGetAlertsByEquipment_EmptyList() {
        when(repository.findByEquipmentId("EQ-999")).thenReturn(Collections.emptyList());

        List<AlertResponse> responses = alertService.getAlertsByEquipment("EQ-999");

        assertNotNull(responses);
        assertTrue(responses.isEmpty());
    }
}
