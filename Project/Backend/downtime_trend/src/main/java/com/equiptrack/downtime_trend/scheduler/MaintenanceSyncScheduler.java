package com.equiptrack.downtime_trend.scheduler;

import com.equiptrack.downtime_trend.service.DowntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceSyncScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceSyncScheduler.class);
    private final DowntimeService downtimeService;

    public MaintenanceSyncScheduler(DowntimeService downtimeService) {
        this.downtimeService = downtimeService;
    }

    @Scheduled(fixedRate = 300000)
    public void syncMaintenanceData() {
        logger.info("Scheduled maintenance data sync started");
        downtimeService.syncMaintenanceData();
        logger.info("Scheduled maintenance data sync completed");
    }
}
