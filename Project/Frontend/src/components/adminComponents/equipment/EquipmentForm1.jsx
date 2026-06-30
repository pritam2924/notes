// src/components/EquipmentForm1.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function EquipmentForm1({ defaultValues, onChange }) {
  const [formData, setFormData] = useState(defaultValues ?? {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(defaultValues ?? {});
    setErrors({});
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    onChange?.(updated);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let message = "";
    if (
      ["eqName", "eqModel", "capacity"].includes(name) &&
      !String(value || "").trim()
    ) {
      message = "This field is required";
    }
    if (["installDt", "category", "eqstatus"].includes(name) && !value) {
      message = "This field is required";
    }
    if (name === "eqWt") {
      if (value === "" || !Number.isFinite(Number(value)))
        message = "Enter a valid weight";
    }
    if (name === "eqPow") {
      if (value === "" || !Number.isFinite(Number(value)))
        message = "Enter a valid power";
    }
    if (message) setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const capacityMap = {
    Mechanical: { label: "Load Capacity", placeholder: "e.g., 1000 kg" },
    Electrical: { label: "Power Rating", placeholder: "e.g., 500 kW" },
    Instrumentation: {
      label: "Measurement Range",
      placeholder: "e.g., 0-10 bar",
    },
    Automation: { label: "Throughput", placeholder: "e.g., 200 units/hour" },
    "Heating & Cooling": {
      label: "Thermal Capacity",
      placeholder: "e.g., 50000 kcal/hr",
    },
    "Safety & Utilization": {
      label: "Coverage Capacity",
      placeholder: "e.g., 50 m²",
    },
  };

  return (
    <div className="col-12">
      {/* Equipment Details */}

      <div className="card mb-4">
        <div
          className="card-header text-white"
          style={{ backgroundColor: "var(--primary-dark)" }}
        >
          <h4 className="mb-0">Equipment Details</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="eqName" className="form-label">
                Equipment Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="eqName"
                name="eqName"
                className={`form-control ${errors.eqName ? "is-invalid" : ""}`}
                placeholder="Enter Equipment Name"
                value={formData.eqName ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.eqName && (
                <div className="invalid-feedback">{errors.eqName}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${errors.category ? "is-invalid" : ""}`}
                value={formData.category ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">--Select--</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Instrumentation">Instrumentation</option>
                <option value="Automation">Automation</option>
                <option value="Heating & Cooling">Heating & Cooling</option>
                <option value="Safety & Utilization">
                  Safety & Utilization
                </option>
              </select>
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="installDt" className="form-label">
                Installation Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="installDt"
                name="installDt"
                className={`form-control ${
                  errors.installDt ? "is-invalid" : ""
                }`}
                value={formData.installDt ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.installDt && (
                <div className="invalid-feedback">{errors.installDt}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="eqstatus" className="form-label">
                Equipment Status <span className="text-danger">*</span>
              </label>
              <select
                id="eqstatus"
                name="eqstatus"
                className={`form-select ${errors.eqstatus ? "is-invalid" : ""}`}
                value={formData.eqstatus ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">--Select--</option>
                <option value="Installed">Installed</option>
                <option value="Operational">Operational</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
              {errors.eqstatus && (
                <div className="invalid-feedback">{errors.eqstatus}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="card">
        <div
          className="card-header text-white"
          style={{ backgroundColor: "var(--primary-dark)" }}
        >
          <h4 className="mb-0">Specifications</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="eqModel" className="form-label">
                Model <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="eqModel"
                name="eqModel"
                className={`form-control ${errors.eqModel ? "is-invalid" : ""}`}
                placeholder="Model Name"
                value={formData.eqModel ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.eqModel && (
                <div className="invalid-feedback">{errors.eqModel}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="eqWt" className="form-label">
                Weight (Kg) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="eqWt"
                name="eqWt"
                className={`form-control ${errors.eqWt ? "is-invalid" : ""}`}
                placeholder="Enter Weight"
                value={formData.eqWt ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.eqWt && (
                <div className="invalid-feedback">{errors.eqWt}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="eqPow" className="form-label">
                Power (kW) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="eqPow"
                name="eqPow"
                className={`form-control ${errors.eqPow ? "is-invalid" : ""}`}
                placeholder="Enter Power"
                value={formData.eqPow ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.eqPow && (
                <div className="invalid-feedback">{errors.eqPow}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="capacity" className="form-label">
                {capacityMap[formData.category]?.label ?? "Capacity"}{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                className={`form-control ${
                  errors.capacity ? "is-invalid" : ""
                }`}
                placeholder={
                  capacityMap[formData.category]?.placeholder ??
                  "Enter Capacity"
                }
                value={formData.capacity ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.capacity && (
                <div className="invalid-feedback">{errors.capacity}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentForm1;
