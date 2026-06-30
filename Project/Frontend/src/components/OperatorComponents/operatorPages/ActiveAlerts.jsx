import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal, Button, Card, Row, Col, Form, Alert } from "react-bootstrap";
import equipmentService from '../../../services/equipmentService';
import alertService from '../../../services/alertService';
import { formatDate, safeNumber } from '../../../utils/errorHandler';
import './EquipmentStatus.css';

function ActiveAlerts() {
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [timeRangeFilter, setTimeRangeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("ALL");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [alertNotes, setAlertNotes] = useState({});
  const [expandedNotesAlerts, setExpandedNotesAlerts] = useState(new Set());
  const modalRef = useRef(null);
  const [alerts, setAlerts] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [message, setMessage] = useState("");
  const [locallyAcknowledged, setLocallyAcknowledged] = useState(new Set());
  const [resolvedAlerts, setResolvedAlerts] = useState(new Set());

  // 1) Load equipment list
  useEffect(() => {
    (async () => {
      try {
        setLoadingEquip(true);
        const data = await equipmentService.getAllEquipment();
        setEquipmentList(Array.isArray(data) ? data : []);
        setMessage("");
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Could not load equipment from backend.");
        setEquipmentList([]);
      } finally {
        setLoadingEquip(false);
      }
    })();
  }, []);

  // 2) Load alerts from backend API and localStorage
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        
        // Load from localStorage directly (since backend API is not working)
        const localAlerts = JSON.parse(localStorage.getItem('activeAlerts') || '[]');
        console.log('Loaded alerts from localStorage:', localAlerts);
        setAlerts(localAlerts);
        setMessage("");
        setLoading(false);
      } catch (err) {
        console.error('Error loading alerts:', err);
        setAlerts([]);
        setMessage("");
        setLoading(false);
      }
    };

    fetchAlerts();
    
    // Listen for storage changes (when alerts are created in other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'activeAlerts' || e.key === null) {
        console.log('Storage changed, reloading alerts');
        fetchAlerts();
      }
    };
    
    // Listen for custom event when alerts are created in same tab
    const handleAlertsUpdate = () => {
      console.log('Alerts updated event received, reloading alerts');
      fetchAlerts();
    };
    
    // Listen for alert resolved event
    const handleAlertResolved = (e) => {
      console.log('Alert resolved event received:', e.detail);
      fetchAlerts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('alertsUpdated', handleAlertsUpdate);
    window.addEventListener('alertResolved', handleAlertResolved);
    
    const interval = setInterval(fetchAlerts, 5000); // Check every 5 seconds
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alertsUpdated', handleAlertsUpdate);
      window.removeEventListener('alertResolved', handleAlertResolved);
    };
  }, []);



  // Filtered alerts based on filters (ACTIVE  are active alerts)
  const filteredAlerts = useMemo(() => {
    const filtered = alerts.filter((alert) => {
      // Filter by severity
      if (severityFilter !== "ALL" && alert.severity?.toLowerCase() !== severityFilter.toLowerCase()) {
        return false;
      }
      // Filter by equipment
      if (equipmentFilter !== "ALL" && alert.equipmentId !== equipmentFilter) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !alert.equipmentId.toLowerCase().includes(query) &&
          !alert.equipmentName.toLowerCase().includes(query) &&
          !alert.category.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      // Filter by time range
      if (timeRangeFilter !== "ALL") {
        const now = new Date();
        let timeLimit;
        if (timeRangeFilter === "5min") {
          timeLimit = new Date(now.getTime() - 5 * 60 * 1000);
        } else if (timeRangeFilter === "1hour") {
          timeLimit = new Date(now.getTime() - 60 * 60 * 1000);
        }
        const alertTime = new Date(alert.timestamp);
        if (alertTime < timeLimit) {
          return false;
        }
      }
      // Active alerts are those with status open or acknowledged, and not resolved
      return (alert.status === "open" || alert.status === "acknowledged") && !resolvedAlerts.has(alert.id);
    });
    
    console.log('Total alerts:', alerts.length);
    console.log('Filtered alerts:', filtered.length);
    console.log('Filters:', { severityFilter, equipmentFilter, searchQuery, timeRangeFilter });
    
    return filtered;
  }, [alerts, severityFilter, equipmentFilter, searchQuery, timeRangeFilter, resolvedAlerts]);



  const handleAcknowledge = async (alertId) => {
    setLocallyAcknowledged(prev => new Set([...prev, alertId]));
    
    // Update alert status in localStorage
    const activeAlerts = JSON.parse(localStorage.getItem('activeAlerts') || '[]');
    const alert = activeAlerts.find(a => a.id === alertId);
    
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedAt = new Date().toISOString();
      
      // Update active alerts
      localStorage.setItem('activeAlerts', JSON.stringify(activeAlerts));
      
      // Also store in acknowledged alerts for admin view
      const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
      acknowledgedAlerts.push(alert);
      localStorage.setItem('acknowledgedAlerts', JSON.stringify(acknowledgedAlerts));
      
      // Update in backend
      try {
        await alertService.updateAlertStatus(alertId, "acknowledged");
        console.log('✅ Alert acknowledged in backend:', alertId);
      } catch (err) {
        console.log('⚠️ Could not update alert in backend (using localStorage only)');
      }
      
      // Trigger update event
      window.dispatchEvent(new Event('alertsUpdated'));
    }
  };

  const handleResolve = async (alertId) => {
    setResolvedAlerts(prev => new Set([...prev, alertId]));
    
    // Remove from both localStorage locations
    const localAlerts = JSON.parse(localStorage.getItem('activeAlerts') || '[]');
    const updatedAlerts = localAlerts.filter(alert => alert.id !== alertId);
    localStorage.setItem('activeAlerts', JSON.stringify(updatedAlerts));
    
    const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
    const updatedAcknowledged = acknowledgedAlerts.filter(alert => alert.id !== alertId);
    localStorage.setItem('acknowledgedAlerts', JSON.stringify(updatedAcknowledged));
    
    // Also update state
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // Delete from backend
    try {
      await alertService.deleteAlert(alertId);
      console.log('✅ Alert deleted from backend:', alertId);
    } catch (err) {
      console.log('⚠️ Could not delete alert from backend (using localStorage only)');
    }
    
    // Dispatch events to notify all components
    window.dispatchEvent(new CustomEvent('alertResolved', { detail: { ids: [alertId] } }));
    window.dispatchEvent(new Event('alertsUpdated'));
  };

  const handleAddNote = (alertId) => {
    setSelectedAlertId(alertId);
    // Set initial note text from existing notes or empty
    setNoteText(alertNotes[alertId] || "");
    setShowNoteModal(true);
  };

  const handleToggleNotes = (alertId) => {
    setExpandedNotesAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const handleSaveNote = () => {
    if (selectedAlertId && noteText.trim()) {
      // Save the note for this alert
      setAlertNotes(prev => ({
        ...prev,
        [selectedAlertId]: noteText
      }));
      console.log('Note saved for alert', selectedAlertId, ':', noteText);
    }
    // Close modal and reset
    setNoteText("");
    setShowNoteModal(false);
    setSelectedAlertId(null);
  };

  const handleCloseNoteModal = () => {
    // Discard changes - don't save
    setNoteText("");
    setShowNoteModal(false);
    setSelectedAlertId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowNoteModal(false);
    }
  };

  const getSeverityClass = (severity, status) => {
    if (status === "CLOSED") return "resolved";
    switch (severity?.toLowerCase()) {
      case "critical":
        return "critical";
      case "warning":
        return "warning";
      case "normal":
        return "normal";
      default:
        return "";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "🚨";
      case "warning":
        return "⚠️";
      case "normal":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="equipment-status">
      <h2 className="text-center fs-1 fw-bold text-dark mb-3" >Active Alerts</h2>

      {/* Filters Panel */}
      <div className="filters-section">
        <div className="horizontal-filters">
          <div className="filter-group">
            <label>Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Equipment:</label>
            {loadingEquip ? (
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm" role="status" />
                <span>Loading equipment…</span>
              </div>
            ) : (
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                {equipmentList.map((eq) => (
                  <option key={eq.equipmentId} value={eq.equipmentId}>
                    {eq.equipmentName ?? "(Unnamed)"} — {eq.equipmentId}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="filter-group">
            <label>Time Range:</label>
            <select
              value={timeRangeFilter}
              onChange={(e) => setTimeRangeFilter(e.target.value)}
            >
              <option value="ALL">All Time</option>
              <option value="5min">Last 5 min</option>
              <option value="1hour">Last hour</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {message && (
        <Alert variant="danger" className="mb-3">
          {message}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading alerts...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Alerts List */}
          <div className="alerts-list">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No active alerts found.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`alert-card mb-3 ${getSeverityClass(alert.severity, alert.status)}`}>
                  <Card.Body style={{ padding: 0 }}>
                    {/* Header Section - Machine ID and Last Update */}
                    <div className="alert-header">
                      <div>
                        <div className="alert-title">Machine ID: {alert.equipmentId}</div>
                      </div>
                      <div>
                        <div className="alert-timestamp">Last Update: {formatDate(alert.timestamp)}</div>
                      </div>
                    </div>

                    {/* Metrics Grid - 3 columns */}
                    {alert.metrics && Object.keys(alert.metrics).length > 0 && (
                      <div className="alert-metrics">
                        {alert.metrics.temperature !== null && (
                          <div className="alert-metric">
                            <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TEMP</div>
                            <div><strong>{alert.metrics.temperature?.toFixed(1) || '—'}°C</strong></div>
                            <div style={{ fontSize: '10px', marginTop: '3px', color: '#636e72' }}>
                              {alert.levels?.temperature ? alert.levels.temperature.charAt(0).toUpperCase() + alert.levels.temperature.slice(1) : 'Normal'}
                            </div>
                          </div>
                        )}
                        {alert.metrics.load !== null && (
                          <div className="alert-metric">
                            <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LOAD</div>
                            <div><strong>{alert.metrics.load?.toFixed(0) || '—'}%</strong></div>
                            <div style={{ fontSize: '10px', marginTop: '3px', color: '#636e72' }}>
                              {alert.levels?.load ? alert.levels.load.charAt(0).toUpperCase() + alert.levels.load.slice(1) : 'Normal'}
                            </div>
                          </div>
                        )}
                        {alert.metrics.vibration !== null && (
                          <div className="alert-metric">
                            <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#2d3436', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VIBRATION</div>
                            <div><strong>{alert.metrics.vibration?.toFixed(1) || '—'} mm/s</strong></div>
                            <div style={{ fontSize: '10px', marginTop: '3px', color: '#636e72' }}>
                              {alert.levels?.vibration ? alert.levels.vibration.charAt(0).toUpperCase() + alert.levels.vibration.slice(1) : 'Normal'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes Display - if exists */}
                    {(alert.notes || alertNotes[alert.id]) && (
                      <div className="alert-notes-display">
                        <h6 style={{ marginBottom: '6px' }}>📝 Notes</h6>
                        <div style={{ fontSize: '11px', color: '#495057', lineHeight: '1.4' }}>
                          {alert.notes || alertNotes[alert.id]}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="alert-actions">
                      {!locallyAcknowledged.has(alert.id) && alert.status === 'open' && (
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="alert-btn"
                          onClick={() => handleAcknowledge(alert.id)}
                          style={{ marginRight: '4px' }}
                        >
                          Acknowledge
                        </Button>
                      )}
                      
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="alert-btn success"
                        onClick={() => handleResolve(alert.id)}
                        style={{ marginRight: '4px' }}
                      >
                        Resolve
                      </Button>
                      
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="alert-btn note"
                        onClick={() => handleAddNote(alert.id)}
                      >
                        Notes
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* Note Modal */}
      <Modal 
        show={showNoteModal} 
        onHide={handleCloseNoteModal}
        onKeyDown={handleKeyDown}
        ref={modalRef}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Note to Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Note Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNoteModal}>
            Discard
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            Save Note
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ActiveAlerts;