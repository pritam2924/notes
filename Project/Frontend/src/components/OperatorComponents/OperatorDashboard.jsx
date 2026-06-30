import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./operatorNavigation/Sidebar";
import Navbar from "./operatorNavigation/Navbar";
import "./OperatorDashboard.css";

function OperatorDashboard() {
  const [theme, setTheme] = useState("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <Navbar
          toggleTheme={toggleTheme}
          currentTheme={theme}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
      {isMobile && !sidebarCollapsed && (
        <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />
      )}
    </div>
  );
}

export default OperatorDashboard;
