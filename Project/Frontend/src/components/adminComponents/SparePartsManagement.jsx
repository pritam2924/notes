import React, { useState, useEffect } from 'react';
import sparePartService from '../../services/sparePartService';
import equipmentService from '../../services/equipmentService';
import requisitionService from '../../services/RequisitionService';
import './SparePartsManagement.css';
import api from '../../config/api';

const SparePartsManagement = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPart, setViewingPart] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [formData, setFormData] = useState({
    sparePartId: '',
    sparePartName: '',
    category: '',
    description: '',
    stockQuantity: '',
    minimumStockLevel: '',
    unitPrice: '',
    supplier: '',
    equipmentId: '',
    equipmentName: ''
  });

  useEffect(() => {
    fetchSpareParts();
    fetchEquipment();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const data = showLowStock 
        ? await sparePartService.getLowStockParts()
        : await sparePartService.getAllSpareParts();
      setSpareParts(data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      setError('Failed to fetch spare parts: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, [showLowStock]);

  const fetchEquipment = async () => {
    try {
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    }
  };

  const handleView = (part) => {
    setViewingPart(part);
    setShowViewModal(true);
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({
      sparePartId: part.sparePartId,
      sparePartName: part.sparePartName,
      category: part.category,
      description: part.description,
      stockQuantity: String(part.stockQuantity),
      minimumStockLevel: String(part.minimumStockLevel),
      unitPrice: String(part.unitPrice),
      supplier: part.supplier,
      equipmentId: part.equipmentId || '',
      equipmentName: part.equipmentName || ''
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPart(null);
    setFormData({
      sparePartId: '',
      sparePartName: '',
      category: '',
      description: '',
      stockQuantity: '',
      minimumStockLevel: '',
      unitPrice: '',
      supplier: '',
      equipmentId: '',
      equipmentName: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sparePartName || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    const stockQty = parseInt(formData.stockQuantity, 10);
    const minStock = parseInt(formData.minimumStockLevel, 10);
    const priceVal = parseFloat(formData.unitPrice);

    if (isNaN(stockQty) || isNaN(minStock) || isNaN(priceVal)) {
      setError('Please enter valid numeric values for stock, minimum level and price');
      return;
    }

    if (stockQty < 0 || minStock < 0 || priceVal < 0) {
      setError('Quantities and price cannot be negative');
      return;
    }
    
    try {
      setError('');
      if (editingPart) {
        const payload = { ...formData, stockQuantity: stockQty, minimumStockLevel: minStock, unitPrice: priceVal };
        await sparePartService.updateSparePart(editingPart.sparePartId, payload);
      } else {
        const newPartData = { ...formData, stockQuantity: stockQty, minimumStockLevel: minStock, unitPrice: priceVal };
        delete newPartData.sparePartId;
        await sparePartService.createSparePart(newPartData);
      }
      resetForm();
      await fetchSpareParts();
    } catch (error) {
      console.error('Error saving spare part:', error);
      setError('Failed to save spare part: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spare part?')) {
      try {
        setError('');
        await sparePartService.deleteSparePart(id);
        await fetchSpareParts();
      } catch (error) {
        console.error('Error deleting spare part:', error);
        setError('Failed to delete spare part: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sparePartId: '',
      sparePartName: '',
      category: '',
      description: '',
      stockQuantity: '',
      minimumStockLevel: '',
      unitPrice: '',
      supplier: '',
      equipmentId: '',
      equipmentName: ''
    });
    setEditingPart(null);
    setShowForm(false);
  };

  const handleEquipmentChange = (equipmentId) => {
    const selectedEquipment = equipment.find(eq => eq.equipmentId === equipmentId);
    setFormData({
      ...formData,
      equipmentId,
      equipmentName: selectedEquipment ? selectedEquipment.equipmentName : ''
    });
  };

  const filteredSpareParts = spareParts.filter(part => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase().trim();
    const name = String(part.sparePartName || '').toLowerCase();
    const id = String(part.sparePartId || '').toLowerCase();
    const equipmentName = String(part.equipmentName || '').toLowerCase();
    const equipmentId = String(part.equipmentId || '').toLowerCase();

    return (
      name.includes(q) ||
      id.includes(q) ||
      equipmentName.includes(q) ||
      equipmentId.includes(q)
    );
  });

  return (
    <div className="spare-parts-management">
      <div className="header">
        <h2 className="text-center fs-1 fw-bold text-dark mb-3">Spare Parts Management</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, ID, or equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="header-actions">
          <button className="btn btn-info" onClick={handleAddNew}>
            Add Spare Part
          </button>
          <button className="btn btn-info" onClick={() => setShowLowStock(!showLowStock)}>
            {showLowStock ? 'Show All' : 'Low Stock Alert'}
          </button>
          <button
            className="btn btn-info view-requests-btn"
            onClick={async () => {
              setShowRequestsModal(true);
              setRequestsLoading(true);
              try {
                const requests = await requisitionService.getPendingRequests();
                setPendingRequests(Array.isArray(requests) ? requests : []);
              } catch (err) {
                console.error('Error fetching pending requests:', err);
                setPendingRequests([]);
                setError('Failed to fetch requests: ' + (err.response?.data?.error || err.message));
              } finally {
                setRequestsLoading(false);
              }
            }}
          >
            View Requests
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: '99999',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '40px', borderRadius: '20px', width: '650px',
            maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.15)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e9ecef'}}>
              <h3 style={{margin: '0', fontSize: '24px', fontWeight: '700'}}>{editingPart ? 'Edit Spare Part' : 'Add New Spare Part'}</h3>
              <button onClick={() => setShowForm(false)} style={{background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', fontSize: '20px', cursor: 'pointer', padding: '8px', width: '40px', height: '40px', borderRadius: '12px'}}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {!editingPart && (
                <div style={{marginBottom: '15px'}}>
                  <p style={{color: '#666', fontSize: '14px', margin: '0'}}>Spare Part ID will be generated automatically</p>
                </div>
              )}
              <div style={{display: 'grid', gridTemplateColumns: editingPart ? '1fr 1fr' : '1fr', gap: '15px', marginBottom: '15px'}}>
                {editingPart && (
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Spare Part ID</label>
                    <input type="text" value={formData.sparePartId} disabled style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5'}} />
                  </div>
                )}
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Spare Part Name *</label>
                  <input type="text" value={formData.sparePartName} onChange={(e) => setFormData({...formData, sparePartName: e.target.value})} required style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px'}} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Stock Quantity *</label>
                  <input type="text" inputMode="numeric" value={formData.stockQuantity} onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})} required style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Minimum Stock Level *</label>
                  <input type="text" inputMode="numeric" value={formData.minimumStockLevel} onChange={(e) => setFormData({...formData, minimumStockLevel: e.target.value})} required style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Unit Price ($) *</label>
                  <input type="text" inputMode="decimal" value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: e.target.value})} required style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Linked Equipment</label>
                  <select value={formData.equipmentId} onChange={(e) => handleEquipmentChange(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}>
                    <option value="">Select Equipment</option>
                    {equipment.map(eq => (
                      <option key={eq.equipmentId} value={eq.equipmentId}>{eq.equipmentId} - {eq.equipmentName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e9ecef'}}>
                <button type="submit" style={{padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600'}}>
                  {editingPart ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="spare-parts-table">
        {loading ? (
          <div className="loading">Loading spare parts...</div>
        ) : (
          <>
            {filteredSpareParts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Min Level</th>
                    <th>Price</th>
                    <th>Equipment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpareParts.map(part => {
                    let rowClass = '';
                    if (part.stockStatus) {
                      rowClass = part.stockStatus.toLowerCase();
                    } else if (part.lowStock) {
                      rowClass = 'warning';
                    }
                    
                    return (
                      <tr key={part.sparePartId} className={rowClass}>
                        <td>{part.sparePartId}</td>
                        <td>{part.sparePartName}</td>
                        <td>{part.stockQuantity}</td>
                        <td>{part.minimumStockLevel}</td>
                        <td>${part.unitPrice}</td>
                        <td>{part.equipmentName || 'Not Linked'}</td>
                        <td>
                          <span className={`status ${part.stockStatus ? part.stockStatus.toLowerCase() : (part.lowStock ? 'warning' : 'normal')}`}>
                            {part.stockStatus || (part.lowStock ? 'Low Stock' : 'Normal')}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-info" onClick={() => handleView(part)}>View</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(part)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(part.sparePartId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No Spare Parts Found</h3>
                <p>Get started by adding your first spare part to the inventory.</p>
                <button className="btn btn-primary" onClick={handleAddNew}>Add Your First Spare Part</button>
              </div>
            )}
          </>
        )}
      </div>

      {showViewModal && viewingPart && (
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: '99999', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 0 20px rgba(0,0,0,0.5)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>Spare Part Details</h3>
              <button onClick={() => setShowViewModal(false)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}>×</button>
            </div>
            <div style={{display: 'grid', gap: '15px'}}>
              <div><strong>ID:</strong> {viewingPart.sparePartId}</div>
              <div><strong>Name:</strong> {viewingPart.sparePartName}</div>
              <div><strong>Description:</strong> {viewingPart.description}</div>
              <div><strong>Stock Quantity:</strong> {viewingPart.stockQuantity}</div>
              <div><strong>Minimum Stock Level:</strong> {viewingPart.minimumStockLevel}</div>
              <div><strong>Unit Price:</strong> ${viewingPart.unitPrice}</div>
              <div><strong>Equipment:</strong> {viewingPart.equipmentName || 'Not Linked'}</div>
              <div><strong>Status:</strong> {viewingPart.stockStatus || (viewingPart.lowStock ? 'Low Stock' : 'Normal')}</div>
              <div><strong>Created:</strong> {new Date(viewingPart.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      {showRequestsModal && (
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: '99999', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', padding: '30px', borderRadius: '16px', width: '850px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.15)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 style={{margin: 0}}>Pending Spare Part Requests</h3>
              <button onClick={() => setShowRequestsModal(false)} style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer'}}>×</button>
            </div>
            {requestsLoading ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#74b9ff'}}>Loading requests...</div>
            ) : (
              <div>
                {pendingRequests.length > 0 ? (
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{background: '#f1f5f9'}}>
                        <th style={{padding: '12px', textAlign: 'left'}}>Date</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Time</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Spare Part ID</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Spare Part Name</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Equipment</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Quantity</th>
                        <th style={{padding: '12px', textAlign: 'left'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map(req => (
                        <tr key={req.id} style={{borderBottom: '1px solid rgba(0,0,0,0.06)'}}>
                          <td style={{padding: '12px'}}>{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td style={{padding: '12px'}}>{new Date(req.createdAt).toLocaleTimeString()}</td>
                          <td style={{padding: '12px'}}>{req.sparePartId}</td>
                          <td style={{padding: '12px', color: '#6b7280', fontSize: 13, fontWeight: 700}}>{req.sparePartName}</td>
                          <td style={{padding: '12px'}}>{req.equipmentName || req.equipmentId}</td>
                          <td style={{padding: '12px'}}>{req.requestedQuantity}</td>
                          <td style={{padding: '12px'}}>
                            <div className="modal-action-buttons">
                              <button className="req-action-btn btn-approve" onClick={async () => {
                                try {
                                  await requisitionService.approveRequest(req.id, 'Admin');
                                  const updated = await requisitionService.getPendingRequests();
                                  setPendingRequests(Array.isArray(updated) ? updated : []);
                                  await fetchSpareParts();
                                } catch (err) {
                                  console.error('Approve failed', err);
                                  setError(err.response?.data?.error || err.message);
                                }
                              }}>Approve</button>
                              <button className="req-action-btn btn-reject" onClick={async () => {
                                const comment = window.prompt('Reason for rejection (optional)') || '';
                                try {
                                  await requisitionService.rejectRequest(req.id, 'Admin', comment);
                                  const updated = await requisitionService.getPendingRequests();
                                  setPendingRequests(Array.isArray(updated) ? updated : []);
                                } catch (err) {
                                  console.error('Reject failed', err);
                                  setError(err.response?.data?.error || err.message);
                                }
                              }} style={{marginLeft: '8px'}}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>No pending requests</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsManagement;
