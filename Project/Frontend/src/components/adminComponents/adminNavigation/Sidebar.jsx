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
          to="/admin/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-speedometer2"></i>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/admin/equipment"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-tools"></i>
          {!collapsed && <span>Equipment Management</span>}
        </NavLink>
       

        <NavLink
          to="/admin/alerts"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-exclamation-octagon"></i>
          {!collapsed && <span>Alerts</span>}
        </NavLink>

        <NavLink
          to="/admin/maintenance"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-wrench"></i>
          {!collapsed && <span>Maintenance Scheduling</span>}
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-file-earmark-text"></i>
          {!collapsed && <span>Analytics and Reports</span>}
        </NavLink>

       
        <NavLink
          to="/admin/spareparts"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-gear"></i>
          {!collapsed && <span>Inventory Management</span>}
        </NavLink>
        
        {/* Spare Requests moved into Inventory (View Requests modal). Sidebar link removed. */}
        
        <NavLink
          to="/admin/messages"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-envelope"></i>
          {!collapsed && <span>Contact Messages</span>}
        </NavLink>
        
        <NavLink
          to="/admin/operator-administration"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-people"></i>
          {!collapsed && <span>Operator Administration</span>}
        </NavLink>
        
        <NavLink
          to="/admin/calendar"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <i className="bi bi-calendar3"></i>
          {!collapsed && <span>Calendar</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
