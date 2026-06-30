package com.equiptrack.downtime_trend.controller;

import com.equiptrack.downtime_trend.dto.ReportSubmissionRequest;
import com.equiptrack.downtime_trend.entity.SubmittedReport;
import com.equiptrack.downtime_trend.repository.SubmittedReportRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    private final SubmittedReportRepository reportRepository;

    public ReportController(SubmittedReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @PostMapping
    @Operation(summary = "Submit a new report")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report submitted successfully",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SubmittedReport.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content) })
    public ResponseEntity<SubmittedReport> submitReport(@Valid @RequestBody ReportSubmissionRequest request) {
        logger.info("Request received to submit a new report with title: {}", request.getTitle());
        SubmittedReport report = new SubmittedReport();
        report.setTitle(request.getTitle());
        report.setSummary(request.getSummary());
        report.setRecommendations(request.getRecommendations());
        report.setPriority(request.getPriority());
        report.setType(request.getType());
        report.setSubmittedBy(request.getSubmittedBy());

        if (request.getData() != null) {
            report.setReportData(request.getData().toString());
        }

        SubmittedReport saved = reportRepository.save(report);
        logger.info("Report with title '{}' submitted successfully with id: {}", saved.getTitle(), saved.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    @Operation(summary = "Get all submitted reports")
    public ResponseEntity<List<SubmittedReport>> getAllReports() {
        logger.info("Request received to get all submitted reports");
        List<SubmittedReport> reports = reportRepository.findAllByOrderBySubmittedAtDesc();
        logger.info("Returning {} submitted reports", reports.size());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get submitted reports by type")
    public ResponseEntity<List<SubmittedReport>> getReportsByType(@PathVariable String type) {
        logger.info("Request received to get submitted reports by type: {}", type);
        List<SubmittedReport> reports = reportRepository.findByTypeOrderBySubmittedAtDesc(type);
        logger.info("Returning {} submitted reports for type: {}", reports.size(), type);
        return ResponseEntity.ok(reports);
    }
}
