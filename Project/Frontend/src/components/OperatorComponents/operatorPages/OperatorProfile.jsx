import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const OperatorProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userID: "",
    id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  
    useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (!userData) {
          setError("No user data found. Please login again.");
          setLoading(false);
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.userID;
        
        if (!userId) {
          setError("No user ID found. Please login again.");
          setLoading(false);
          return;
        }
        
        // Fetch fresh user data from backend
        const response = await axios.get(`${API_BASE_URL}/users/details/${userId}`);
        const freshUserData = response.data;
        
        // Update state with fresh data
        setUser({
          firstName: freshUserData.firstName || "",
          lastName: freshUserData.lastName || "",
          email: freshUserData.email || "",
          phoneNumber: freshUserData.phoneNumber || "",
          userID: freshUserData.userID || "",
          id: freshUserData.userID || userId
        });
        
        // Update sessionStorage and user-specific localStorage
        const updatedUserData = { ...parsedUser, ...freshUserData };
        sessionStorage.setItem('user', JSON.stringify(updatedUserData));
        localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUserData));
        
      } catch (err) {
        console.error("Error fetching user profile:", err);
        
        // Fallback to sessionStorage data if backend fails
        const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
            email: parsedUser.email || "",
            phoneNumber: parsedUser.phoneNumber || "",
            userID: parsedUser.userID || "",
            id: parsedUser.userID || null
          });
        } else {
          setError("Failed to load profile data. Please login again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                <div className="text-center">
                  <div className="avatar rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width:96,height:96}}>
                    <span className="fs-4">{(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}</span>
                  </div>
                  <small className="d-block mt-2 text-muted">Operator</small>
                </div>

                <div className="flex-fill">
                  <h5 className="card-title mb-1">{`${user.firstName} ${user.lastName}`.trim() || 'Operator'}</h5>
                  <p className="text-muted mb-2">{user.email}</p>
                </div>
              </div>

              <hr />

              <form>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small">First Name</label>
                    <input name="firstName" className="form-control" value={user.firstName} onChange={handleChange} readOnly />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Last Name</label>
                    <input name="lastName" className="form-control" value={user.lastName} onChange={handleChange} readOnly />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Email</label>
                    <input name="email" type="email" className="form-control" value={user.email} onChange={handleChange} readOnly />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Phone Number</label>
                    <input name="phoneNumber" className="form-control" value={user.phoneNumber} onChange={handleChange} readOnly />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">User ID</label>
                    <input name="userID" className="form-control" value={user.userID} readOnly />
                  </div>
                </div>
              </form>
              {loading && <div className="mt-3 small text-muted">Loading profile...</div>}
              {error && <div className="mt-3 small text-danger">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorProfile;