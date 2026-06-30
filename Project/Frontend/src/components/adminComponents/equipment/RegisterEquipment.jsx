// src/components/RegisterEquipment.jsx
import React, { useState, useRef, useEffect } from "react";
import EquipmentForm1 from "./EquipmentForm1";
import VendorForm2 from "./VendorForm2";
import useStateWizard from "./useStateWizard";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterEquipment() {
  const {
    equipmentData,
    setEquipmentData,
    vendorData,
    setVendorData,
    vendors,
    loading,
    generateEquipID,
    addEquipment,
    addVendor,
    resetWizard,
    eqId,
    setEqId,
  } = useStateWizard();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Parent-side validation on final submit
  const validateEquipment = (data) => {
    const err = {};
    if (!data.eqName?.trim()) err.eqName = "Equipment Name is required";
    if (!data.category) err.category = "Category is required";
    if (!data.installDt) err.installDt = "Installation Date is required";
    if (!data.eqstatus) err.eqstatus = "Status is required";
    if (!data.eqModel?.trim()) err.eqModel = "Model is required";
    if (data.eqWt === "" || !Number.isFinite(Number(data.eqWt)))
      err.eqWt = "Enter a valid weight";
    if (data.eqPow === "" || !Number.isFinite(Number(data.eqPow)))
      err.eqPow = "Enter a valid power";
    if (!data.capacity?.trim()) err.capacity = "Capacity is required";
    return err;
  };

  const validateVendor = (data) => {
    const err = {};
    if (!data.vendorID) err.vendorID = "Vendor is required";
    if (!data.vendorName) err.vendorName = "Vendor Name is required";
    if (!data.vendorEmail) err.vendorEmail = "Vendor Email is required";
    return err;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isRegistering) return;

    // Validate both sections
    const equipErrors = validateEquipment(equipmentData);
    const vendErrors = validateVendor(vendorData);
    const allErrors = { ...equipErrors, ...vendErrors };

    if (Object.keys(allErrors).length > 0) {
      alert("Please complete all required fields before registering.");
      return;
    }

    setIsRegistering(true);
    try {
      const newEquipment = {
        equipmentDetails: {
          equipmentName: equipmentData.eqName,
          category: equipmentData.category,
          installationDate: equipmentData.installDt,
          equipmentStatus: equipmentData.eqstatus,
        },
        specifications: {
          model: equipmentData.eqModel,
          weightKg: Number(equipmentData.eqWt),
          powerKW: Number(equipmentData.eqPow),
          capacity: equipmentData.capacity,
        },
        vendorDetails: {
          vendorId: vendorData.vendorID,
          vendorName: vendorData.vendorName,
          contactEmail: vendorData.vendorEmail,
        },
      };

      const response = await addEquipment(newEquipment);
      setEqId(response.equipmentId);

      setShowSuccessModal(true);
      // auto-close and reset
      timeoutRef.current = setTimeout(() => {
        setShowSuccessModal(false);
        resetWizard();
        setIsRegistering(false);
      }, 2500);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register equipment. Please try again.");
      setIsRegistering(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Register Equipment</h3>

      {/* Equipment Details Section */}
      <EquipmentForm1
        defaultValues={equipmentData}
        onChange={(data) => setEquipmentData(data)}
      />

      {/* Vendor Details Section */}
      <VendorForm2
        defaultValues={vendorData}
        vendors={vendors}
        loading={loading}
        addVendor={addVendor}
        onChange={(data) => setVendorData(data)}
      />

      {/* Register Button */}
      <div className="d-flex justify-content-center mt-4">
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: "var(--primary-dark)", color: "white" }}
          onClick={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? "Registering..." : "Register Equipment"}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Registration Successful!</h5>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5">
                  The equipment has been successfully registered with ID:
                </p>
                <h4 className="fw-bold text-success">{eqId}</h4>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  className="btn"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                  }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    resetWizard();
                    setIsRegistering(false);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterEquipment;
