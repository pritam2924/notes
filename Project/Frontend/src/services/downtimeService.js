import api from '../config/api';

const downtimeService = {
  getDowntimeReports: async () => {
    const response = await api.get('/downtime/reports');
    return response.data;
  },

  getDowntimeMetrics: async () => {
    const response = await api.get('/downtime/metrics');
    return response.data;
  },

  exportCSV: async () => {
    const response = await api.get('/downtime/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  },

  exportJSON: async () => {
    const response = await api.get('/downtime/export/json');
    return response.data;
  },

  submitReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  }
};

export default downtimeService;
