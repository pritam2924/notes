import React, { useState, useEffect } from 'react';
import sparePartService from '../../../services/sparePartService';
import equipmentService from '../../../services/equipmentService';
import requisitionService from '../../../services/RequisitionService';
import './RequestSparePart.css';

const RequestSparePart = ({ onSuccess }) => {
  const [spareParts, setSpareParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ sparePartId: '', equipmentId: '', quantity: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParts();
    fetchEquipment();
  }, []);

  const fetchParts = async () => {
    try {
      const data = await sparePartService.getAllSpareParts();
      setSpareParts(data);
    } catch (err) {
      console.error('Failed to load spare parts', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (err) {
      console.error('Failed to load equipment', err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const qty = parseInt(form.quantity, 10);
    if (!form.sparePartId || !form.equipmentId || isNaN(qty) || qty <= 0) {
      setError('Please select spare part, equipment and enter a valid quantity');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const payload = {
        sparePartId: form.sparePartId,
        equipmentId: form.equipmentId,
  requestedQuantity: qty,
        requestedBy: 'Operator',
        notes: form.notes
      };
      await requisitionService.createRequest(payload);
  setForm({ sparePartId: '', equipmentId: '', quantity: '', notes: '' });
      if (onSuccess) onSuccess();
      alert('Request submitted');
    } catch (err) {
      console.error('Submit failed', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPart = spareParts.find(p => p.sparePartId === form.sparePartId) || null;
  const selectedEquip = equipment.find(eq => eq.equipmentId === form.equipmentId) || null;

  return (
    <>     <h2 className="text-center fs-1 fw-bold text-dark mb-3">Request Spare Part</h2>
    <div className="request-spare-part">
 
      <div className="request-card">
        <div className="request-header">
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit} className="request-form">
          <div className="row two-col">
            <div className="field-row">
              <label>Spare Part</label>
              <select value={form.sparePartId} onChange={(e) => setForm({...form, sparePartId: e.target.value})} required>
                <option value="">Select Spare Part</option>
                {spareParts.map(p => (
                  <option key={p.sparePartId} value={p.sparePartId}>{p.sparePartId} - {p.sparePartName} (Stock: {p.stockQuantity})</option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <label>Equipment</label>
              <select value={form.equipmentId} onChange={(e) => setForm({...form, equipmentId: e.target.value})} required>
                <option value="">Select Equipment</option>
                {equipment.map(eq => (
                  <option key={eq.equipmentId} value={eq.equipmentId}>{eq.equipmentId} - {eq.equipmentName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row two-col">
            <div className="field-row">
              <label>Quantity</label>
              <input type="text" inputMode="numeric" pattern="\d*" placeholder="Enter the quantity" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} required />
            </div>

            <div className="field-row">
              <label>&nbsp;</label>
              <div className="spare-preview">
                {selectedPart ? (
                  <div>
                    <div className="spare-name">{selectedPart.sparePartName}</div>
                    <div className="spare-meta">ID: {selectedPart.sparePartId} • Stock: {selectedPart.stockQuantity}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="field-row">
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} placeholder="Add context for the admin (optional)" />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Request'}</button>
          </div>
        </form>
      </div>
    </div></>
  );
};

export default RequestSparePart;
