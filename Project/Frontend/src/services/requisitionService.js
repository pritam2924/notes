import api from '../config/api';

const requisitionService = {
  createRequest: async (data) => {
    try {
      const response = await api.post('/spare-parts-requests', data);
      return response.data;
    } catch (error) {
      console.error('Error creating requisition:', error);
      throw error;
    }
  },

  getAllRequests: async () => {
    try {
      const response = await api.get('/spare-parts-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching requisitions:', error);
      throw error;
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await api.get('/spare-parts-requests/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending requisitions:', error);
      throw error;
    }
  },

  approveRequest: async (id, adminUser) => {
    try {
      const response = await api.post(`/spare-parts-requests/${id}/approve?adminComment=Approved&processedBy=${adminUser}`);
      return response.data;
    } catch (error) {
      console.error('Error approving requisition:', error);
      throw error;
    }
  },

  rejectRequest: async (id, adminUser, comment) => {
    try {
      const response = await api.post(`/spare-parts-requests/${id}/reject?adminComment=${encodeURIComponent(comment || 'Rejected')}&processedBy=${adminUser}`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting requisition:', error);
      throw error;
    }
  }
};

export default requisitionService;
