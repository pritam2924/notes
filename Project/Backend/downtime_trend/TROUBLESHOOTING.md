# Downtime Trend - Troubleshooting Guide

## Issue: No Data Displayed After Creating Maintenance Tasks

### Step-by-Step Debugging:

## 1️⃣ **Check if Downtime Service is Running**
```
GET http://localhost:8082/api/downtime/health
```
**Expected Response:**
```json
{
  "status": "UP",
  "service": "downtime-trend",
  "schedulerEnabled": true,
  "syncInterval": "5 minutes",
  "lastSyncStatus": "SUCCESS"
}
```

**If lastSyncStatus shows FAILED:**
- Check the error message
- Verify maintenance service is running on port 8083
- Check Eureka server is running

---

## 2️⃣ **Verify Maintenance Service is Accessible**
```
GET http://localhost:8083/api/maintenance-tasks
```
**Should return:** List of all maintenance tasks including your created task

---

## 3️⃣ **Check Maintenance Task Status**
Verify your task has the correct status:
- Status must be **IN_PROGRESS** or **COMPLETED** (case-insensitive)
- Status values: PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

**Example Task:**
```json
{
  "id": 1,
  "equipmentId": "EQ001",
  "equipmentName": "Equipment-1",
  "status": "IN_PROGRESS",  ← Must be this or COMPLETED
  "scheduledDate": "2024-01-15",
  "title": "Routine Maintenance"
}
```

---

## 4️⃣ **Manually Trigger Sync**
```
POST http://localhost:8082/api/downtime/sync
```
**Expected Response:** "Maintenance data synced successfully"

**Check logs for:**
- "Retrieved X maintenance tasks from maintenance service"
- "Created downtime event for equipment: [name]"
- "Updated downtime event to completed for equipment: [name]"

---

## 5️⃣ **Check Downtime Events Created**
```
GET http://localhost:8082/api/downtime/reports
```
**Should return:** List of downtime events

---

## 6️⃣ **Get Metrics**
```
GET http://localhost:8082/api/downtime/metrics
```
**Should return:** Aggregated metrics with trend data

---

## Common Issues & Solutions:

### ❌ Issue: "lastSyncStatus": "FAILED: Connection refused"
**Solution:** 
- Start maintenance service: `cd maintainence && mvn spring-boot:run`
- Verify port 8083 is not blocked

### ❌ Issue: Tasks retrieved but no downtime events created
**Solution:**
- Check task status is IN_PROGRESS or COMPLETED
- Verify equipmentId and equipmentName are not null
- Check database connection

### ❌ Issue: Scheduler not running
**Solution:**
- Verify `@EnableScheduling` is present in DowntimeTrendApplication.java
- Restart the downtime service

### ❌ Issue: Feign client error
**Solution:**
- Check Eureka server is running on port 8761
- Verify maintenance-service is registered in Eureka
- Check application.properties has correct config server URL

---

## Database Check:

**Connect to MySQL and run:**
```sql
-- Check if downtime_events table exists
SHOW TABLES LIKE 'downtime_events';

-- Check downtime events
SELECT * FROM downtime_events;

-- Check by equipment
SELECT equipment_name, is_ongoing, duration_hours, cause 
FROM downtime_events 
ORDER BY downtime_start DESC;
```

---

## Log Locations:

Check logs for errors:
- Downtime Service: Console output or application logs
- Look for: "Failed to sync maintenance data"
- Look for: "Retrieved X maintenance tasks"

---

## Quick Test Sequence:

1. Create maintenance task with status PENDING
2. Update status to IN_PROGRESS
3. Wait 5 minutes OR call POST /api/downtime/sync
4. Check GET /api/downtime/reports
5. Update status to COMPLETED
6. Wait 5 minutes OR call POST /api/downtime/sync
7. Check GET /api/downtime/metrics

---

## Expected Behavior:

**When task is IN_PROGRESS:**
- Downtime event created with isOngoing=true
- Duration calculated from scheduledDate to now

**When task is COMPLETED:**
- Existing downtime event updated with isOngoing=false
- Duration calculated from scheduledDate to updatedAt

**PENDING/SCHEDULED tasks are IGNORED** - they don't create downtime events until IN_PROGRESS.
