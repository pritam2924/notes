import React, { useState, useEffect } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import "../styles/Reports.css";

const Reports = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Manual input state for graph data
  const [manualData, setManualData] = useState({
    maintenanceCost: '',
    maintenanceHours: '',
    revenue: '',
    operationalCount: '',
    underMaintenanceCount: '',
    availabilityPercentage: '',
    categories: [
      { name: 'Mechanical', cost: '' },
      { name: 'Electrical', cost: '' },
      { name: 'Instrumentation', cost: '' },
      { name: 'Automation', cost: '' }
    ]
  });

  const getApiUrl = () => {
    try {
      return (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
             (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
             "http://localhost:8084/api";
    } catch (e) {
      return "http://localhost:8084/api";
    }
  };

  useEffect(() => {
    fetchSubmittedReports();
  }, []);

  const fetchSubmittedReports = async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/reports`);
      setSubmittedReports(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching submitted reports:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...manualData.categories];
    newCategories[index].cost = value;
    setManualData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleReset = () => {
    setManualData({
      maintenanceCost: '',
      maintenanceHours: '',
      revenue: '',
      operationalCount: '',
      underMaintenanceCount: '',
      availabilityPercentage: '',
      categories: [
        { name: 'Mechanical', cost: '' },
        { name: 'Electrical', cost: '' },
        { name: 'Instrumentation', cost: '' },
        { name: 'Automation', cost: '' }
      ]
    });
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const categoryChartData = {
    labels: manualData.categories.map(c => c.name),
    datasets: [{
      label: 'Maintenance Cost',
      data: manualData.categories.map(c => parseFloat(c.cost) || 0),
      backgroundColor: ['#4BA3A6', '#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  const statusChartData = {
    labels: ['Operational', 'Under Maintenance'],
    datasets: [{
      label: 'Equipment Count',
      data: [
        parseFloat(manualData.operationalCount) || 0,
        parseFloat(manualData.underMaintenanceCount) || 0
      ],
      backgroundColor: ['#28a745', '#ffc107']
    }]
  };

  const netProfit = (parseFloat(manualData.revenue) || 0) - (parseFloat(manualData.maintenanceCost) || 0);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="reports-page">
      <h2 className="text-center fs-1 fw-bold text-dark mb-3">Reports & Analytics</h2>

      {/* Manual Input Table */}
      <div className="card mb-4">
        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Configure Analytics Data</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
          <div className="row">
            <div className="col-md-6">
              <table className="table table-sm mb-0" style={{ border: 'none' }}>
                <tbody>
                  <tr style={{ border: 'none' }}>
                    <td style={{ width: '50%', border: 'none' }}>Maintenance Cost ($)</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.maintenanceCost}
                        onChange={(e) => handleInputChange('maintenanceCost', e.target.value)} placeholder="Range: 1000-100000" />
                    </td>
                  </tr>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>Maintenance Hours</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.maintenanceHours}
                        onChange={(e) => handleInputChange('maintenanceHours', e.target.value)} placeholder="Range: 10-1000 hours" />
                    </td>
                  </tr>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>Revenue Generated ($)</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.revenue}
                        onChange={(e) => handleInputChange('revenue', e.target.value)} placeholder="Range: 5000-500000" />
                    </td>
                  </tr>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>Operational Count</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.operationalCount}
                        onChange={(e) => handleInputChange('operationalCount', e.target.value)} placeholder="Range: 0-100" />
                    </td>
                  </tr>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none' }}>Under Maintenance Count</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.underMaintenanceCount}
                        onChange={(e) => handleInputChange('underMaintenanceCount', e.target.value)} placeholder="Range: 0-50" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-sm mb-0" style={{ border: 'none' }}>
                <tbody>
                  <tr style={{ border: 'none' }}>
                    <td style={{ width: '50%', border: 'none' }}>Availability (%)</td>
                    <td style={{ border: 'none' }}>
                      <input type="number" className="form-control form-control-sm" value={manualData.availabilityPercentage}
                        onChange={(e) => handleInputChange('availabilityPercentage', e.target.value)} placeholder="Range: 0-100%" min="0" max="100" />
                    </td>
                  </tr>
                  {manualData.categories.map((cat, index) => (
                    <tr key={index} style={{ border: 'none' }}>
                      <td style={{ border: 'none' }}>{cat.name} Cost ($)</td>
                      <td style={{ border: 'none' }}>
                        <input type="number" className="form-control form-control-sm" value={cat.cost}
                          onChange={(e) => handleCategoryChange(index, e.target.value)} placeholder="Range: 500-50000" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Metrics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Maintenance Cost</h6>
              <h3 className="text-danger">{formatCurrency(manualData.maintenanceCost)}</h3>
              <small>{manualData.maintenanceHours || 0} hours</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Revenue Generated</h6>
              <h3 className="text-success">{formatCurrency(manualData.revenue)}</h3>
              <small>{manualData.operationalCount || 0} operational</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Net Profit</h6>
              <h3 className={netProfit >= 0 ? "text-success" : "text-danger"}>
                {formatCurrency(netProfit)}
              </h3>
              <small>Revenue - Cost</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Availability</h6>
              <h3 className="text-primary">{manualData.availabilityPercentage || 0}%</h3>
              <small>{manualData.underMaintenanceCount || 0} under maintenance</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Maintenance Cost by Category</h5>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80%', maxWidth: '300px' }}>
                  <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Equipment Status Distribution</h5>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80%', maxWidth: '300px' }}>
                  <Pie data={statusChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Reports Section */}
      <div className="submitted-reports-section mt-5">
        <h4>Operator Submitted Reports</h4>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No reports submitted yet</td>
                </tr>
              ) : (
                submittedReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>
                      <span className="badge bg-info">
                        {report.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge priority-badge priority-${report.priority.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td>{report.submittedBy}</td>
                    <td>{formatDate(report.submittedAt)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => viewReport(report)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {showModal && selectedReport && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedReport.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Type:</strong> {selectedReport.type?.replace('_', ' ')}
                  </div>
                  <div className="col-md-6">
                    <strong>Priority:</strong> 
                    <span
                      className={`badge ms-2 priority-badge priority-${selectedReport.priority.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Submitted By:</strong> {selectedReport.submittedBy}
                  </div>
                  <div className="col-md-6">
                    <strong>Date:</strong> {formatDate(selectedReport.submittedAt)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Summary:</strong>
                  <p className="mt-2">{selectedReport.summary}</p>
                </div>
                
                <div className="mb-3">
                  <strong>Recommendations:</strong>
                  <p className="mt-2">{selectedReport.recommendations}</p>
                </div>
                
                {selectedReport.reportData && (
                  <div className="mb-3">
                    <strong>Analytics Data:</strong>
                    <div className="mt-2 p-3 bg-light rounded">
                      {(() => {
                        try {
                          const parsedData = typeof selectedReport.reportData === 'string'
                            ? JSON.parse(selectedReport.reportData)
                            : selectedReport.reportData;

                          // Extract attachments separately
                          const { attachments, ...analyticsData } = parsedData;

                          return (
                            <div>
                              <pre style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                                {JSON.stringify(analyticsData, null, 2)}
                              </pre>
                              {attachments && attachments.length > 0 && (
                                <div>
                                  <strong>Generated Reports:</strong>
                                  <div className="mt-2">
                                    {attachments.map((file, index) => (
                                      <div key={index} className="mb-2">
                                        <a
                                          href={file.data}
                                          download={file.name}
                                          className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                          <i className="bi bi-download me-1"></i>
                                          {file.name}
                                        </a>
                                        <small className="text-muted">({(file.size / 1024).toFixed(1)} KB)</small>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } catch (e) {
                          return <pre>{selectedReport.reportData}</pre>;
                        }
                      })()}
                    </div>
                  </div>
                )}


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
