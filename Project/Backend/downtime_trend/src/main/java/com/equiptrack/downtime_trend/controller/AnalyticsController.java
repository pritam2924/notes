package com.equiptrack.downtime_trend.controller;

import com.equiptrack.downtime_trend.dto.AnalyticsSummaryResponse;
import com.equiptrack.downtime_trend.dto.EquipmentAnalyticsData;
import com.equiptrack.downtime_trend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get analytics summary with maintenance cost and revenue")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalyticsSummary() {
        logger.info("Request received for analytics summary");
        AnalyticsSummaryResponse summary = analyticsService.getAnalyticsSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/equipment")
    @Operation(summary = "Get detailed analytics for all equipment")
    public ResponseEntity<List<EquipmentAnalyticsData>> getEquipmentAnalytics() {
        logger.info("Request received for equipment analytics");
        List<EquipmentAnalyticsData> analytics = analyticsService.getEquipmentAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
