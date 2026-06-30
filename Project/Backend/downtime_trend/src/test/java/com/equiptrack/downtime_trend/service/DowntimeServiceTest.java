package com.equiptrack.downtime_trend.service;

import com.equiptrack.downtime_trend.dto.DowntimeMetricsResponse;
import com.equiptrack.downtime_trend.dto.DowntimeReportResponse;
import com.equiptrack.downtime_trend.entity.DowntimeEvent;
import com.equiptrack.downtime_trend.repository.DowntimeEventRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DowntimeServiceTest {

    @Mock
    private DowntimeEventRepository eventRepository;

    @InjectMocks
    private DowntimeService downtimeService;

    private DowntimeEvent event1;
    private DowntimeEvent event2;

    @BeforeEach
    void setUp() {
        event1 = new DowntimeEvent();
        event1.setId("1");
        event1.setEquipmentName("Press-01");
        event1.setDowntimeStart(LocalDateTime.now().minusHours(5));
        event1.setDowntimeEnd(LocalDateTime.now().minusHours(3));
        event1.setDurationHours(2.0);
        event1.setCause("Routine maintenance");
        event1.setRecommendations("Replace filter");
        event1.setIsOngoing(false);

        event2 = new DowntimeEvent();
        event2.setId("2");
        event2.setEquipmentName("Cutter-02");
        event2.setDowntimeStart(LocalDateTime.now().minusHours(2));
        event2.setDowntimeEnd(null);
        event2.setDurationHours(2.0);
        event2.setCause("Unexpected fault");
        event2.setRecommendations("Inspect motor");
        event2.setIsOngoing(true);
    }

    @Test
    void testGetDowntimeReports_ReturnsMultiple() {
        when(eventRepository.findAllByOrderByDowntimeStartDesc()).thenReturn(Arrays.asList(event1, event2));

        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();

        assertNotNull(reports);
        assertEquals(2, reports.size());
        assertEquals("Press-01", reports.get(0).getEquipmentName());
        assertEquals("Cutter-02", reports.get(1).getEquipmentName());
    }

    @Test
    void testGetDowntimeReports_ReturnsEmpty() {
        when(eventRepository.findAllByOrderByDowntimeStartDesc()).thenReturn(Collections.emptyList());

        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();

        assertNotNull(reports);
        assertTrue(reports.isEmpty());
    }

    @Test
    void testGetDowntimeMetrics_CalculatesCorrectly() {
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();

        assertNotNull(metrics);
        assertEquals(4.0, metrics.getTotalDowntimeHours());
        assertEquals(2, metrics.getTotalIncidents());
        assertNotNull(metrics.getEquipmentDowntime());
        assertNotNull(metrics.getDowntimeCauses());
    }

    @Test
    void testGetDowntimeMetrics_WithEmptyData() {
        when(eventRepository.findAll()).thenReturn(Collections.emptyList());

        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();

        assertNotNull(metrics);
        assertEquals(0.0, metrics.getTotalDowntimeHours());
        assertEquals(0, metrics.getTotalIncidents());
        assertNull(metrics.getMostAffectedEquipment());
        assertNull(metrics.getTopRootCause());
    }

    @Test
    void testGetDowntimeMetrics_IdentifiesMostAffected() {
        event1.setDurationHours(5.0);
        event2.setDurationHours(2.0);
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();

        assertNotNull(metrics);
        assertEquals("Press-01", metrics.getMostAffectedEquipment());
    }

    @Test
    void testGetDowntimeMetrics_IdentifiesTopCause() {
        DowntimeEvent event3 = new DowntimeEvent();
        event3.setEquipmentName("Machine-03");
        event3.setDurationHours(1.0);
        event3.setCause("Routine maintenance");

        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2, event3));

        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();

        assertNotNull(metrics);
        assertEquals("Routine maintenance", metrics.getTopRootCause());
    }

    @Test
    void testSeedSampleData_CreatesAndReturnsData() {
        when(eventRepository.saveAll(anyList())).thenReturn(Arrays.asList(event1, event2));
        when(eventRepository.findAllByOrderByDowntimeStartDesc()).thenReturn(Arrays.asList(event1, event2));

        List<DowntimeReportResponse> reports = downtimeService.seedSampleData();

        assertNotNull(reports);
        assertEquals(2, reports.size());
        verify(eventRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testGetDowntimeReports_HandlesNullValues() {
        DowntimeEvent eventWithNulls = new DowntimeEvent();
        eventWithNulls.setId("3");
        eventWithNulls.setEquipmentName(null);
        eventWithNulls.setDurationHours(null);
        eventWithNulls.setCause(null);

        when(eventRepository.findAllByOrderByDowntimeStartDesc()).thenReturn(Arrays.asList(eventWithNulls));

        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();

        assertNotNull(reports);
        assertEquals(1, reports.size());
        assertNull(reports.get(0).getEquipmentName());
    }

    @Test
    void testGetDowntimeMetrics_HandlesNullDuration() {
        event1.setDurationHours(null);
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1));

        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();

        assertNotNull(metrics);
        assertEquals(0.0, metrics.getTotalDowntimeHours());
    }
}
