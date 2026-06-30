// src/services/equipmentService.js
import api from '../config/api.js';
import { handleApiError } from '../utils/errorHandler.js';

const equipmentService = {
  // Register new equipment
  registerEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/equipment', equipmentData);
      return response.data;
    } catch (error) {
      console.error('Error registering equipment:', error);
      throw new Error(handleApiError(error, 'Failed to register equipment'));
    }
  },

  // Get all equipment
  getAllEquipment: async () => {
    try {
      const response = await api.get('/equipment');
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new Error(handleApiError(error, 'Failed to fetch equipment'));
    }
  },

  // Get equipment by ID
  getEquipmentById: async (equipmentId) => {
    try {
      if (!equipmentId) {
        throw new Error('Equipment ID is required');
      }
      const response = await api.get(`/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by ID:', error);
      throw new Error(handleApiError(error, 'Failed to fetch equipment'));
    }
  },

  // Update equipment status
  updateEquipmentStatus: async (equipmentId, newStatus) => {
    try {
      const response = await api.put(`/equipment/${equipmentId}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating equipment status:', error);
      throw error;
    }
  },

  // Get equipment lifecycle
  getEquipmentLifecycle: async (equipmentId) => {
    try {
      const response = await api.get(`/equipment/${equipmentId}/lifecycle`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment lifecycle:', error);
      throw error;
    }
  },

  // Equipment status options
  getStatusOptions: () => {
    return ['Installed', 'Operational', 'Maintenance', 'Decommissioned'];
  }
};

export default equipmentService;