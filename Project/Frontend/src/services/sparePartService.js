import api from '../config/api.js';

const sparePartService = {
  createSparePart: async (sparePartData) => {
    try {
      const response = await api.post('/spare-parts', sparePartData);
      return response.data;
    } catch (error) {
      console.error('Error creating spare part:', error);
      throw error;
    }
  },

  getAllSpareParts: async () => {
    try {
      const response = await api.get('/spare-parts');
      return response.data;
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      throw error;
    }
  },

  getSparePartById: async (id) => {
    try {
      const response = await api.get(`/spare-parts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spare part:', error);
      throw error;
    }
  },

  updateSparePart: async (id, sparePartData) => {
    try {
      const response = await api.put(`/spare-parts/${id}`, sparePartData);
      return response.data;
    } catch (error) {
      console.error('Error updating spare part:', error);
      throw error;
    }
  },

  deleteSparePart: async (id) => {
    try {
      await api.delete(`/spare-parts/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting spare part:', error);
      throw error;
    }
  },

  getLowStockParts: async () => {
    try {
      const response = await api.get('/spare-parts/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock parts:', error);
      throw error;
    }
  },

  updateStock: async (id, stockQuantity) => {
    try {
      const response = await api.patch(`/spare-parts/${id}/stock`, { stockQuantity });
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};

export default sparePartService;