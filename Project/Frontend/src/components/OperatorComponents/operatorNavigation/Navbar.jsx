import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../styles/Navbar.css";

const Navbar = ({ toggleTheme, currentTheme, toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Get user data from sessionStorage (tab-specific)
    const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:8084/api/users/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      navigate("/auth");
    }
  };

  const handleProfile = () => {
    navigate('/operator/profile');
  };

  const notifications = [
    { id: 1, text: "Equipment maintenance due", time: "5 min ago" },
    { id: 2, text: "New vendor registered", time: "1 hour ago" },
    { id: 3, text: "Report generated successfully", time: "2 hours ago" },
  ];

  const messages = [
    {
      id: 1,
      from: "John Doe",
      text: "Equipment status update",
      time: "10 min ago",
    },
    { id: 2, from: "Jane Smith", text: "Vendor inquiry", time: "30 min ago" },
  ];

  return (
    <nav className="operator-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div className="navbar-right">
       

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="user-profile">
            <i className="bi bi-person-circle"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <div className="user-profile-info">
                <strong>{currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.userID || 'Operator' : 'Operator'}</strong>
                <div className="user-details">
                  <div><i className="bi bi-person-badge"></i> ID: {currentUser?.userID || 'N/A'}</div>
                  <div><i className="bi bi-envelope"></i> {currentUser?.email || 'N/A'}</div>
                  <div><i className="bi bi-telephone"></i> {currentUser?.phoneNumber || 'N/A'}</div>
                </div>
              </div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleProfile}>
              <i className="bi bi-person"></i> Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
