package com.equiptrack.downtime_trend.controller;

import com.equiptrack.downtime_trend.dto.DowntimeMetricsResponse;
import com.equiptrack.downtime_trend.dto.DowntimeReportResponse;
import com.equiptrack.downtime_trend.dto.EquipmentResponse;
import com.equiptrack.downtime_trend.dto.MaintenanceTaskResponse;
import com.equiptrack.downtime_trend.service.DowntimeService;
import com.equiptrack.downtime_trend.client.EquipmentServiceClient;
import com.equiptrack.downtime_trend.client.MaintenanceServiceClient;
import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/downtime")
public class DowntimeController {

    private static final Logger logger = LoggerFactory.getLogger(DowntimeController.class);

    private final DowntimeService downtimeService;
    private final EquipmentServiceClient equipmentServiceClient;
    private final MaintenanceServiceClient maintenanceServiceClient;

    public DowntimeController(DowntimeService downtimeService, 
                            EquipmentServiceClient equipmentServiceClient,
                            MaintenanceServiceClient maintenanceServiceClient) {
        this.downtimeService = downtimeService;
        this.equipmentServiceClient = equipmentServiceClient;
        this.maintenanceServiceClient = maintenanceServiceClient;
    }

    @GetMapping("/reports")
    @Operation(summary = "Get all downtime reports")
    public ResponseEntity<List<DowntimeReportResponse>> getDowntimeReports() {
        logger.info("Request received to get all downtime reports");
        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();
        logger.info("Returning {} downtime reports", reports.size());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get aggregated downtime metrics")
    public ResponseEntity<DowntimeMetricsResponse> getDowntimeMetrics() {
        logger.info("Request received to get aggregated downtime metrics");
        DowntimeMetricsResponse metrics = downtimeService.getDowntimeMetrics();
        logger.info("Returning downtime metrics");
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/sync")
    @Operation(summary = "Sync maintenance data to downtime events")
    public ResponseEntity<String> syncMaintenanceData() {
        logger.info("Request received to sync maintenance data");
        downtimeService.syncMaintenanceData();
        return ResponseEntity.ok("Maintenance data synced successfully");
    }

    @GetMapping("/trend/{days}")
    @Operation(summary = "Get equipment count trend for specified days")
    public ResponseEntity<Map<String, Long>> getEquipmentCountTrend(@PathVariable int days) {
        logger.info("Request received to get equipment count trend for {} days", days);
        Map<String, Long> trend = downtimeService.getEquipmentCountTrend(days);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export downtime reports as a CSV file")
    public ResponseEntity<byte[]> exportDowntimeReportsCSV() throws Exception {
        logger.info("Request received to export downtime reports as CSV");
        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment",
                "downtime-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm")) + ".csv");

        try (StringWriter writer = new StringWriter()) {
            StatefulBeanToCsv<DowntimeReportResponse> beanToCsv = new StatefulBeanToCsvBuilder<DowntimeReportResponse>(writer)
                    .withQuotechar(CSVWriter.DEFAULT_QUOTE_CHARACTER)
                    .build();

            beanToCsv.write(reports);

            logger.info("Successfully generated CSV file for {} reports", reports.size());
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(writer.toString().getBytes());
        }
    }

    @GetMapping("/export/json")
    @Operation(summary = "Export downtime reports as a JSON file")
    public ResponseEntity<List<DowntimeReportResponse>> exportDowntimeReportsJSON() {
        logger.info("Request received to export downtime reports as JSON");
        List<DowntimeReportResponse> reports = downtimeService.getDowntimeReports();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment",
                "downtime-report-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm")) + ".json");

        logger.info("Successfully generated JSON file for {} reports", reports.size());
        return ResponseEntity.ok()
                .headers(headers)
                .body(reports);
    }

    @PostMapping("/seed")
    @Operation(summary = "Seed the database with sample downtime data")
    public ResponseEntity<List<DowntimeReportResponse>> seedSampleData() {
        logger.info("Request received to seed the database with sample downtime data");
        List<DowntimeReportResponse> reports = downtimeService.seedSampleData();
        logger.info("Successfully seeded the database with {} downtime events", reports.size());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/maintenance-tasks/equipment/{equipmentId}")
    @Operation(summary = "Get maintenance tasks by equipment ID")
    public ResponseEntity<List<MaintenanceTaskResponse>> getMaintenanceTasksByEquipment(@PathVariable String equipmentId) {
        logger.info("Getting maintenance tasks for equipment: {}", equipmentId);
        try {
            List<MaintenanceTaskResponse> tasks = maintenanceServiceClient.getMaintenanceTasksByEquipment(equipmentId);
            logger.info("Retrieved {} maintenance tasks", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Failed to get maintenance tasks", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get equipment details")
    public ResponseEntity<EquipmentResponse> getEquipmentById(@PathVariable String equipmentId) {
        logger.info("Getting equipment details for: {}", equipmentId);
        try {
            EquipmentResponse equipment = equipmentServiceClient.getEquipmentById(equipmentId);
            logger.info("Retrieved equipment: {}", equipment.getEquipmentName());
            return ResponseEntity.ok(equipment);
        } catch (Exception e) {
            logger.error("Failed to get equipment details", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health check and scheduler status")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        logger.info("Health check requested");
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "downtime-trend");
        health.put("schedulerEnabled", true);
        health.put("syncInterval", "5 minutes");
        
        try {
            downtimeService.syncMaintenanceData();
            health.put("lastSyncStatus", "SUCCESS");
        } catch (Exception e) {
            health.put("lastSyncStatus", "FAILED: " + e.getMessage());
        }
        
        return ResponseEntity.ok(health);
    }
}
