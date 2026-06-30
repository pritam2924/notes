import React, { useState, useEffect } from 'react';
import requisitionService from '../../services/RequisitionService';
import './SparePartRequests.css';

const SparePartRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await requisitionService.getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch pending requests', err);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    if (!window.confirm('Approve this requisition and issue stock?')) return;
    try {
      setError('');
      await requisitionService.approveRequest(id, 'Admin');
      await fetchPending();
    } catch (err) {
      console.error('Approve failed', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  const reject = async (id) => {
    const comment = window.prompt('Reason for rejection (optional)') || '';
    try {
      setError('');
      await requisitionService.rejectRequest(id, 'Admin', comment);
      await fetchPending();
    } catch (err) {
      console.error('Reject failed', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  const filtered = requests.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (r.sparePartId || '').toLowerCase().includes(s) ||
           (r.sparePartName || '').toLowerCase().includes(s) ||
           (r.equipmentName || r.equipmentId || '').toLowerCase().includes(s);
  });

  return (
    <div className="spare-requests-card">
      <div className="card-header">
        <div>
          <h3>Pending Spare Part Requests</h3>
          <p className="muted">Requests awaiting admin action</p>
        </div>
        <div className="card-actions">
          <input
            className="search-input"
            placeholder="Search by part or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card-body">
        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No pending requests</div>
        ) : (
          <div className="table-responsive">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Spare Part</th>
                  <th>Equipment</th>
                  <th>Qty</th>
                  <th>Requested At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td className="mono">{r.id}</td>
                    <td>
                      <div className="part-name">{r.sparePartId}</div>
                      <div className="part-sub">{r.sparePartName}</div>
                    </td>
                    <td>{r.equipmentName || r.equipmentId}</td>
                    <td className="qty">{r.requestedQuantity}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="actions">
                      <button className="btn btn-approve" onClick={() => approve(r.id)}>Approve</button>
                      <button className="btn btn-reject" onClick={() => reject(r.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SparePartRequests;
