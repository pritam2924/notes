# Downtime Trend Microservice - Implementation Guide

## Overview
The downtime_trend microservice tracks equipment maintenance downtime by automatically syncing with the maintenance service and providing trend analysis for graph construction.

## Key Features Implemented

### 1. Automatic Maintenance Data Synchronization
- **Scheduled Sync**: Runs every 5 minutes to fetch maintenance tasks
- **Status Tracking**: Monitors IN_PROGRESS and COMPLETED maintenance tasks
- **Duration Calculation**: Automatically calculates downtime hours from scheduled date to completion
- **Ongoing Detection**: Tracks equipment currently under maintenance

### 2. Equipment Count Tracking
- Tracks number of equipment going into maintenance over time
- Provides daily trend data for specified time periods
- Counts equipment in maintenance by date ranges

### 3. Graph Construction Data
- **Daily Trend**: Equipment count per day for time-series graphs
- **Equipment Downtime**: Total hours per equipment for bar charts
- **Downtime Causes**: Frequency distribution for pie charts
- **Current Status**: Real-time count of equipment in maintenance

### 4. Metrics & Analytics
- Total downtime hours across all equipment
- Total maintenance incidents
- Most affected equipment identification
- Top root cause analysis
- Equipment-wise downtime breakdown
- Cause-wise incident distribution

## API Endpoints

### Core Endpoints
- `GET /api/downtime/metrics` - Get all metrics with trend data
- `GET /api/downtime/reports` - Get detailed downtime reports
- `GET /api/downtime/trend/{days}` - Get equipment count trend for N days
- `POST /api/downtime/sync` - Manually trigger maintenance data sync

### Export Endpoints
- `GET /api/downtime/export/csv` - Export reports as CSV
- `GET /api/downtime/export/json` - Export reports as JSON

### Integration Endpoints
- `GET /api/downtime/maintenance-tasks/equipment/{equipmentId}` - Get maintenance tasks
- `GET /api/downtime/equipment/{equipmentId}` - Get equipment details

## Data Flow

1. **Maintenance Task Created** → Status: PENDING
2. **Task Started** → Status: IN_PROGRESS → Downtime Event Created (ongoing=true)
3. **Task Completed** → Status: COMPLETED → Downtime Event Updated (ongoing=false, duration calculated)

## Database Schema

### downtime_events Table
- `id` - Unique identifier
- `equipment_id` - Reference to equipment
- `equipment_name` - Equipment name
- `maintenance_task_id` - Reference to maintenance task
- `downtime_start` - When maintenance started
- `downtime_end` - When maintenance completed
- `duration_hours` - Total downtime duration
- `cause` - Maintenance reason/title
- `recommendations` - Maintenance description
- `is_ongoing` - Current maintenance status
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

## Response Structure

### DowntimeMetricsResponse
```json
{
  "equipmentDowntime": {"Equipment-1": 24.5, "Equipment-2": 12.0},
  "downtimeCauses": {"Routine Maintenance": 5, "Emergency Repair": 3},
  "totalDowntimeHours": 36.5,
  "totalIncidents": 8,
  "mostAffectedEquipment": "Equipment-1",
  "topRootCause": "Routine Maintenance",
  "dailyTrend": {"2024-01-01": 2, "2024-01-02": 3},
  "currentInMaintenance": 2
}
```

## Configuration

### Scheduler Settings
- Sync Frequency: 300000ms (5 minutes)
- Can be adjusted in `MaintenanceSyncScheduler.java`

### Feign Clients
- `maintenance-service` - Fetches maintenance task data
- `equipment-service` - Fetches equipment details

## Usage Examples

### Get Metrics for Dashboard
```
GET /api/downtime/metrics
```
Returns complete metrics including trend data for graphs.

### Get 30-Day Trend
```
GET /api/downtime/trend/30
```
Returns daily equipment count for last 30 days.

### Manual Sync
```
POST /api/downtime/sync
```
Triggers immediate synchronization with maintenance service.

## Graph Construction

### Time-Series Graph (Equipment Count Over Time)
Use `dailyTrend` from metrics or `/trend/{days}` endpoint:
- X-axis: Dates
- Y-axis: Number of equipment in maintenance

### Bar Chart (Equipment Downtime)
Use `equipmentDowntime` from metrics:
- X-axis: Equipment names
- Y-axis: Total downtime hours

### Pie Chart (Downtime Causes)
Use `downtimeCauses` from metrics:
- Segments: Cause names
- Values: Incident counts

## Notes

- Downtime events are automatically created when maintenance tasks are IN_PROGRESS or COMPLETED
- Duration is calculated from scheduled date to completion/current time
- Scheduler ensures data stays synchronized every 5 minutes
- Manual sync available for immediate updates
