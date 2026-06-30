import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dashboardService from "../../../services/dashboardService";
import "../styles/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);
  const [pendingMaintenance, setPendingMaintenance] = useState(0);
  const [uptime, setUptime] = useState("0%");
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  const [warningAlerts, setWarningAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState({});
  const [categoryDistribution, setCategoryDistribution] = useState({});

  // Static mock data for demonstration
  const mockData = {
    totalEquipment: 24,
    activeVendors: 8,
    pendingMaintenance: 3,
    uptime: "87%",
    totalAlerts: 5,
    criticalAlerts: 2,
    warningAlerts: 3,
    statusDistribution: {
      "Operational": 18,
      "Maintenance": 3,
      "Installed": 1,
      "Decommissioned": 2
    },
    categoryDistribution: {
      "Electrical": 6,
      "Instrumentation": 5,
      "Automation": 4,
      "Mechanical": 5,
      "Heating & Cooling": 2,
      "Safety & Utilization": 2
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API, but use mock data as fallback
        try {
          const stats = await dashboardService.getDashboardStats();
          
          if (!mounted) return;
          
          // If API returns empty data, use mock data
          if (stats.totalEquipment === 0) {
            console.log('Using mock data for dashboard');
            setTotalEquipment(mockData.totalEquipment);
            setActiveVendors(mockData.activeVendors);
            setPendingMaintenance(mockData.pendingMaintenance);
            setUptime(mockData.uptime);
            setTotalAlerts(mockData.totalAlerts);
            setCriticalAlerts(mockData.criticalAlerts);
            setWarningAlerts(mockData.warningAlerts);
            setStatusDistribution(mockData.statusDistribution);
            setCategoryDistribution(mockData.categoryDistribution);
          } else {
            setTotalEquipment(stats.totalEquipment);
            setActiveVendors(stats.activeVendors);
            setPendingMaintenance(stats.pendingMaintenance);
            setUptime(stats.uptime);
            setTotalAlerts(stats.totalAlerts || 0);
            setCriticalAlerts(stats.criticalAlerts || 0);
            setWarningAlerts(stats.warningAlerts || 0);
            setStatusDistribution(stats.statusDistribution);
            setCategoryDistribution(stats.categoryDistribution);
          }
        } catch (apiError) {
          // If API fails, use mock data
          console.log('API failed, using mock data for dashboard');
          setTotalEquipment(mockData.totalEquipment);
          setActiveVendors(mockData.activeVendors);
          setPendingMaintenance(mockData.pendingMaintenance);
          setUptime(mockData.uptime);
          setTotalAlerts(mockData.totalAlerts);
          setCriticalAlerts(mockData.criticalAlerts);
          setWarningAlerts(mockData.warningAlerts);
          setStatusDistribution(mockData.statusDistribution);
          setCategoryDistribution(mockData.categoryDistribution);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        if (mounted) {
          setError('Failed to load dashboard data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // operators list removed per request

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Equipment Usage",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ['Active', 'Decommissioned'],
    datasets: [
      {
        label: "Equipment Status",
        data: [
          (statusDistribution['OPERATIONAL'] || statusDistribution['Operational'] || 0) + 
          (statusDistribution['INSTALLED'] || statusDistribution['Installed'] || 0) + 
          (statusDistribution['MAINTENANCE'] || statusDistribution['Maintenance'] || 0),
          statusDistribution['DECOMMISSIONED'] || statusDistribution['Decommissioned'] || 0
        ],
        backgroundColor: [
          "#28a745", // Active - Green
          "#dc3545"  // Decommissioned - Red
        ],
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(statusDistribution).length > 0 ? Object.keys(statusDistribution) : ['No Data'],
    datasets: [
      {
        data: Object.keys(statusDistribution).length > 0 ? Object.values(statusDistribution) : [1],
        backgroundColor: [
          "#28a745", // Green - Operational
          "#ffc107", // Yellow - Maintenance
          "#17a2b8", // Cyan - Installed
          "#dc3545"  // Red - Decommissioned
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryDistribution).length > 0 ? Object.keys(categoryDistribution) : ['No Data'],
    datasets: [
      {
        label: "Equipment Count",
        data: Object.keys(categoryDistribution).length > 0 ? Object.values(categoryDistribution) : [1],
        backgroundColor: [
          "rgba(23, 162, 184, 0.8)",   // Cyan
          "rgba(255, 193, 7, 0.8)",    // Yellow
          "rgba(102, 16, 242, 0.8)",   // Purple
          "rgba(232, 62, 140, 0.8)",   // Pink
          "rgba(32, 201, 151, 0.8)",   // Teal
          "rgba(253, 126, 20, 0.8)",   // Orange
        ],
        borderColor: [
          "rgb(23, 162, 184)",
          "rgb(255, 193, 7)",
          "rgb(102, 16, 242)",
          "rgb(232, 62, 140)",
          "rgb(32, 201, 151)",
          "rgb(253, 126, 20)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center fs-1 fw-bold text-dark mb-3">Admin Dashboard</h2>
              <div className="text-center mt-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center fs-1 fw-bold text-dark mb-3">Admin Dashboard</h2>
              <div className="alert alert-danger mt-4" role="alert">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center fs-1 fw-bold text-dark mb-3">Admin Dashboard</h2>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-box-seam"></i>
              <div>
                <h3>{totalEquipment}</h3>
                <p>Total Equipment</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-building"></i>
              <div>
                <h3>{activeVendors}</h3>
                <p>Active Vendors</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-wrench"></i>
              <div>
                <h3>{pendingMaintenance}</h3>
                <p>Pending Maintenance</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card">
              <i className="bi bi-check-circle"></i>
              <div>
                <h3>{uptime}</h3>
                <p>Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Statistics Row */}
        <div className="row g-3 mb-4">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card alert-stat-card">
              <i className="bi bi-exclamation-triangle-fill text-warning"></i>
              <div>
                <h3>{totalAlerts}</h3>
                <p>Total Active Alerts</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card critical-alert-stat-card">
              <i className="bi bi-exclamation-octagon-fill text-danger"></i>
              <div>
                <h3>{criticalAlerts}</h3>
                <p>Critical Alerts</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <div className="stat-card warning-alert-stat-card">
              <i className="bi bi-exclamation-triangle-fill text-warning"></i>
              <div>
                <h3>{warningAlerts}</h3>
                <p>Warning Alerts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-xl-6 col-lg-12">
            <div className="chart-card">
              <h5>Equipment Usage Trend</h5>
              <Line
                data={lineData}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="col-xl-6 col-lg-12">
            <div className="chart-card">
              <h5>Equipment Status</h5>
              <Bar
                data={barData}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 5
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="col-xl-6 col-lg-12">
            <div className="chart-card">
              <h5>Operational Status Distribution</h5>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="pie-container" style={{ height: '280px', position: 'relative' }}>
                    <Pie
                      data={doughnutData}
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="legend-container">
                    {Object.keys(statusDistribution).map((status, index) => {
                      const colors = ["#28a745", "#ffc107", "#17a2b8", "#dc3545"];
                      return (
                        <div key={status} className="legend-item" style={{ marginBottom: '12px' }}>
                          <span 
                            className="legend-color" 
                            style={{ 
                              display: 'inline-block',
                              width: '16px', 
                              height: '16px', 
                              backgroundColor: colors[index],
                              marginRight: '8px',
                              borderRadius: '3px'
                            }}
                          ></span>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            {status}: <strong>{statusDistribution[status]}</strong>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12">
            <div className="chart-card">
              <h5>Equipment by Category</h5>
              <Bar
                data={categoryData}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return 'Equipment: ' + context.parsed.x;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      },
                      title: {
                        display: true,
                        text: 'Number of Equipment',
                        font: {
                          weight: 'bold'
                        }
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Category',
                        font: {
                          weight: 'bold'
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
