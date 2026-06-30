import React, { useState, useEffect } from "react";
import userAdminService from "../../../services/userAdminService";
import "./OperatorAdministration.css";

const OperatorAdministration = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [pendingUsers, approvedUsers] = await Promise.all([
        userAdminService.getUsersByStatus('PENDING'),
        userAdminService.getUsersByStatus('APPROVED')
      ]);
      setPendingUsers(pendingUsers);
      setApprovedUsers(approvedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleApproval = async (userId, status) => {
    try {
      await userAdminService.approveUser(userId);
      alert("User approved successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await userAdminService.rejectUser(userId);
      alert("User rejected successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading operator data...</div>;

  return (
    <div className="operator-admin-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center fs-1 fw-bold text-dark mb-3">
              Operator Administration
            </h2>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="stat-card">
              <i className="bi bi-person-plus"></i>
              <div>
                <h3>{pendingUsers.length}</h3>
                <p>Pending Registrations</p>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="stat-card">
              <i className="bi bi-people"></i>
              <div>
                <h3>{approvedUsers.length}</h3>
                <p>Active Operators</p>
              </div>
            </div>
          </div>
        </div>

        <div className="operator-action-cards">
          <div
            className={`operator-action-card ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <i className="bi bi-clock-history"></i>
            <h4>New Registrations</h4>
            <p>Review pending registrations</p>
            <span className="badge">{pendingUsers.length}</span>
          </div>

          <div
            className={`operator-action-card ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <i className="bi bi-check-circle"></i>
            <h4>Active Operators</h4>
            <p>Manage active operators</p>
            <span className="badge">{approvedUsers.length}</span>
          </div>
        </div>

        {activeTab === "pending" && (
          <div className="chart-card">
            <h5>Pending Registrations</h5>
            {pendingUsers.length === 0 ? (
              <div className="no-data-message">
                <i className="bi bi-inbox"></i>
                <h6>No Pending Registrations</h6>
                <p>All operator registrations have been processed.</p>
              </div>
            ) : (
              <div className="row g-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.userID}
                    className="col-xl-4 col-lg-6 col-md-6 col-sm-12"
                  >
                    <div className="operator-card pending">
                      <div className="operator-header">
                        <div className="operator-avatar">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="operator-info">
                          <h6>
                            {user.firstName} {user.lastName}
                          </h6>
                          <span className="status-badge pending">PENDING</span>
                        </div>
                      </div>
                      <div className="operator-details">
                        <p>
                          <i className="bi bi-envelope"></i> {user.email}
                        </p>
                        <p>
                          <i className="bi bi-telephone"></i> {user.phoneNumber}
                        </p>
                        <p>
                          <i className="bi bi-calendar"></i>{" "}
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="operator-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproval(user.userID)}
                        >
                          <i className="bi bi-check"></i> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(user.userID)}
                        >
                          <i className="bi bi-x"></i> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div className="chart-card">
            <h5>Active Operators</h5>
            {approvedUsers.length === 0 ? (
              <div className="no-data-message">
                <i className="bi bi-people"></i>
                <h6>No Active Operators</h6>
                <p>No operators have been approved yet.</p>
              </div>
            ) : (
              <div className="row g-3">
                {approvedUsers.map((user) => (
                  <div
                    key={user.userID}
                    className="col-xl-4 col-lg-6 col-md-6 col-sm-12"
                  >
                    <div className="operator-card approved">
                      <div className="operator-header">
                        <div className="operator-avatar">
                          <i className="bi bi-person-check"></i>
                        </div>
                        <div className="operator-info">
                          <h6>
                            {user.firstName} {user.lastName}
                          </h6>
                          <span className="status-badge approved">
                            APPROVED
                          </span>
                        </div>
                      </div>
                      <div className="operator-details">
                        <p>
                          <i className="bi bi-id-card"></i> {user.userID}
                        </p>
                        <p>
                          <i className="bi bi-envelope"></i> {user.email}
                        </p>
                        <p>
                          <i className="bi bi-telephone"></i> {user.phoneNumber}
                        </p>
                        <p>
                          <i className="bi bi-calendar"></i>{" "}
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="operator-actions">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            handleApproval(user.userID, "DEACTIVE")
                          }
                        >
                          <i className="bi bi-pause"></i> Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorAdministration;
