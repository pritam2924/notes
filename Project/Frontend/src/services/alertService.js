import api from '../config/api';
import { handleApiError } from '../utils/errorHandler';

class AlertService {
  async getAllAlerts() {
    try {
      const response = await api.get('/alerts');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error(handleApiError(error, 'Failed to fetch alerts'));
    }
  }

  async getOpenAlerts() {
    try {
      const response = await api.get('/alerts/open');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching open alerts:', error);
      throw new Error(handleApiError(error, 'Failed to fetch open alerts'));
    }
  }

  async getAcknowledgedAlerts() {
    try {
      const response = await api.get('/alerts/acknowledged');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching acknowledged alerts:', error);
      throw new Error(handleApiError(error, 'Failed to fetch acknowledged alerts'));
    }
  }

  async getAlertsBySeverity(severity) {
    try {
      const response = await api.get(`/alerts/severity/${severity}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts by severity:', error);
      throw error;
    }
  }

  async getAlertsByEquipmentId(equipmentId) {
    try {
      const response = await api.get(`/alerts/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts by equipment:', error);
      throw error;
    }
  }

  async getRecentAlerts() {
    try {
      const response = await api.get('/alerts/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      throw error;
    }
  }

  async getAlertById(alertId) {
    try {
      const response = await api.get(`/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching alert by ID:', error);
      throw error;
    }
  }

  async updateAlertStatus(alertId, status) {
    try {
      const response = await api.patch(`/alerts/${alertId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw error;
    }
  }

  async deleteAlert(alertId) {
    try {
      await api.delete(`/alerts/${alertId}`);
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  async getAlertStats() {
    try {
      const response = await api.get('/alerts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching alert stats:', error);
      throw error;
    }
  }

  async createAlert(alertData) {
    try {
      const response = await api.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
}

export default new AlertService();