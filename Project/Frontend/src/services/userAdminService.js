import api from '../config/api';

const userAdminService = {
  getUsersByStatus: async (status) => {
    const response = await api.get(`/users/status/${status}`);
    return response.data;
  },

  approveUser: async (userId) => {
    const response = await api.post(`/users/${userId}/approve`);
    return response.data;
  },

  rejectUser: async (userId) => {
    const response = await api.post(`/users/${userId}/reject`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, updates) => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.post(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default userAdminService;
