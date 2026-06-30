package com.equiptrack.downtime_trend.dto;

import java.util.Map;

public class DowntimeMetricsResponse {
    private Map<String, Double> equipmentDowntime;
    private Map<String, Integer> downtimeCauses;
    private Double totalDowntimeHours;
    private Integer totalIncidents;
    private String mostAffectedEquipment;
    private String topRootCause;
    private Map<String, Long> dailyTrend;
    private Long currentInMaintenance;

    public Map<String, Double> getEquipmentDowntime() { return equipmentDowntime; }
    public void setEquipmentDowntime(Map<String, Double> equipmentDowntime) { this.equipmentDowntime = equipmentDowntime; }
    public Map<String, Integer> getDowntimeCauses() { return downtimeCauses; }
    public void setDowntimeCauses(Map<String, Integer> downtimeCauses) { this.downtimeCauses = downtimeCauses; }
    public Double getTotalDowntimeHours() { return totalDowntimeHours; }
    public void setTotalDowntimeHours(Double totalDowntimeHours) { this.totalDowntimeHours = totalDowntimeHours; }
    public Integer getTotalIncidents() { return totalIncidents; }
    public void setTotalIncidents(Integer totalIncidents) { this.totalIncidents = totalIncidents; }
    public String getMostAffectedEquipment() { return mostAffectedEquipment; }
    public void setMostAffectedEquipment(String mostAffectedEquipment) { this.mostAffectedEquipment = mostAffectedEquipment; }
    public String getTopRootCause() { return topRootCause; }
    public void setTopRootCause(String topRootCause) { this.topRootCause = topRootCause; }
    public Map<String, Long> getDailyTrend() { return dailyTrend; }
    public void setDailyTrend(Map<String, Long> dailyTrend) { this.dailyTrend = dailyTrend; }
    public Long getCurrentInMaintenance() { return currentInMaintenance; }
    public void setCurrentInMaintenance(Long currentInMaintenance) { this.currentInMaintenance = currentInMaintenance; }
}
