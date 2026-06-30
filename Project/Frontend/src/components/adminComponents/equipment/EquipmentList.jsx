import { useState, useEffect } from "react";
import equipmentService from "../../../services/equipmentService";
import "./EquipmentList.css";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const STATUSES = [
    "All",
    "Installed",
    "Operational",
    "Maintenance",
    "Decommissioned",
  ];

  // -------- Load list from Spring Boot backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await equipmentService.getAllEquipment();
        setEquipment(data);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------- Derive filtered list from state + filters
  useEffect(() => {
    let result = equipment;

    if (searchTerm?.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) =>
        item.equipmentName?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (item) => item.equipmentStatus === statusFilter
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        (item) => item.category === categoryFilter
      );
    }

    if (vendorFilter !== "All") {
      result = result.filter(
        (item) => item.vendorName === vendorFilter
      );
    }

    setFilteredEquipment(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, vendorFilter, equipment]);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        equipment.map((item) => item.category).filter(Boolean)
      )
    ),
  ];

  const vendors = [
    "All",
    ...Array.from(
      new Set(
        equipment.map((item) => item.vendorName).filter(Boolean)
      )
    ),
  ];

  const handleEditClick = (item) => {
    setEditingEquipment(item);
    setNewStatus(item.equipmentStatus ?? "Operational");
    setShowEditModal(true);
  };

  // -------- Save status update to backend
  const handleSaveStatus = async () => {
    if (!editingEquipment) return;
    setSaving(true);

    const prev = equipment;

    try {
      // Optimistic update
      const optimistic = equipment.map((eq) =>
        eq.equipmentId === editingEquipment.equipmentId
          ? { ...eq, equipmentStatus: newStatus }
          : eq
      );
      setEquipment(optimistic);
      
      // Update backend
      await equipmentService.updateEquipmentStatus(editingEquipment.equipmentId, newStatus);
      
      setShowEditModal(false);
      setEditingEquipment(null);
      
    } catch (err) {
      setEquipment(prev); // rollback on error
      alert(`Could not save status: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // -------- Pagination
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredEquipment.slice(startIndex, endIndex);

  // -------- Render states
  if (loading) {
    return <div className="equipment-list-container_els">Loading equipment…</div>;
  }
  if (loadError) {
    return (
      <div className="equipment-list-container_els">
        <div className="error">Error loading data: {loadError}</div>
      </div>
    );
  }

  return (
    <div className="equipment-list-container_els">
      {/* Filters */}
      <div className="filters_els">
        <input
          type="text"
          placeholder="Search by equipment name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input_els"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select_els"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select_els"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="filter-select_els"
        >
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </div>

      <div className="results-count_els">
        Found {filteredEquipment.length} equipment(s)
      </div>

      {/* Table */}
      <table className="equipment-table_els">
        <thead>
          <tr>
            <th>ID</th>
            <th>Equipment Name</th>
            <th>Category</th>
            <th>Status</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentEquipment.map((item) => (
            <tr key={item.equipmentId}>
              <td title={item.equipmentId}>{item.equipmentId}</td>
              <td>{item.equipmentName}</td>
              <td>{item.category}</td>
              <td>
                <span
                  className={`status_els ${String(
                    item.equipmentStatus ?? ""
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.equipmentStatus}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-view_els me-2"
                  onClick={() => setSelectedEquipment(item)}
                  title="View"
                >
                  <i className="bi bi-eye" />
                </button>
                <button
                  className="btn btn-sm btn-edit_els"
                  onClick={() => handleEditClick(item)}
                  title="Edit status"
                >
                  <i className="bi bi-pencil" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No results */}
      {filteredEquipment.length === 0 && (
        <div className="no-results_els">
          No equipment found matching your criteria.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination_els">
          <button
            className="pagination-btn_els"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn_els ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn_els"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedEquipment && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEquipment(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedEquipment(null)}
            >
              ×
            </button>

            <h2>{selectedEquipment.equipmentName}</h2>

            <div className="detail-section">
              <h3>Equipment Details</h3>
              <p>
                <strong>Equipment ID:</strong> {selectedEquipment.equipmentId}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedEquipment.category}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${String(
                    selectedEquipment.equipmentStatus ?? ""
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {selectedEquipment.equipmentStatus}
                </span>
              </p>
              <p>
                <strong>Installation Date:</strong>{" "}
                {selectedEquipment.installationDate}
              </p>
            </div>

            <div className="detail-section">
              <h3>Specifications</h3>
              <p>
                <strong>Model:</strong>{" "}
                {selectedEquipment.model}
              </p>
              <p>
                <strong>Weight:</strong>{" "}
                {selectedEquipment.weightKg} kg
              </p>
              <p>
                <strong>Power:</strong>{" "}
                {selectedEquipment.powerKW} kW
              </p>
              <p>
                <strong>Capacity:</strong>{" "}
                {selectedEquipment.capacity}
              </p>
            </div>

            <div className="detail-section">
              <h3>Vendor Details</h3>
              <p>
                <strong>Vendor ID:</strong>{" "}
                {selectedEquipment.vendorId}
              </p>
              <p>
                <strong>Vendor Name:</strong>{" "}
                {selectedEquipment.vendorName}
              </p>
              <p>
                <strong>Contact Email:</strong>{" "}
                {selectedEquipment.contactEmail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <div
          className="equipment modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="equipment modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>

            <h2>Edit Equipment Status</h2>
            <p>
              <strong>Equipment:</strong>{" "}
              {editingEquipment?.equipmentName}
            </p>

            <div className="form-group">
              <label htmlFor="status-select">Status:</label>
              <select
                id="status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-control"
              >
                {STATUSES.filter((s) => s !== "All").map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleSaveStatus}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
