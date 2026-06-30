import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import "bootstrap/dist/css/bootstrap.min.css";

const validationSchema = Yup.object({
  userID: Yup.string().required("User ID is required"),
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

const OperatorResetPassword = () => {
  const [initialValues, setInitialValues] = useState({
    userID: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const res = await axios.get("/Credentials.json");
        const data = res.data || {};

        const parseId = (obj, key) => {
          if (!obj) return "";
          if (typeof obj === "string") return obj;
          if (obj[key]) return obj[key];
          if (obj.userID) return obj.userID;
          if (Array.isArray(obj) && obj.length > 0) {
            if (typeof obj[0] === "string") return obj[0];
            if (obj[0].userID) return obj[0].userID;
          }
          return "";
        };

        const operatorId =
          parseId(data, "operatorUserID") ||
          parseId(data.operator, "userID") ||
          parseId(data, "operator");
        setInitialValues({
          userID: operatorId || "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Failed to load Credentials.json:", err);
      }
    };

    loadCredentials();
  }, []);

  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm },
  ) => {
    try {
      // Use the proper API endpoint for password change
      await axios.patch(`${API_BASE_URL}/users/${values.userID}/password`, {
        currentPassword: "", // Operator reset without current password
        newPassword: values.newPassword
      });

      console.log(
        "Operator password reset successful for user:",
        values.userID,
      );
      alert("Operator password reset successfully!");
      resetForm();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error resetting operator password:", error);
      if (error.response?.data?.message) {
        alert(`Failed to reset password: ${error.response.data.message}`);
      } else {
        alert("Failed to reset operator password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                <div className="text-center">
                  <div
                    className="avatar rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{ width: 96, height: 96 }}
                  >
                    <span className="fs-4">OU</span>
                  </div>
                </div>

                <div className="flex-fill">
                  <h5 className="card-title mb-1">Change Operator Password</h5>
                  <p className="text-muted mb-2">
                    Enter details to change operator password
                  </p>
                </div>
              </div>

              <hr />

              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small">
                          Operator User ID
                        </label>
                        <Field
                          type="text"
                          name="userID"
                          className="form-control"
                          placeholder="Operator user ID"
                        />
                        <ErrorMessage
                          name="userID"
                          component="div"
                          className="error-text text-danger small"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small">New Password</label>
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
                      <div className="col-12 col-md-6">
                        <label className="form-label small">
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
                      <div className="col-12">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary w-100"
                        >
                          {isSubmitting ? "Resetting..." : "Change Password"}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorResetPassword;
