import { useState, useEffect } from 'react';
import equipmentData from '../../../../database.json';
import './EquipmentSearch.css';

const EquipmentSearch = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setEquipment(equipmentData.equipment);
    setFilteredEquipment(equipmentData.equipment);
  }, []);

  useEffect(() => {
    let result = equipment;

    if (searchTerm) {
      result = result.filter(item =>
        item.equipmentDetails.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(item => item.equipmentDetails.equipmentStatus === statusFilter);
    }

    if (categoryFilter !== 'All') {
      result = result.filter(item => item.equipmentDetails.category === categoryFilter);
    }

    setFilteredEquipment(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, equipment]);

  const categories = ['All', ...new Set(equipment.map(item => item.equipmentDetails.category))];
  const statuses = ['All', 'Operational', 'Installed', 'Under Maintenance', 'Decommissioned'];

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredEquipment.slice(startIndex, endIndex);

  return (
    <div className="equipment-search-container">
      <div className="container">
        <h2>Equipment Search & Filter</h2>
        <div className="underline"></div>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by equipment name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="results-count">
        Found {filteredEquipment.length} equipment(s)
      </div>

      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentEquipment.map(item => (
              <tr key={item.equipmentId} onClick={() => setSelectedEquipment(item)}>
                <td>{item.equipmentId}</td>
                <td>{item.equipmentDetails.equipmentName}</td>
                <td>{item.equipmentDetails.category}</td>
                <td>
                  <span className={`status ${item.equipmentDetails.equipmentStatus.toLowerCase()}`}>
                    {item.equipmentDetails.equipmentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {filteredEquipment.length === 0 && (
          <div className="no-results">No equipment found matching your criteria.</div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedEquipment && (
        <div className="modal-overlay" onClick={() => setSelectedEquipment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedEquipment(null)}>&times;</button>
            <h2>{selectedEquipment.equipmentDetails.equipmentName}</h2>
            
            <div className="detail-section">
              <h3>Equipment Details</h3>
              <p><strong>Equipment ID:</strong> {selectedEquipment.equipmentId}</p>
              <p><strong>Category:</strong> {selectedEquipment.equipmentDetails.category}</p>
              <p><strong>Status:</strong> <span className={`status ${selectedEquipment.equipmentDetails.equipmentStatus.toLowerCase()}`}>{selectedEquipment.equipmentDetails.equipmentStatus}</span></p>
              <p><strong>Installation Date:</strong> {selectedEquipment.equipmentDetails.installationDate}</p>
            </div>

            <div className="detail-section">
              <h3>Specifications</h3>
              <p><strong>Model:</strong> {selectedEquipment.specifications.model}</p>
              <p><strong>Weight:</strong> {selectedEquipment.specifications.weightKg} kg</p>
              <p><strong>Power:</strong> {selectedEquipment.specifications.powerKW} kW</p>
              <p><strong>Capacity:</strong> {selectedEquipment.specifications.capacity}</p>
            </div>

            <div className="detail-section">
              <h3>Vendor Details</h3>
              <p><strong>Vendor ID:</strong> {selectedEquipment.vendorDetails.vendorId}</p>
              <p><strong>Vendor Name:</strong> {selectedEquipment.vendorDetails.vendorName}</p>
              <p><strong>Contact Email:</strong> {selectedEquipment.vendorDetails.contactEmail}</p>
            </div>

            <div className="detail-section">
              <h3>Documents</h3>
              <p><strong>Payment Receipt:</strong> {selectedEquipment.documents.paymentReceipt}</p>
              <p><strong>Installation Manual:</strong> {selectedEquipment.documents.installationManual}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentSearch;
