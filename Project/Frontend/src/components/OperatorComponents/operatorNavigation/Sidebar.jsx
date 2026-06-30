import { NavLink, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ collapsed, isMobile, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        !collapsed && isMobile ? "mobile-open" : ""
      }`}
    >
      <div className="sidebar-header">
        <i className="bi bi-gear-fill"></i>
        {!collapsed && <h4>EquipTrack</h4>}
        {!collapsed && isMobile && (
          <button className="close-btn" onClick={toggleSidebar}>
            <i className="bi bi-x-square"></i>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/operator/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-speedometer2"></i>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/operator/mytasks"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-tools"></i>
          {!collapsed && <span>My Tasks</span>}
        </NavLink>

        <NavLink
          to="/operator/metrics"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-thermometer-half"></i>
          {!collapsed && <span>Performance Metrics</span>}
        </NavLink>

        <NavLink
          to="/operator/equipstatus"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-building"></i>
          {!collapsed && <span>Equipment Status</span>}
        </NavLink>
        <NavLink
          to="/operator/alerts"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-wrench"></i>
          {!collapsed && <span>Alerts</span>}
        </NavLink>

        <NavLink
          to="/operator/request-spare"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-cart-plus"></i>
          {!collapsed && <span>Request Spare Part</span>}
        </NavLink>

        <NavLink
          to="/operator/downtime"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-graph-up-arrow"></i>
          {!collapsed && <span>Downtime</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
