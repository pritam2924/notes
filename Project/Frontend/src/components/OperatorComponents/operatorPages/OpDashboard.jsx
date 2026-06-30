import React, { useState } from "react";
import "../styles/Dashboard.css";

const OpDashboard = () => {
  // Sample data (replace with API/json-server data)
  const [alerts] = useState([
    {
      id: 1,
      type: "CRITICAL",
      text: "Vibration above threshold on Press-07",
      time: "10:15 AM",
    },
    {
      id: 2,
      type: "WARNING",
      text: "Temperature trending high on Boiler-02",
      time: "09:40 AM",
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 101,
      equipment: "Conveyor-01",
      type: "Preventive",
      scheduled: "2025-12-11 10:00",
      status: "Scheduled",
      technician: "A. Kumar",
    },
    {
      id: 102,
      equipment: "Press-07",
      type: "Corrective",
      scheduled: "2025-12-10 14:30",
      status: "In Progress",
      technician: "R. Devi",
    },
    {
      id: 103,
      equipment: "Boiler-02",
      type: "Preventive",
      scheduled: "2025-12-12 09:00",
      status: "Scheduled",
      technician: "S. Iqbal",
    },
  ]);

  const [activeQuickTab, setActiveQuickTab] = useState("log");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Handlers (stubbed for demo)
  const handleLogSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to /maintenanceLogs
    alert("Maintenance log submitted.");
  };

  const handleScheduleView = () => {
    // Could navigate to schedule page or show modal
    alert("Navigating to Scheduled Tasks...");
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    // TODO: POST corrective request
    alert("Issue reported. Ticket created.");
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    // TODO: PATCH equipment status
    alert("Equipment status updated.");
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter = filter === "All" ? true : t.type === filter;
    const matchesSearch =
      search.trim() === "" ||
      t.equipment.toLowerCase().includes(search.toLowerCase()) ||
      t.technician.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2>Operator Dashboard</h2>
          </div>
        </div>

        {/* -------- Status Cards -------- */}
        <div className="row g-3 mb-4">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-box-seam"></i>
              <div>
                <h3>15</h3>
                <p>Assigned Equipments</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-wrench"></i>
              <div>
                <h3>8</h3>
                <p>Scheduled Maintenance</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-exclamation-triangle"></i>
              <div>
                <h3>{alerts.length}</h3>
                <p>Active Alerts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-8">
            <div className="tasks-panel">
              <div className="panel-header">
                <h3>Upcoming Maintenance</h3>
                <div className="panel-controls">
                  <div className="search">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search equipment or technician..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>All</option>
                    <option>Preventive</option>
                    <option>Corrective</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="tasks-table">
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Type</th>
                      <th className="d-none d-md-table-cell">Scheduled</th>
                      <th>Status</th>
                      <th className="d-none d-lg-table-cell">Technician</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.id}>
                        <td>{t.equipment}</td>
                        <td>
                          <span className={`chip ${t.type.toLowerCase()}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="d-none d-md-table-cell">{t.scheduled}</td>
                        <td>
                          <span
                            className={`badge ${
                              t.status === "In Progress" ? "warn" : "ok"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="d-none d-lg-table-cell">{t.technician}</td>
                        <td>
                          <button className="link">
                            <i className="bi bi-pencil-square"></i>
                            <span className="d-none d-sm-inline"> Log</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty">
                          No tasks match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* -------- Notifications -------- */}
            <div className="alerts-panel">
              <div className="panel-header">
                <h3>Notifications</h3>
              </div>
              <ul className="alerts-list">
                {alerts.map((a) => (
                  <li key={a.id} className={`alert-item ${a.type.toLowerCase()}`}>
                    <i
                      className={
                        a.type === "CRITICAL"
                          ? "bi bi-lightning-fill"
                          : "bi bi-exclamation-circle"
                      }
                    ></i>
                    <div className="alert-content">
                      <span className="alert-text">{a.text}</span>
                      <span className="alert-time">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OpDashboard;
