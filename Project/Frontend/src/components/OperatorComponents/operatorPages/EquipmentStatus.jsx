import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import equipmentService from '../../../services/equipmentService';
import performanceMetricsService from '../../../services/performanceMetricsService';
import alertService from '../../../services/alertService';
import './EquipmentStatus.css';
import emptyStateImage from '../../../assets/undraw_investing_uzcu.svg';

const EquipmentStatus = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [message, setMessage] = useState("");
  const [toastNotifications, setToastNotifications] = useState([]);

  const STATUSES = ["All", "Active", "Inactive", "Maintenance"];

  // Fetch equipment list on mount
  useEffect(() => {
    (async () => {
      try {
        setLoadingEquip(true);
        const data = await equipmentService.getAllEquipment();
        setEquipmentList(data);
      } catch (err) {
        console.error(err);
        setMessage("Could not load equipment from backend API.");
      } finally {
        setLoadingEquip(false);
      }
    })();
  }, []);

  // Function to get equipment data from performance metrics
  const getEquipmentDataFromMetrics = async (equipment, timeRange = '24h') => {
    if (!equipment || !equipment.equipmentId) {
      console.error('Invalid equipment object:', equipment);
      return generateEquipmentData(equipment, timeRange);
    }

    try {
      let days;
      switch (timeRange) {
        case '1h':
          days = 1;
          break;
        case '24h':
          days = 1;
          break;
        case '7d':
          days = 7;
          break;
        case 'custom':
          days = 7; // Default for custom
          break;
        default:
          days = 7;
      }

      const metrics = await performanceMetricsService.getRecentMetrics(equipment.equipmentId, days);

      if (metrics.length === 0) {
        // Fallback to generated data if no metrics found
        return generateEquipmentData(equipment, timeRange);
      }

      // Get latest metrics for current values
      const latestMetric = metrics[0]; // Assuming sorted by timestamp desc
      const currentTemp = latestMetric.temperature || 0;
      const currentVib = latestMetric.vibration || 0;
      const currentLoad = latestMetric.loadPercentage || 0;

      // Generate chart data based on time range
      const localChartData = [];
      let dataPoints, timeFormat;

      switch (timeRange) {
        case '1h':
          dataPoints = 6; // Every 10 minutes for 1 hour
          timeFormat = (i) => {
            const minutes = i * 10;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
          };
          break;
        case '24h':
          dataPoints = 6; // Every 4 hours for 24 hours
          timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
          break;
        case '7d':
          dataPoints = 7; // Daily for 7 days
          timeFormat = (i) => `Day ${i + 1}`;
          break;
        case 'custom':
          dataPoints = 6;
          timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
          break;
        default:
          dataPoints = 6;
          timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
      }

      // Sample data points from metrics (simplified - in real app would filter by time)
      for (let i = 0; i < dataPoints; i++) {
        const metricIndex = Math.max(0, metrics.length - dataPoints + i);
        const metric = metrics[metricIndex] || latestMetric;

        localChartData.push({
          time: timeFormat(i),
          temperature: metric.temperature || 0,
          vibration: metric.vibration || 0,
          load: metric.loadPercentage || 0
        });
      }

      return {
        id: equipment.equipmentId,
        equipmentName: equipment.equipmentName || equipment.equipmentDetails?.equipmentName || 'Unknown Equipment',
        temperature: currentTemp,
        vibration: currentVib,
        load: currentLoad,
        chartData: localChartData
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Fallback to generated data
      return generateEquipmentData(equipment, timeRange);
    }
  };

  // Function to validate custom time range
  const validateCustomRange = (range) => {
    if (!range || !range.includes('to')) {
      return 'Please enter a valid range in format: YYYY-MM-DD to YYYY-MM-DD';
    }
    const parts = range.split('to').map(part => part.trim());
    if (parts.length !== 2) {
      return 'Invalid range format';
    }
    const startDate = new Date(parts[0]);
    const endDate = new Date(parts[1]);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid date format';
    }
    if (startDate >= endDate) {
      return 'Start date must be before end date';
    }
    return null;
  };

  // Function to generate sample data for equipment
  const generateEquipmentData = (equipment, timeRange = '24h') => {
    // Generate base values based on equipment properties
    const category = equipment.equipmentDetails?.category || 'Mechanical';
    const status = equipment.equipmentDetails?.equipmentStatus || 'Operational';

    // Base values vary by category
    let baseTemp, baseVib, baseLoad;
    switch (category) {
      case 'Electrical':
        baseTemp = 45 + Math.random() * 20; // 45-65°C
        baseVib = 1.5 + Math.random() * 1.5; // 1.5-3.0 mm/s
        baseLoad = 70 + Math.random() * 20; // 70-90%
        break;
      case 'Instrumentation':
        baseTemp = 25 + Math.random() * 15; // 25-40°C
        baseVib = 0.5 + Math.random() * 1.0; // 0.5-1.5 mm/s
        baseLoad = 60 + Math.random() * 15; // 60-75%
        break;
      case 'Automation':
        baseTemp = 35 + Math.random() * 25; // 35-60°C
        baseVib = 1.0 + Math.random() * 2.0; // 1.0-3.0 mm/s
        baseLoad = 65 + Math.random() * 25; // 65-90%
        break;
      case 'Heating & Cooling':
        baseTemp = 80 + Math.random() * 40; // 80-120°C
        baseVib = 2.0 + Math.random() * 2.0; // 2.0-4.0 mm/s
        baseLoad = 75 + Math.random() * 20; // 75-95%
        break;
      case 'Safety & Utilization':
        baseTemp = 30 + Math.random() * 20; // 30-50°C
        baseVib = 0.8 + Math.random() * 1.2; // 0.8-2.0 mm/s
        baseLoad = 55 + Math.random() * 15; // 55-70%
        break;
      default: // Mechanical
        baseTemp = 55 + Math.random() * 25; // 55-80°C
        baseVib = 2.5 + Math.random() * 2.5; // 2.5-5.0 mm/s
        baseLoad = 80 + Math.random() * 15; // 80-95%
    }

    // Adjust values based on status
    if (status === 'Under Maintenance') {
      baseTemp += 10 + Math.random() * 15; // Higher temp when maintenance needed
      baseVib += 1.0 + Math.random() * 2.0; // Higher vibration
      baseLoad -= 10 + Math.random() * 15; // Lower load
    } else if (status === 'Decommissioned') {
      baseTemp = 25 + Math.random() * 10; // Ambient temp
      baseVib = 0.1 + Math.random() * 0.2; // Very low vibration
      baseLoad = 0; // No load
    }

    // Generate chart data based on time range
    const chartData = [];
    let dataPoints, timeFormat, intervalHours;

    switch (timeRange) {
      case '1h':
        dataPoints = 6; // Every 10 minutes for 1 hour
        intervalHours = 1/6;
        timeFormat = (i) => {
          const minutes = i * 10;
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };
        break;
      case '24h':
        dataPoints = 6; // Every 4 hours for 24 hours
        intervalHours = 4;
        timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
        break;
      case '7d':
        dataPoints = 7; // Daily for 7 days
        intervalHours = 24;
        timeFormat = (i) => `Day ${i + 1}`;
        break;
      case 'custom':
        // For custom range, show 6 data points
        dataPoints = 6;
        intervalHours = 4;
        timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
        break;
      default:
        dataPoints = 6;
        intervalHours = 4;
        timeFormat = (i) => `${String(i * 4).padStart(2, '0')}:00`;
    }

    for (let i = 0; i < dataPoints; i++) {
      // Add some time-based variation and random noise
      const tempVariation = (Math.sin(i * 0.5) * 5) + (Math.random() - 0.5) * 4;
      const vibVariation = (Math.cos(i * 0.3) * 0.3) + (Math.random() - 0.5) * 0.4;
      const loadVariation = (Math.sin(i * 0.7) * 8) + (Math.random() - 0.5) * 6;

      chartData.push({
        time: timeFormat(i),
        temperature: Math.max(20, Math.round((baseTemp + tempVariation) * 10) / 10),
        vibration: Math.max(0.1, Math.round((baseVib + vibVariation) * 10) / 10),
        load: Math.max(0, Math.min(100, Math.round((baseLoad + loadVariation) * 10) / 10))
      });
    }

    return {
      id: equipment.id || equipment.equipmentId,
      equipmentName: equipment.equipmentDetails?.equipmentName || equipment.equipment,
      temperature: Math.round(baseTemp * 10) / 10,
      vibration: Math.round(baseVib * 10) / 10,
      load: Math.round(baseLoad * 10) / 10,
      chartData
    };
  };

  const [timeRange, setTimeRange] = useState('24h');
  const [customRange, setCustomRange] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [timeRangeError, setTimeRangeError] = useState('');
  const [kpiData, setKpiData] = useState({
    temperature: { value: 0, unit: '°C', icon: 'thermometer-half' },
    vibration: { value: 0, unit: 'mm/s', icon: 'graph-up' },
    load: { value: 0, unit: '%', icon: 'cpu' }
  });
  const [chartData, setChartData] = useState([]);
  const [zoomedCharts, setZoomedCharts] = useState({ temperature: false, vibration: false, load: false });

  // Function to check thresholds and create alerts
  const checkAndCreateAlerts = async (equipmentData, originalEquipment) => {
    try {
      const { temperature, vibration, load } = equipmentData;
      const alertsCreated = [];
      
      // Check all thresholds and collect violations
      const violations = [];
      
      const tempLevel = getAlertLevel(temperature, 'temperature');
      if (tempLevel === 'critical' || tempLevel === 'warning') {
        violations.push({
          type: 'temperature',
          level: tempLevel,
          value: temperature,
          threshold: tempLevel === 'critical' ? 90 : 75,
          message: `Temperature ${tempLevel}: ${temperature}°C`
        });
        alertsCreated.push(`Temperature ${tempLevel}`);
      }
      
      const vibLevel = getAlertLevel(vibration, 'vibration');
      if (vibLevel === 'critical' || vibLevel === 'warning') {
        violations.push({
          type: 'vibration',
          level: vibLevel,
          value: vibration,
          threshold: vibLevel === 'critical' ? 4.0 : 2.5,
          message: `Vibration ${vibLevel}: ${vibration} mm/s`
        });
        alertsCreated.push(`Vibration ${vibLevel}`);
      }
      
      const loadLevel = getAlertLevel(load, 'load');
      if (loadLevel === 'critical' || loadLevel === 'warning') {
        violations.push({
          type: 'load',
          level: loadLevel,
          value: load,
          threshold: loadLevel === 'critical' ? 95 : 85,
          message: `Load ${loadLevel}: ${load}%`
        });
        alertsCreated.push(`Load ${loadLevel}`);
      }
      
      // Create single alert with all violations if any exist
      if (violations.length > 0) {
        const highestSeverity = violations.some(v => v.level === 'critical') ? 'critical' : 'warning';
        
        const alertData = {
          id: `alert-${originalEquipment.equipmentId}-${Date.now()}`,
          equipmentId: originalEquipment.equipmentId,
          equipmentName: originalEquipment.equipmentName,
          category: originalEquipment.category || 'Equipment',
          severity: highestSeverity,
          message: violations.map(v => v.message).join(', '),
          metrics: { temperature, vibration, load },
          levels: {
            temperature: getAlertLevel(temperature, 'temperature'),
            vibration: getAlertLevel(vibration, 'vibration'),
            load: getAlertLevel(load, 'load')
          },
          violations: violations,
          status: 'open',
          timestamp: new Date().toISOString()
        };
        
        // Remove any existing alerts for this equipment from localStorage
        const existingAlerts = JSON.parse(localStorage.getItem('activeAlerts') || '[]');
        const filteredAlerts = existingAlerts.filter(alert => alert.equipmentId !== originalEquipment.equipmentId);
        
        // Add new consolidated alert to localStorage
        filteredAlerts.push(alertData);
        localStorage.setItem('activeAlerts', JSON.stringify(filteredAlerts));
        
        // Save to backend
        try {
          await alertService.createAlert(alertData);
          console.log(`✅ Alert saved to backend for ${alertData.equipmentId}`);
        } catch (error) {
          console.log('⚠️ Could not save alert to backend (using localStorage only)');
        }
        
        console.log(`✅ Alert created locally for ${alertData.equipmentId}: ${alertData.message}`);
        
        // Show toast notification
        showToast(alertData);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('alertsUpdated'));
      }
    } catch (error) {
      console.error('Error in checkAndCreateAlerts:', error);
    }
  };

  // Toast notification function
  const showToast = (alertData) => {
    const toast = {
      id: Date.now(),
      severity: alertData.severity,
      equipmentName: alertData.equipmentName,
      message: alertData.message
    };
    
    setToastNotifications(prev => [...prev, toast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(t => t.id !== toast.id));
    }, 5000);
  };

  const handleApplyFilters = useCallback(async () => {
    // Use current state values directly
    const selEquipId = selectedEquipmentId;
    const selTimeRange = timeRange;
    const selCustomRange = customRange;

    // Validate custom time range if selected
    if (selTimeRange === 'custom') {
      const error = validateCustomRange(selCustomRange);
      if (error) {
        setTimeRangeError(error);
        return;
      } else {
        setTimeRangeError('');
      }
    }

    if (selEquipId) {
      // Find the equipment from equipmentList
      const originalEquipment = equipmentList.find(eq => eq.equipmentId === selEquipId);

      if (originalEquipment) {
        // Get equipment data from metrics with current time range
        const updatedEquipment = await getEquipmentDataFromMetrics(originalEquipment, selTimeRange);

        // Update selected equipment with new data
        setSelectedEquipment(updatedEquipment);

        // Update KPI data based on selected equipment
        setKpiData({
          temperature: { value: updatedEquipment.temperature, unit: '°C', icon: 'thermometer-half' },
          vibration: { value: updatedEquipment.vibration, unit: 'mm/s', icon: 'graph-up' },
          load: { value: updatedEquipment.load, unit: '%', icon: 'cpu' }
        });

        // Update chart data based on selected equipment
        setChartData(updatedEquipment.chartData);

        // Check thresholds and create alerts if needed
        await checkAndCreateAlerts(updatedEquipment, originalEquipment);

        console.log('Applied filters for equipment:', updatedEquipment.equipmentName || updatedEquipment.id, 'with time range:', selTimeRange);
      }
    } else {
      console.log('No equipment selected');
    }
  }, [equipmentList, selectedEquipmentId, timeRange, customRange]);

  const handleZoom = (chartType) => {
    setZoomedCharts(prev => ({ ...prev, [chartType]: !prev[chartType] }));
  };

  const handleRefresh = (chartType) => {
    console.log('Refreshing', chartType);
  };

  const handleDownload = (chartType) => {
    console.log('Downloading', chartType);
  };

  // Helper function to check if all values for a metric are zero
  const isChartHidden = (dataKey) => {
    return chartData.every(dataPoint => dataPoint[dataKey] === 0);
  };

  // Helper function to determine alert level for KPI values
  const getAlertLevel = (value, type) => {
    if (value === 0) return 'hidden';

    switch (type) {
      case 'temperature':
        if (value >= 90) return 'critical';
        if (value >= 75) return 'warning';
        return 'normal';
      case 'vibration':
        if (value >= 4.0) return 'critical';
        if (value >= 2.5) return 'warning';
        return 'normal';
      case 'load':
        if (value >= 95) return 'critical';
        if (value >= 85) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="equipment-status">
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toastNotifications.map(toast => (
          <div
            key={toast.id}
            style={{
              backgroundColor: toast.severity === 'critical' ? '#dc3545' : '#ffc107',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '300px',
              maxWidth: '400px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className={`bi bi-${toast.severity === 'critical' ? 'exclamation-triangle-fill' : 'exclamation-circle-fill'}`} style={{ fontSize: '20px' }}></i>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{toast.equipmentName}</div>
                <div style={{ fontSize: '14px' }}>{toast.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="header-section">
        <h2 className="header-title">Equipment Status Dashboard</h2>
      </div>
      <div className="filters-section">
        <div className="horizontal-filters">
          <div className="filter-group">
            <label>Time Range:</label>
            <select value={timeRange} onChange={(e) => {
              setTimeRange(e.target.value);
            }}>
              <option value="1h">Last 1h</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="custom">Custom</option>
            </select>
            {timeRange === 'custom' && (
              <div>
                <input
                  type="text"
                  placeholder="e.g., 2023-12-01 to 2023-12-11"
                  value={customRange}
                  onChange={(e) => {
                    setCustomRange(e.target.value);
                    if (timeRangeError) setTimeRangeError('');
                  }}
                />
                {timeRangeError && <p style={{ color: 'red', fontSize: '12px' }}>{timeRangeError}</p>}
              </div>
            )}
          </div>
          <div className="filter-group">
            <label>Select Equipment:</label>
            {loadingEquip ? (
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm" role="status" />
                <span>Loading equipment…</span>
              </div>
            ) : (
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
              >
                <option value="">Select Equipment</option>
                {equipmentList.map((item) => (
                  <option key={item.equipmentId} value={item.equipmentId}>
                    {item.equipmentName ?? "(Unnamed)"} — {item.equipmentId}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button className="apply-btn" onClick={() => handleApplyFilters()} disabled={!selectedEquipmentId}>Apply</button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Show empty state image when no equipment selected */}
        {!selectedEquipment || chartData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={emptyStateImage} 
              alt="Select Equipment" 
              style={{ maxWidth: '350px', width: '100%', marginBottom: '30px', opacity: 0.8 }}
            />
            <h3 style={{ color: '#2d3436', marginBottom: '10px' }}>No Equipment Selected</h3>
            <p style={{ color: '#636e72', fontSize: '16px' }}>Select an equipment and click Apply to view real-time status and metrics</p>
          </div>
        ) : (
          <>
        {/* KPI Cards and Charts */}
        <div className="left-panel">
          {/* KPI Cards */}
          <div className="kpi-cards">
            {getAlertLevel(kpiData.temperature.value, 'temperature') !== 'hidden' && (
              <div className={`kpi-card temperature ${getAlertLevel(kpiData.temperature.value, 'temperature')}`}>
                <div className="kpi-icon">
                  <i className={`bi bi-${kpiData.temperature.icon}`}></i>
                </div>
                <div className="kpi-content">
                  <h3>{kpiData.temperature.value}{kpiData.temperature.unit}</h3>
                  <p>Temperature</p>
                </div>
              </div>
            )}
            {getAlertLevel(kpiData.vibration.value, 'vibration') !== 'hidden' && (
              <div className={`kpi-card vibration ${getAlertLevel(kpiData.vibration.value, 'vibration')}`}>
                <div className="kpi-icon">
                  <i className={`bi bi-${kpiData.vibration.icon}`}></i>
                </div>
                <div className="kpi-content">
                  <h3>{kpiData.vibration.value}{kpiData.vibration.unit}</h3>
                  <p>Vibration</p>
                </div>
              </div>
            )}
            {getAlertLevel(kpiData.load.value, 'load') !== 'hidden' && (
              <div className={`kpi-card load ${getAlertLevel(kpiData.load.value, 'load')}`}>
                <div className="kpi-icon">
                  <i className={`bi bi-${kpiData.load.icon}`}></i>
                </div>
                <div className="kpi-content">
                  <h3>{kpiData.load.value}{kpiData.load.unit}</h3>
                  <p>Load</p>
                </div>
              </div>
            )}
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Temperature Chart */}
            {!isChartHidden('temperature') && (
              <div className="chart-container">
                <div className="chart-header">
                  <h4>Temperature Trend</h4>
                  <div className="chart-actions">
                    <button className="chart-action-btn" onClick={() => handleZoom('temperature')}><i className="bi bi-zoom-in"></i></button>
                    <button className="chart-action-btn" onClick={() => handleRefresh('temperature')}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="chart-action-btn" onClick={() => handleDownload('temperature')}><i className="bi bi-download"></i></button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={zoomedCharts.temperature ? 400 : 200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffa726" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="temperature" stroke="#ff6b6b" fillOpacity={1} fill="url(#temperatureGradient)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Vibration Chart */}
            {!isChartHidden('vibration') && (
              <div className="chart-container">
                <div className="chart-header">
                  <h4>Vibration Trend</h4>
                  <div className="chart-actions">
                    <button className="chart-action-btn" onClick={() => handleZoom('vibration')}><i className="bi bi-zoom-in"></i></button>
                    <button className="chart-action-btn" onClick={() => handleRefresh('vibration')}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="chart-action-btn" onClick={() => handleDownload('vibration')}><i className="bi bi-download"></i></button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#45b7d1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="vibration" stroke="#4ecdc4" fillOpacity={1} fill="url(#vibrationGradient)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Load Chart */}
            {!isChartHidden('load') && (
              <div className="chart-container">
                <div className="chart-header">
                  <h4>Load Trend</h4>
                  <div className="chart-actions">
                    <button className="chart-action-btn" onClick={() => handleZoom('load')}><i className="bi bi-zoom-in"></i></button>
                    <button className="chart-action-btn" onClick={() => handleRefresh('load')}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="chart-action-btn" onClick={() => handleDownload('load')}><i className="bi bi-download"></i></button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={zoomedCharts.load ? 400 : 200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#51cf66" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#40c057" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="load" stroke="#51cf66" fillOpacity={1} fill="url(#loadGradient)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

export default EquipmentStatus;
