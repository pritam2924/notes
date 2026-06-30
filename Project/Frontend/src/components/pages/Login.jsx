// Login.jsx
import React from "react";
import "./Login.css";

const Login = ({
  loginData,
  handleLoginChange,
  handleLoginSubmit, // <-- This calls the logic in Auth.jsx
  switchToRegister,
  loading,
  error,
}) => {
  return (
    <div className="auth-form slide-down">
      <p className="auth-card-subtitle-expanded">
        Welcome! Please login to your account
      </p>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="loginUserID" className="form-label">
            User ID
          </label>
          <input
            type="text"
            className="form-control"
            id="loginUserID"
            name="userID"
            placeholder="Enter your User ID"
            value={loginData.userID}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="loginPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="loginPassword"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="text-end mt-3">
          <a href="/forgot" className="forgot-password">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-submit-btn"
          disabled={loading}
          style={{ background: "var(--primary-color)" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center mt-3">
        <span className="switch-text">Don't have an account? </span>
        <button
          type="button"
          className="btn-link-custom"
          onClick={(e) => {
            e.preventDefault();
            // call the handler passed from Auth to switch to the register card
            switchToRegister();
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
