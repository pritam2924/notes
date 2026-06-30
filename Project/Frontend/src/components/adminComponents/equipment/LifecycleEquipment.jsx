import React, { useState, useEffect } from "react";
import equipmentService from "../../../services/equipmentService";
// import './LifecycleEquipment.css';

const LifecycleEquipment = () => {
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [lifecycleData, setLifecycleData] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load equipment list from backend API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getAllEquipment();
        const options = data.map((equip) => ({
          id: equip.equipmentId,
          name: equip.equipmentName,
        }));
        setEquipmentOptions(options);
      } catch (err) {
        console.error("Failed to load equipment:", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEquipmentChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedEquipment(selectedId);

    try {
      const lifecycle = await equipmentService.getEquipmentLifecycle(selectedId);
      setLifecycleData(lifecycle || []);
    } catch (err) {
      console.error("Failed to load lifecycle data:", err.message);
      setLifecycleData([]);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "status-badge_el operational_el";
      case "under maintenance":
        return "status-badge_el under-maintenance_el";
      case "decommissioned":
        return "status-badge_el decommissioned_el";
      case "installed":
        return "status-badge_el installed_el";
      default:
        return "status-badge_el";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="lifecycle-container_el">
      {loading ? (
        <div>Loading equipment...</div>
      ) : (
        <>
          <div className="search-row_el">
            <label htmlFor="equipment-select" className="form-label">
              Select Equipment:
            </label>
            <select
              id="equipment-select"
              className="form-select"
              value={selectedEquipment}
              onChange={handleEquipmentChange}
              
            >
              <option value="">Choose equipment...</option>
              {equipmentOptions.map((equip) => (
                <option key={equip.id} value={equip.id}>
                  {equip.name.length > 30 ? `${equip.name.substring(0, 30)}...` : equip.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div className="lifecycle-table-section_el">
              <h4>
                Lifecycle History for{" "}
                {
                  equipmentOptions.find((eq) => eq.id === selectedEquipment)
                    ?.name
                }
              </h4>
              {lifecycleData.length > 0 ? (
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <table className="table table-striped table-bordered" style={{ tableLayout: 'auto', width: '100%' }}>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: "var(--primary-color)", // uses your :root --bs-primary
                        color: "#fff",
                      }}
                    >
                      <tr>
                        <th style={{ backgroundColor: "inherit", width: '200px', minWidth: '200px' }}>Status</th>
                        <th style={{ backgroundColor: "inherit", width: '150px' }}>Date</th>
                        <th style={{ backgroundColor: "inherit", width: '150px' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lifecycleData.map((entry, index) => (
                        <tr key={index}>
                          <td style={{ width: '200px', minWidth: '200px', whiteSpace: 'nowrap', textOverflow: 'unset', overflow: 'visible' }}>
                            <span className={getStatusBadgeClass(entry.status)} style={{ display: 'inline-block', width: '100%' }}>
                              {entry.status}
                            </span>
                          </td>
                          <td>{entry.statusChangedAt ? formatDate(entry.statusChangedAt) : 'N/A'}</td>
                          <td>{entry.statusChangedAt ? formatTime(entry.statusChangedAt) : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No lifecycle history available for this equipment.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LifecycleEquipment;
