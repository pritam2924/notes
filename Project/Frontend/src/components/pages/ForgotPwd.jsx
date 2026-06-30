import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const PwdReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Invalid Email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:8084/api/users/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const link = `http://localhost:5173/reset-password?userId=${data.userId}&username=${encodeURIComponent(data.username)}`;
        setResetLink(link);
        setShowPopup(true);
      } else {
        setMessage(data.message || "Email not found or account not approved.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="card shadow-sm">
        <h3
          className="login-title text-center"
          style={{ color: "var(--primary-dark)" }}
        >
          Forgot Your Password?
        </h3>
        <br />
        <p className="text-muted small">
          Enter email address to check if it's available in the database.
        </p>

        <form onSubmit={handleSubmit} className="mt-3" noValidate>
          {message && (
            <div className="alert alert-danger py-1 mb-3">{message}</div>
          )}

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          >
            Check Email
          </button>
        </form>

        <div className="mt-3 text-center small">
          <Link to="/auth" className="text-decoration-none fw-medium">
            Back to Login
          </Link>
        </div>
      </div>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h4 style={{ marginBottom: "20px" }}>Reset Password Link</h4>
            <p style={{ marginBottom: "15px" }}>
              Click the link below to reset your password:
            </p>
            <a
              href={resetLink}
              style={{
                color: "var(--primary-color)",
                wordBreak: "break-all",
                display: "block",
                marginBottom: "20px",
              }}
            >
              {resetLink}
            </a>
            <button
              onClick={() => setShowPopup(false)}
              className="btn"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwdReset;
