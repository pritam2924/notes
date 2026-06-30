package com.equiptrack.downtime_trend.repository;

import com.equiptrack.downtime_trend.entity.SubmittedReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmittedReportRepository extends JpaRepository<SubmittedReport, String> {
    List<SubmittedReport> findAllByOrderBySubmittedAtDesc();
    List<SubmittedReport> findByTypeOrderBySubmittedAtDesc(String type);
}