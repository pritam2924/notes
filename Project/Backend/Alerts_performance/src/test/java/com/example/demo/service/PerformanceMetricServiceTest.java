package com.example.demo.service;

import com.example.demo.dto.PerformanceMetricRequest;
import com.example.demo.dto.PerformanceMetricResponse;
import com.example.demo.entity.PerformanceMetric;
import com.example.demo.repository.PerformanceMetricRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PerformanceMetricServiceTest {

    @Mock
    private PerformanceMetricRepository repository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PerformanceMetricService performanceMetricService;

    private PerformanceMetricRequest request;
    private PerformanceMetric metric;
    private PerformanceMetricResponse response;

    @BeforeEach
    void setUp() {
        request = new PerformanceMetricRequest();
        request.setEquipmentId("EQ-001");
        request.setCategory("Mechanical");
        request.setTemperature(75.5);
        request.setLoadPercentage(80.0);
        request.setVibration(2.5);
        request.setTimestamp(LocalDateTime.now());

        metric = new PerformanceMetric();
        metric.setId(1L);
        metric.setEquipmentId("EQ-001");
        metric.setCategory("Mechanical");
        metric.setTemperature(75.5);
        metric.setLoadPercentage(80.0);
        metric.setVibration(2.5);
        metric.setTimestamp(LocalDateTime.now());

        response = new PerformanceMetricResponse();
        response.setId(1L);
        response.setEquipmentId("EQ-001");
        response.setCategory("Mechanical");
        response.setTemperature(75.5);
        response.setLoadPercentage(80.0);
        response.setVibration(2.5);
        response.setTimestamp(LocalDateTime.now());
    }

    @Test
    void testCreateMetric_Success() {
        when(modelMapper.map(request, PerformanceMetric.class)).thenReturn(metric);
        when(repository.save(any(PerformanceMetric.class))).thenReturn(metric);
        when(modelMapper.map(metric, PerformanceMetricResponse.class)).thenReturn(response);

        PerformanceMetricResponse result = performanceMetricService.createMetric(request);

        assertNotNull(result);
        assertEquals("EQ-001", result.getEquipmentId());
        verify(repository, times(1)).save(any(PerformanceMetric.class));
    }

    @Test
    void testGetAllMetrics_ReturnsMultiple() {
        PerformanceMetric metric2 = new PerformanceMetric();
        metric2.setId(2L);
        metric2.setEquipmentId("EQ-002");

        PerformanceMetricResponse response2 = new PerformanceMetricResponse();
        response2.setId(2L);
        response2.setEquipmentId("EQ-002");

        when(repository.findAll()).thenReturn(Arrays.asList(metric, metric2));
        when(modelMapper.map(metric, PerformanceMetricResponse.class)).thenReturn(response);
        when(modelMapper.map(metric2, PerformanceMetricResponse.class)).thenReturn(response2);

        List<PerformanceMetricResponse> responses = performanceMetricService.getAllMetrics();

        assertNotNull(responses);
        assertEquals(2, responses.size());
    }

    @Test
    void testGetMetricById_Found() {
        when(repository.findById(1L)).thenReturn(Optional.of(metric));
        when(modelMapper.map(metric, PerformanceMetricResponse.class)).thenReturn(response);

        PerformanceMetricResponse result = performanceMetricService.getMetricById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetMetricById_NotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> performanceMetricService.getMetricById(999L));
    }

    @Test
    void testGetMetricsByEquipment() {
        when(repository.findByEquipmentId("EQ-001")).thenReturn(Arrays.asList(metric));
        when(modelMapper.map(metric, PerformanceMetricResponse.class)).thenReturn(response);

        List<PerformanceMetricResponse> responses = performanceMetricService.getMetricsByEquipment("EQ-001");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("EQ-001", responses.get(0).getEquipmentId());
    }

    @Test
    void testGetMetricsByEquipmentAndTimeRange() {
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        when(repository.findByEquipmentIdAndTimestampBetween("EQ-001", start, end)).thenReturn(Arrays.asList(metric));
        when(modelMapper.map(metric, PerformanceMetricResponse.class)).thenReturn(response);

        List<PerformanceMetricResponse> responses = performanceMetricService.getMetricsByEquipmentAndTimeRange("EQ-001", start, end);

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }
}
