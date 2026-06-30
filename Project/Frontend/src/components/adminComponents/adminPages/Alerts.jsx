import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import alertService from "../../../services/alertService";
import equipmentService from "../../../services/equipmentService";
import "./Alerts.css";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [equipmentList, setEquipmentList] = useState([]);
  const [locallyResolved, setLocallyResolved] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const navigate = useNavigate();

  async function loadAlerts(setLoadingFlag = true) {
    try {
      if (setLoadingFlag) setLoading(true);
      
      // Load acknowledged alerts from localStorage
      const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
      console.log('Loaded acknowledged alerts from localStorage:', acknowledgedAlerts);
      
      // Try to fetch from backend API as well
      try {
        const data = await alertService.getAcknowledgedAlerts();
        // Merge with localStorage alerts
        const allAlerts = [...acknowledgedAlerts, ...data];
        
        // Remove duplicates based on ID
        const uniqueData = allAlerts.filter(
          (alert, index, arr) =>
            arr.findIndex((a) => a.id === alert.id) === index,
        );
        
        setAlerts(uniqueData);
      } catch (apiError) {
        // If API fails, use only localStorage
        console.log('API failed, using only localStorage alerts');
        setAlerts(acknowledgedAlerts);
      }
    } catch (err) {
      console.error(err);
      setMessage(`Could not load alerts: ${err.message}`);
    } finally {
      if (setLoadingFlag) setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts(true);
    
    // Listen for alerts updates
    const handleAlertsUpdate = () => {
      console.log('Alerts updated, reloading...');
      loadAlerts(false);
    };
    
    // Listen for alert resolved event
    const handleAlertResolved = (e) => {
      console.log('Alert resolved event received:', e.detail);
      loadAlerts(false);
    };
    
    window.addEventListener('alertsUpdated', handleAlertsUpdate);
    window.addEventListener('alertResolved', handleAlertResolved);
    const timer = setInterval(() => loadAlerts(false), 10_000);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('alertsUpdated', handleAlertsUpdate);
      window.removeEventListener('alertResolved', handleAlertResolved);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await equipmentService.getAllEquipment();
        setEquipmentList(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Update one or more underlying alerts. If `ids` is an array, update all.
  async function updateAlert(ids, patch) {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    setLocallyResolved((prev) => new Set([...prev, ...idsArray]));
    
    // Remove from both localStorage locations
    const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
    const updatedAcknowledged = acknowledgedAlerts.filter(alert => !idsArray.includes(alert.id));
    localStorage.setItem('acknowledgedAlerts', JSON.stringify(updatedAcknowledged));
    
    const activeAlerts = JSON.parse(localStorage.getItem('activeAlerts') || '[]');
    const updatedActive = activeAlerts.filter(alert => !idsArray.includes(alert.id));
    localStorage.setItem('activeAlerts', JSON.stringify(updatedActive));
    
    // Delete from backend (resolve = delete)
    try {
      await Promise.all(
        idsArray.map((id) => alertService.deleteAlert(id)),
      );
      console.log('✅ Alerts deleted from backend:', idsArray);
    } catch (err) {
      console.log('⚠️ Could not delete alerts from backend (using localStorage only)');
    }
    
    // Dispatch event to notify all components
    window.dispatchEvent(new CustomEvent('alertResolved', { detail: { ids: idsArray } }));
    window.dispatchEvent(new Event('alertsUpdated'));
    
    await loadAlerts();
  }

  // Acknowledge all underlying alerts for this equipment then navigate to scheduling.
  async function acknowledgeAndGoToSchedule(group) {
    // Try backend API (will fail silently if not available)
    try {
      await Promise.all(
        (group.alertIds || [group.id]).map((id) =>
          alertService.updateAlertStatus(id, "acknowledged"),
        ),
      );
    } catch (err) {
      console.log('Backend API not available, using localStorage only');
    }
    
    await loadAlerts();

    navigate("/admin/maintenance", {
      state: {
        autoOpenScheduleModal: true,
        equipmentId: group.equipmentId,
        alertId:
          group.alertIds && group.alertIds.length > 0
            ? group.alertIds[0]
            : group.id,
        alert: group,
      },
    });
  }

  function badgeClassForSeverity(s) {
    return s === "critical"
      ? "badge badge-fixed text-danger bg-danger-subtle"
      : s === "warning"
        ? "badge badge-fixed text-warning bg-warning-subtle"
        : "badge badge-fixed text-success bg-success-subtle";
  }

  function toggleRowExpansion(alertId) {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  }

  const visibleAlerts = useMemo(() => {
    const filtered = alerts.filter((a) => {
      const severityOk =
        filterSeverity === "all" ? true : a.severity === filterSeverity;
      const equipmentOk =
        selectedEquipment === "all" ? true : a.equipmentId === selectedEquipment;
      const statusOk = a.status !== "resolved";
      const notLocallyResolved = !locallyResolved.has(a.id);
      return severityOk && equipmentOk && statusOk && notLocallyResolved;
    });

    const uniqueAlerts = filtered.filter(
      (alert, index, arr) => arr.findIndex((a) => a.id === alert.id) === index,
    );

    // Sort by timestamp (newest first)
    return uniqueAlerts.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  }, [alerts, filterSeverity, locallyResolved]);

  return (
    <div className="container my-4">
      {message && <div className="alert alert-danger">{message}</div>}
      <h1 className="text-center fs-1 fw-bold text-dark mb-3">Alerts</h1>
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          
          <div className="d-flex align-items-center gap-2">
            <div
              className="btn-group"
              role="group"
              aria-label="Filter severity"
            >
              <button
                className={`btn btn-outline-secondary btn-sm ${
                  filterSeverity === "all" ? "active" : ""
                }`}
                onClick={() => setFilterSeverity("all")}
                title="Show all"
              >
                All
              </button>
              <button
                className={`btn btn-outline-warning btn-sm ${
                  filterSeverity === "warning" ? "active" : ""
                }`}
                onClick={() => setFilterSeverity("warning")}
                title="Show warnings"
              >
                Warning
              </button>
              <button
                className={`btn btn-outline-danger btn-sm ${
                  filterSeverity === "critical" ? "active" : ""
                }`}
                onClick={() => setFilterSeverity("critical")}
                title="Show critical"
              >
                Critical
              </button>
            </div>
            <button
              className="btn btn-sm"
              style={{ borderColor: "#004851", color: "#004851" }}
              onClick={loadAlerts}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 d-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading…</span>
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <div className="fs-5">No open alerts</div>
              <div className="small">
                You're all caught up. Try refreshing or changing filters.
              </div>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: 520 }}>
              <table className="table table-striped table-hover table-borderless align-middle mb-0 alerts-table">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ width: "18%" }} className="text-center">
                      Alert ID
                    </th>
                    <th style={{ width: "22%" }} className="text-center">
                      Equipment
                    </th>
                    <th style={{ width: "14%" }} className="text-center">
                      Category
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Severity
                    </th>
                    <th style={{ width: "28%" }} className="text-center">
                      Actions
                    </th>
                    <th style={{ width: "8%" }} className="text-center">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAlerts.map((a) => (
                    <React.Fragment key={a.id}>
                      <tr>
                        <td className="text-center">
                          <span className="text-dark">{a.id}</span>
                        </td>

                        <td className="text-center">
                          <div className="fw-semibold">{a.equipmentName}</div>
                          <div className="text-muted small">
                            {a.equipmentId}
                          </div>
                        </td>

                        <td className="text-center">
                          {String(a.category).replaceAll("&amp;", "&")}
                        </td>

                        <td className="text-center">
                          <span className={badgeClassForSeverity(a.severity)}>
                            {a.severity}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() =>
                                updateAlert(a.alertIds || [a.id], {
                                  status: "resolved",
                                })
                              }
                              title="Mark as resolved"
                            >
                              Resolve
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                borderColor: "#004851",
                                color: "#004851",
                              }}
                              onClick={() => acknowledgeAndGoToSchedule(a)}
                              title="Schedule maintenance"
                            >
                              Schedule
                            </button>
                          </div>
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => toggleRowExpansion(a.id)}
                            title="View alert details"
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(a.id) && (
                        <tr>
                          <td colSpan="6" className="bg-light p-4">
                            <div className="row">
                              <div className={a.notes ? "col-md-9" : "col-12"}>
                                <h6 className="fw-semibold mb-3 text-dark">
                                  Equipment Metrics
                                </h6>
                                {a.metrics &&
                                Object.keys(a.metrics).length > 0 ? (
                                  <div className="row g-3">
                                    {Object.entries(a.metrics).map(
                                      ([key, value]) =>
                                        value !== null && (
                                          <div key={key} className="col-md-4">
                                            <div className="card border-0 shadow-sm h-100">
                                              <div className="card-body p-3 text-center">
                                                <div className="text-muted small text-uppercase fw-semibold mb-1">
                                                  {key}
                                                </div>
                                                <div className="fs-5 fw-bold text-dark">
                                                  {value}
                                                  {key === "temperature" &&
                                                    "°C"}
                                                  {key === "load" && "%"}
                                                  {key === "vibration" &&
                                                    " mm/s"}
                                                </div>
                                                {a.levels && a.levels[key] && (
                                                  <span
                                                    className={`badge mt-2 ${badgeClassForSeverity(a.levels[key])}`}
                                                  >
                                                    {a.levels[key]}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-3">
                                    <span className="text-muted">
                                      No metrics available
                                    </span>
                                  </div>
                                )}
                              </div>
                              {a.notes && (
                                <div className="col-md-3">
                                  <h6 className="fw-semibold mb-3 text-dark">
                                    Notes
                                  </h6>
                                  <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-3">
                                      <p className="mb-0 text-muted small">
                                        {a.notes}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
