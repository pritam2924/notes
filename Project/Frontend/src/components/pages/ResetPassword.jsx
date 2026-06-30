import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./ResetPassword.css";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number",
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const usernameParam = searchParams.get("username");
    
    if (userIdParam) {
      setUserId(userIdParam);
    }
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [searchParams]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post("http://localhost:8084/api/users/reset-password", {
        userId: userId,
        newPassword: values.newPassword,
      });

      if (response.data.success) {
        alert("Password reset successfully!");
        navigate("/auth");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">EquipTrack</h2>
        </div>
        <h3 className="text-center mb-2">Reset Password</h3>
        <p className="text-muted small text-center mb-4">
          Enter your new password to reset.
        </p>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={userId}
                  disabled
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  disabled
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </div>

              <div className="password-row mb-3">
                <div className="password-field">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="error-text text-danger small"
                  />
                </div>

                <div className="password-field">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-text text-danger small"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !userId}
                className="btn btn-primary w-100 mb-3"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/auth")}
                >
                  Back to Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
