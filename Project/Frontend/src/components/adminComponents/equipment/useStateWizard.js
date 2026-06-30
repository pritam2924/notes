// src/hooks/useStateWizard.js
import { useState, useEffect } from "react";
import equipmentService from "../../../services/equipmentService";
import vendorService from "../../../services/vendorService";
import axios from "axios";

export default function useStateWizard() {
  const API_BASE = "http://localhost:3000";

  const [equipmentData, setEquipmentData] = useState({
    eqName: "",
    category: "",
    installDt: "",
    eqstatus: "",
    eqModel: "",
    eqWt: "",
    eqPow: "",
    capacity: "",
  });

  const [vendorData, setVendorData] = useState({
    vendorID: "",
    vendorName: "",
    vendorEmail: "",
  });

  const [vendors, setVendors] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eqId, setEqId] = useState("");

  // Load vendors and equipment from API on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);

        const vendorData = await vendorService.getAllVendors();
        const equipmentData = await equipmentService.getAllEquipment();

        if (active) {
          setVendors(vendorData);
          setEquipment(equipmentData);
          setError(null);
        }
      } catch (e) {
        if (active) setError(e);
        console.error("Failed to load data:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const categoryMap = {
    Mechanical: "MECH",
    Electrical: "ELEC",
    Instrumentation: "INST",
    Automation: "AUTO",
    "Heating & Cooling": "HTCL",
    "Safety & Utilization": "SAFE",
  };

  /** Robust Equipment ID:
   * Format: EQ-{CAT}-{YYYY}-{SEQ}
   * - CAT: categoryMap code or GEN
   * - YYYY: install year
   * - SEQ: starts at 1001 for first record, increments per category+year
   */
  const generateEquipID = () => {
    if (!equipmentData.installDt || !equipmentData.category) {
      throw new Error(
        "Installation date and category are required to generate equipment ID"
      );
    }

    const installDate = new Date(equipmentData.installDt);
    if (isNaN(installDate.getTime()))
      throw new Error("Invalid installation date");

    const prefix = "EQ";
    const year = installDate.getFullYear();
    const categoryCode = categoryMap[equipmentData.category] ?? "GEN";

    const matching = equipment.filter((eq) => {
      const id = String(eq?.equipmentId ?? "");
      const parts = id.split("-");
      return (
        parts.length === 4 &&
        parts[1] === categoryCode &&
        parts[2] === String(year)
      );
    });

    let maxSeq = 1000;
    for (const eq of matching) {
      const parts = String(eq?.equipmentId ?? "").split("-");
      const seq = parseInt(parts[3], 10);
      if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq;
    }
    const nextSeq = maxSeq + 1;
    return `${prefix}-${categoryCode}-${year}-${nextSeq}`;
  };

  const resetWizard = () => {
    setEquipmentData({
      eqName: "",
      category: "",
      installDt: "",
      eqstatus: "",
      eqModel: "",
      eqWt: "",
      eqPow: "",
      capacity: "",
    });
    setVendorData({ vendorID: "", vendorName: "", vendorEmail: "" });
    setEqId("");
  };

  const addEquipment = async (equipmentData) => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        equipmentName: equipmentData.equipmentDetails.equipmentName,
        category: equipmentData.equipmentDetails.category,
        installationDate: equipmentData.equipmentDetails.installationDate,
        equipmentStatus: equipmentData.equipmentDetails.equipmentStatus,
        model: equipmentData.specifications.model,
        weightKg: equipmentData.specifications.weightKg,
        powerKW: equipmentData.specifications.powerKW,
        capacity: equipmentData.specifications.capacity,
        vendorId: equipmentData.vendorDetails.vendorId
      };
      
      const response = await equipmentService.registerEquipment(backendData);
      setEquipment((prev) => [...prev, response]);
      return response;
    } catch (error) {
      console.error("Failed to register equipment:", error);
      throw error;
    }
  };

  const addVendor = async (newVendor) => {
    try {
      const response = await vendorService.registerVendor(newVendor);
      setVendors((prev) => [...prev, response]);
      return response;
    } catch (error) {
      console.error("Failed to add vendor:", error);
      throw error;
    }
  };

  return {
    equipmentData,
    setEquipmentData,
    vendorData,
    setVendorData,
    vendors,
    equipment,
    loading,
    error,
    generateEquipID,
    addEquipment,
    addVendor,
    resetWizard,
    eqId,
    setEqId,
  };
}
