import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import downtimeService from "../../../services/downtimeService";
import "./Downtime.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

function Downtime() {
  const [downtimeReports, setDowntimeReports] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [metrics, setMetrics] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    summary: '',
    recommendations: '',
    priority: 'Medium'
  });
  const [attachedFiles, setAttachedFiles] = useState([]);

  useEffect(() => {
    fetchDowntimeData();
    fetchMetrics();
  }, []);

  const fetchDowntimeData = async () => {
    try {
      const data = await downtimeService.getDowntimeReports();
      setDowntimeReports(data || []);
    } catch (error) {
      console.error("Error fetching downtime reports:", error);
      setDowntimeReports([]);
    }
  };

  const fetchMetrics = async () => {
    try {
      const data = await downtimeService.getDowntimeMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const handleExport = async (format) => {
    try {
      let data;
      if (format === 'csv') {
        data = await downtimeService.exportCSV();
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `downtime-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else {
        data = await downtimeService.exportJSON();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `downtime-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitReport = async () => {
    try {
      const fileStorageKey = `report_files_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const filePromises = attachedFiles.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const fileData = {
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result
            };
            resolve(fileData);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const attachments = await Promise.all(filePromises);
      localStorage.setItem(fileStorageKey, JSON.stringify(attachments));

      const report = {
        ...reportData,
        type: 'DOWNTIME_ANALYSIS',
        submittedBy: 'Operator',
        submittedAt: new Date().toISOString(),
        data: {
          totalIncidents: downtimeReports.length,
          totalDowntime: downtimeReports.reduce((sum, r) => sum + r.duration, 0),
          mostAffectedEquipment: metrics?.mostAffectedEquipment || 'N/A',
          topRootCause: metrics?.topRootCause || 'N/A',
          fileStorageKey: fileStorageKey,
          attachmentCount: attachments.length,
          attachmentNames: attachments.map(f => f.name)
        }
      };

      await downtimeService.submitReport(report);

      setShowReportModal(false);
      setReportData({ title: '', summary: '', recommendations: '', priority: 'Medium' });
      setAttachedFiles([]);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const equipmentDowntimeData = {
    labels: metrics?.equipmentDowntime ? Object.keys(metrics.equipmentDowntime) : [],
    datasets: [
      {
        label: "Downtime (hours)",
        data: metrics?.equipmentDowntime ? Object.values(metrics.equipmentDowntime) : [],
        backgroundColor: "#8884d8",
      },
    ],
  };

  const causeData = {
    labels: metrics?.downtimeCauses ? Object.keys(metrics.downtimeCauses) : [],
    datasets: [
      {
        data: metrics?.downtimeCauses ? Object.values(metrics.downtimeCauses) : [],
        backgroundColor: COLORS,
      },
    ],
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date)) return "Invalid date";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="downtime-heading">Downtime Analytics & Reporting</h1>
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-primary me-2 flex-fill border border-primary border-2" onClick={() => handleExport('csv')}>
            Export CSV
          </button>
          <button className="btn btn-outline-primary me-2 flex-fill border border-primary border-2" onClick={() => handleExport('json')}>
            Export JSON
          </button>
          <button className="btn btn-primary flex-fill" onClick={() => setShowReportModal(true)}>
            Submit Report to Admin
          </button>
        </div>
      </div>

      {metrics && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Incidents</h5>
                <h3 className="text-primary">{metrics.totalIncidents}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Downtime</h5>
                <h3 className="text-danger">{metrics.totalDowntimeHours?.toFixed(1)}h</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Most Affected</h5>
                <p className="text-warning">{metrics.mostAffectedEquipment}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Top Root Cause</h5>
                <p className="text-info">{metrics.topRootCause}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">Downtime Trends by Equipment</div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Bar
                  data={equipmentDowntimeData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      datalabels: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">Downtime Trends by Cause</div>
            <div className="card-body">
              <div
                style={{
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pie
                  data={causeData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                      tooltip: {
                        enabled: true,
                      },
                      datalabels: {
                        display: true,
                        formatter: (value, context) => {
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${percentage}%`;
                        },
                        color: "white",
                        font: {
                          weight: "bold",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">Downtime Incidents</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "var(--primary-color)", // uses your :root --bs-primary
                      color: "#fff",
                    }}
                  >
                    <tr>
                      <th style={{ backgroundColor: "inherit" }}>Equipment</th>
                      <th
                        style={{
                          backgroundColor: "inherit",
                          textAlign: "center",
                        }}
                      >
                        Duration (hours)
                      </th>
                      <th style={{ backgroundColor: "inherit" }}>Status</th>
                      <th style={{ backgroundColor: "inherit" }}>
                        Downtime Start
                      </th>
                      <th style={{ backgroundColor: "inherit" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downtimeReports.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No maintenance downtime records found
                        </td>
                      </tr>
                    ) : (
                      downtimeReports.map((report) => (
                        <React.Fragment key={report.id}>
                          <tr
                            onClick={() => toggleRow(report.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{report.equipmentName}</td>
                            <td
                              style={{
                                textAlign: "center",
                                fontFamily: "monospace",
                              }}
                            >
                              {report.duration.toFixed(1)}
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: report.isOngoing
                                    ? "#fff3cd"
                                    : "#d1e7dd",
                                  color: report.isOngoing
                                    ? "#856404"
                                    : "#0f5132",
                                  border: report.isOngoing
                                    ? "1px solid #ffeaa7"
                                    : "1px solid #badbcc",
                                  padding: "0.375rem 0.75rem",
                                  minWidth: "85px",
                                  maxWidth: "85px",
                                  display: "inline-block",
                                  textAlign: "center",
                                }}
                              >
                                {report.isOngoing ? "Ongoing" : "Completed"}
                              </span>
                            </td>
                            <td>
                              {new Date(report.downtimeStart).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </td>
                            <td>{expandedRows.has(report.id) ? "▼" : "▶"}</td>
                          </tr>
                          {expandedRows.has(report.id) && (
                            <tr>
                              <td colSpan="5">
                                {/* replaced detail block with aligned grid */}
                                <div className="report-details">
                                  <div className="label">Cause</div>
                                  <div className="value">{report.cause}</div>

                                  <div className="label">Recommendations</div>
                                  <div className="value">{report.recommendations}</div>

                                  <div className="label">Downtime Start</div>
                                  <div className="value">{formatDate(report.downtimeStart)}</div>

                                  <div className="label">Downtime End</div>
                                  <div className="value">
                                    {report.downtimeEnd ? formatDate(report.downtimeEnd) : "Ongoing"}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Submission Modal */}
      {showReportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Downtime Analysis Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Report Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reportData.title}
                    onChange={(e) => setReportData({...reportData, title: e.target.value})}
                    placeholder="e.g., Weekly Downtime Analysis"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Summary</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reportData.summary}
                    onChange={(e) => setReportData({...reportData, summary: e.target.value})}
                    placeholder="Brief summary of downtime trends and key findings..."
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Recommendations</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reportData.recommendations}
                    onChange={(e) => setReportData({...reportData, recommendations: e.target.value})}
                    placeholder="Recommended actions to reduce downtime..."
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={reportData.priority}
                    onChange={(e) => setReportData({...reportData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Attach Files (CSV, JSON, etc.)</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept=".csv,.json,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  {attachedFiles.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Attached files:</small>
                      <ul className="list-unstyled">
                        {attachedFiles.map((file, index) => (
                          <li key={index} className="d-flex justify-content-between align-items-center">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={submitReport}>
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Downtime;
