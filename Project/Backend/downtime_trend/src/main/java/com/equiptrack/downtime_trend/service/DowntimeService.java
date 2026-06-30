package com.equiptrack.downtime_trend.service;

import com.equiptrack.downtime_trend.client.MaintenanceServiceClient;
import com.equiptrack.downtime_trend.dto.DowntimeMetricsResponse;
import com.equiptrack.downtime_trend.dto.DowntimeReportResponse;
import com.equiptrack.downtime_trend.dto.MaintenanceTaskResponse;
import com.equiptrack.downtime_trend.entity.DowntimeEvent;
import com.equiptrack.downtime_trend.repository.DowntimeEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DowntimeService {

    private static final Logger logger = LoggerFactory.getLogger(DowntimeService.class);

    private final DowntimeEventRepository eventRepository;
    private final MaintenanceServiceClient maintenanceClient;

    public DowntimeService(DowntimeEventRepository eventRepository, MaintenanceServiceClient maintenanceClient) {
        this.eventRepository = eventRepository;
        this.maintenanceClient = maintenanceClient;
    }

    public List<DowntimeReportResponse> getDowntimeReports() {
        logger.info("Fetching all downtime events to generate reports");
        List<DowntimeEvent> events = eventRepository.findAllByOrderByDowntimeStartDesc();
        logger.debug("Found {} downtime events", events.size());
        return events.stream().map(this::toReportDto).collect(Collectors.toList());
    }

    public DowntimeMetricsResponse getDowntimeMetrics() {
        logger.info("Calculating downtime metrics from maintenance data");
        syncMaintenanceData();
        List<DowntimeEvent> events = eventRepository.findAll();

        Map<String, Double> equipmentDowntime = new HashMap<>();
        Map<String, Integer> downtimeCauses = new HashMap<>();
        Map<String, Long> dailyTrend = new LinkedHashMap<>();
        double totalHours = 0.0;

        for (DowntimeEvent e : events) {
            double d = e.getDurationHours() == null ? 0.0 : e.getDurationHours();
            String name = e.getEquipmentName() == null ? "Unknown" : e.getEquipmentName();
            String cause = e.getCause() == null ? "Maintenance" : e.getCause();

            equipmentDowntime.merge(name, d, Double::sum);
            downtimeCauses.merge(cause, 1, Integer::sum);
            totalHours += d;

            if (e.getDowntimeStart() != null) {
                String date = e.getDowntimeStart().toLocalDate().toString();
                dailyTrend.merge(date, 1L, Long::sum);
            }
        }

        String mostAffected = equipmentDowntime.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse(null);

        String topCause = downtimeCauses.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse(null);

        long currentInMaintenance = eventRepository.findByIsOngoingTrue().size();

        DowntimeMetricsResponse metrics = new DowntimeMetricsResponse();
        metrics.setEquipmentDowntime(equipmentDowntime);
        metrics.setDowntimeCauses(downtimeCauses);
        metrics.setTotalDowntimeHours(totalHours);
        metrics.setTotalIncidents(events.size());
        metrics.setMostAffectedEquipment(mostAffected);
        metrics.setTopRootCause(topCause);
        metrics.setDailyTrend(dailyTrend);
        metrics.setCurrentInMaintenance(currentInMaintenance);

        logger.info("Downtime metrics calculated successfully");
        return metrics;
    }

    private DowntimeReportResponse toReportDto(DowntimeEvent e) {
        DowntimeReportResponse r = new DowntimeReportResponse();
        r.setId(e.getId());
        r.setEquipmentName(e.getEquipmentName());
        r.setDuration(e.getDurationHours());
        r.setDowntimeStart(e.getDowntimeStart());
        r.setDowntimeEnd(e.getDowntimeEnd());
        r.setCause(e.getCause());
        r.setRecommendations(e.getRecommendations());
        r.setIsOngoing(Boolean.TRUE.equals(e.getIsOngoing()));
        return r;
    }

    public void syncMaintenanceData() {
        logger.info("Syncing maintenance data to downtime events");
        try {
            List<MaintenanceTaskResponse> tasks = maintenanceClient.getAllMaintenanceTasks();
            logger.info("Retrieved {} maintenance tasks from maintenance service", tasks.size());

            int created = 0;
            int updated = 0;

            for (MaintenanceTaskResponse task : tasks) {
                logger.debug("Processing task ID: {}, Status: {}, Equipment: {}", task.getId(), task.getStatus(), task.getEquipmentName());
                
                String status = task.getStatus();
                if ("IN_PROGRESS".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
                    Optional<DowntimeEvent> existing = eventRepository.findByEquipmentIdAndMaintenanceTaskId(task.getEquipmentId(), task.getId().toString());
                    
                    if (existing.isEmpty()) {
                        DowntimeEvent event = new DowntimeEvent();
                        event.setEquipmentId(task.getEquipmentId());
                        event.setEquipmentName(task.getEquipmentName());
                        event.setMaintenanceTaskId(task.getId().toString());
                        
                        LocalDateTime startTime = task.getCreatedAt() != null ? task.getCreatedAt() : task.getScheduledDate().atStartOfDay();
                        event.setDowntimeStart(startTime);
                        event.setCause(task.getTitle());
                        event.setRecommendations(task.getDescription());

                        if ("COMPLETED".equalsIgnoreCase(status)) {
                            LocalDateTime endTime = task.getUpdatedAt() != null ? task.getUpdatedAt() : LocalDateTime.now();
                            event.setDowntimeEnd(endTime);
                            event.setDurationHours((double) ChronoUnit.HOURS.between(startTime, endTime));
                            event.setIsOngoing(false);
                        } else {
                            event.setDurationHours((double) ChronoUnit.HOURS.between(startTime, LocalDateTime.now()));
                            event.setIsOngoing(true);
                        }

                        eventRepository.save(event);
                        created++;
                        logger.info("Created downtime event for equipment: {} (Task ID: {}, Status: {}, Ongoing: {})", 
                            task.getEquipmentName(), task.getId(), status, event.getIsOngoing());
                    } else {
                        DowntimeEvent event = existing.get();
                        if ("COMPLETED".equalsIgnoreCase(status) && Boolean.TRUE.equals(event.getIsOngoing())) {
                            LocalDateTime endTime = task.getUpdatedAt() != null ? task.getUpdatedAt() : LocalDateTime.now();
                            event.setDowntimeEnd(endTime);
                            event.setDurationHours((double) ChronoUnit.HOURS.between(event.getDowntimeStart(), endTime));
                            event.setIsOngoing(false);
                            eventRepository.save(event);
                            updated++;
                            logger.info("Updated downtime event to completed for equipment: {} (Task ID: {})", task.getEquipmentName(), task.getId());
                        } else if ("IN_PROGRESS".equalsIgnoreCase(status) && Boolean.TRUE.equals(event.getIsOngoing())) {
                            event.setDurationHours((double) ChronoUnit.HOURS.between(event.getDowntimeStart(), LocalDateTime.now()));
                            eventRepository.save(event);
                            logger.debug("Updated ongoing duration for equipment: {}", task.getEquipmentName());
                        }
                    }
                }
            }
            logger.info("Maintenance data sync completed - Created: {}, Updated: {}", created, updated);
        } catch (Exception e) {
            logger.error("Failed to sync maintenance data - Error: {}", e.getMessage(), e);
            throw new RuntimeException("Maintenance sync failed: " + e.getMessage(), e);
        }
    }

    public Map<String, Long> getEquipmentCountTrend(int days) {
        logger.info("Calculating equipment count trend for last {} days", days);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        Map<String, Long> trend = new LinkedHashMap<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
            
            long count = eventRepository.countByDowntimeStartBetween(dayStart, dayEnd);
            trend.put(date.toString(), count);
        }
        
        return trend;
    }

    public List<DowntimeReportResponse> seedSampleData() {
        logger.info("Seeding database with sample downtime data");
        List<DowntimeEvent> sample = new ArrayList<>();

        DowntimeEvent e1 = new DowntimeEvent();
        e1.setEquipmentName("Press-01");
        e1.setDowntimeStart(LocalDateTime.now().minusHours(5));
        e1.setDowntimeEnd(LocalDateTime.now().minusHours(3));
        e1.setDurationHours(2.0);
        e1.setCause("Routine maintenance");
        e1.setRecommendations("Replace filter");
        e1.setIsOngoing(false);
        sample.add(e1);

        DowntimeEvent e2 = new DowntimeEvent();
        e2.setEquipmentName("Cutter-02");
        e2.setDowntimeStart(LocalDateTime.now().minusHours(2));
        e2.setDowntimeEnd(null);
        e2.setDurationHours(2.0);
        e2.setCause("Unexpected fault");
        e2.setRecommendations("Inspect motor");
        e2.setIsOngoing(true);
        sample.add(e2);

        eventRepository.saveAll(sample);
        logger.info("Saved {} sample downtime events to the database", sample.size());

        return getDowntimeReports();
    }
}