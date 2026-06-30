// src/services/vendorService.js
import api from '../config/api.js';
import { ENDPOINTS } from '../config/api.js';

const vendorService = {
  registerVendor: async (vendorData) => {
    try {
      const response = await api.post(ENDPOINTS.VENDORS, vendorData);
      return response.data;
    } catch (error) {
      console.error('Error registering vendor:', error);
      throw error;
    }
  },

  getAllVendors: async () => {
    try {
      const response = await api.get(ENDPOINTS.VENDORS);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  getVendorById: async (vendorId) => {
    try {
      const response = await api.get(`${ENDPOINTS.VENDORS}/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor by ID:', error);
      throw error;
    }
  }
};

export default vendorService;