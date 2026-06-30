// src/services/performanceMetricsService.js
import api from '../config/api.js';
import { ENDPOINTS } from '../config/api.js';

const performanceMetricsService = {
  savePerformanceMetric: async (metricData) => {
    try {
      const response = await api.post(ENDPOINTS.PERFORMANCE_METRICS, metricData);
      return response.data;
    } catch (error) {
      console.error('Error saving performance metric:', error);
      throw error;
    }
  },

  getMetricsByEquipmentId: async (equipmentId) => {
    try {
      const response = await api.get(`${ENDPOINTS.PERFORMANCE_METRICS}/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment metrics:', error);
      throw error;
    }
  },

  getRecentMetrics: async (equipmentId, days = 7) => {
    try {
      const response = await api.get(`${ENDPOINTS.PERFORMANCE_METRICS}/equipment/${equipmentId}/recent?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent equipment metrics:', error);
      throw error;
    }
  },

  getAllRecentMetrics: async (days = 7) => {
    try {
      const response = await api.get(`${ENDPOINTS.PERFORMANCE_METRICS}/recent?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all recent metrics:', error);
      throw error;
    }
  }
};

export default performanceMetricsService;