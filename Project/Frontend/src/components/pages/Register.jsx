// Register.jsx
import React from "react";
import "./Register.css";

const Register = ({
  registerData,
  handleRegisterChange,
  handleRegisterSubmit,
  handleSendOtp,
  handleVerifyOtp,
  handleGenerateUserId,
  isRegistrationValid,
  otpSent,
  validationErrors,
  switchToLogin,
}) => {
  return (
    <div className="auth-form slide-down">
      <p className="auth-card-subtitle-expanded">
        Create a new account to get started
      </p>
      {/* Registration Form Fields with Validation */}
      <form onSubmit={handleRegisterSubmit}>
        {/* Replace the current firstName/lastName inputs with this block */}
        <div className="name-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className={`form-control ${
                validationErrors.firstName ? "is-invalid" : ""
              }`}
              value={registerData.firstName}
              onChange={handleRegisterChange}
              placeholder="First name"
            />
            <div
              className={`invalid-feedback ${
                validationErrors.firstName ? "d-block" : ""
              }`}
            >
              {validationErrors.firstName}
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className={`form-control ${
                validationErrors.lastName ? "is-invalid" : ""
              }`}
              value={registerData.lastName}
              onChange={handleRegisterChange}
              placeholder="Last name"
            />
            <div
              className={`invalid-feedback ${
                validationErrors.lastName ? "d-block" : ""
              }`}
            >
              {validationErrors.lastName}
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="registerEmail" className="form-label">
            Email Address
          </label>
          <div className="input-group">
            <input
              type="email"
              className={`form-control ${
                validationErrors.email ? "is-invalid" : ""
              }`}
              id="registerEmail"
              name="email"
              placeholder="Enter your email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <button
              className="btn btn-outline-primary auth-equal-btn"
              type="button"
              onClick={handleSendOtp}
              disabled={!registerData.email || validationErrors.email !== ""}
            >
              {otpSent ? "Resend OTP" : "Send OTP"} {/* <-- FIX APPLIED HERE */}
            </button>
          </div>
          {validationErrors.email && (
            <div className="invalid-feedback d-block">
              {validationErrors.email}
            </div>
          )}
        </div>

        {/* OTP Input Field (Conditional Rendering) */}
        {otpSent && (
          <div className="form-group mb-3">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${
                  validationErrors.otp ? "is-invalid" : ""
                }`}
                id="otp"
                name="otp"
                placeholder="Enter the 6-digit OTP"
                value={registerData.otp}
                onChange={handleRegisterChange}
                maxLength="6"
                required
              />
              <button
                className="btn btn-outline-success auth-equal-btn"
                type="button"
                onClick={handleVerifyOtp}
                disabled={!registerData.otp || registerData.otp.length !== 6}
              >
                Verify
              </button>
            </div>
            {validationErrors.otp && (
              <div className="invalid-feedback d-block">
                {validationErrors.otp}
              </div>
            )}
          </div>
        )}

        <div className="form-group mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className={`form-control ${
              validationErrors.phoneNumber ? "is-invalid" : ""
            }`}
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={registerData.phoneNumber}
            onChange={handleRegisterChange}
            maxLength="10"
            required
          />
          {validationErrors.phoneNumber && (
            <div className="invalid-feedback d-block">
              {validationErrors.phoneNumber}
            </div>
          )}
          {registerData.phoneNumber && !validationErrors.phoneNumber && (
            <small className="form-text text-muted">
              {registerData.phoneNumber.length}/10 digits
            </small>
          )}
        </div>

        {/* Generate UserId Section */}
        <div className="form-group mb-3">
          <label className="form-label">User ID</label>
          <div className="input-group">
            <input
              type="text"
              className={`form-control ${
                validationErrors.userId ? "is-invalid" : ""
              }`}
              id="userId"
              name="userId"
              placeholder="Generated User ID will appear here"
              value={registerData.userId}
              readOnly
            />
            <button
              className="btn btn-outline-secondary auth-equal-btn"
              type="button"
              onClick={handleGenerateUserId}
              disabled={!registerData.firstName || !registerData.lastName}
            >
              Generate UserId
            </button>
          </div>
          {validationErrors.userId && (
            <div className="invalid-feedback d-block">
              {validationErrors.userId}
            </div>
          )}
        </div>

        {/* Password Fields */}
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">
            Create Password
          </label>
          <input
            type="password"
            className={`form-control ${
              validationErrors.password ? "is-invalid" : ""
            }`}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          {validationErrors.password && (
            <div className="invalid-feedback d-block">
              {validationErrors.password}
            </div>
          )}
          <small className="form-text text-muted">
            Password must be at least 8 characters with uppercase, lowercase, and
            number.
          </small>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${
              validationErrors.confirmPassword ? "is-invalid" : ""
            }`}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />
          {validationErrors.confirmPassword && (
            <div className="invalid-feedback d-block">
              {validationErrors.confirmPassword}
            </div>
          )}
        </div>

        {/* END Registration Form Fields with Validation */}

        <button
          type="submit"
          className="btn btn-primary w-100 auth-submit-btn"
          disabled={!isRegistrationValid()}
          style={{ background: "var(--primary-color)" }}
        >
          Register
        </button>
      </form>
      <div className="text-center mt-3">
        <span className="switch-text">Already have an account? </span>
        <button onClick={switchToLogin} className="btn-link-custom">
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
