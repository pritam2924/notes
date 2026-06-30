import api from '../config/api';

const maintenanceTaskService = {
  createTask: async (taskData) => {
    const response = await api.post('/maintenance-tasks', taskData);
    return response.data;
  },

  getAllTasks: async () => {
    const response = await api.get('/maintenance-tasks');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/maintenance-tasks/${id}`);
    return response.data;
  },

  getTasksByEquipmentId: async (equipmentId) => {
    const response = await api.get(`/maintenance-tasks/equipment/${equipmentId}`);
    return response.data;
  },

  getTasksByStatus: async (status) => {
    const response = await api.get(`/maintenance-tasks/status/${status}`);
    return response.data;
  },

  getTasksByPriority: async (priority) => {
    const response = await api.get(`/maintenance-tasks/priority/${priority}`);
    return response.data;
  },

  getTasksByScheduledDate: async (scheduledDate) => {
    const response = await api.get(`/maintenance-tasks/date/${scheduledDate}`);
    return response.data;
  },

  getTasksByDateRange: async (startDate, endDate) => {
    const response = await api.get('/maintenance-tasks/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  hasActiveMaintenance: async (equipmentId) => {
    const response = await api.get(`/maintenance-tasks/equipment/${equipmentId}/has-active`);
    return response.data.hasActiveMaintenance;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/maintenance-tasks/${id}`, { status });
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/maintenance-tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/maintenance-tasks/${id}`);
  },

  getTasksByOperatorId: async (operatorId) => {
    const response = await api.get(`/maintenance-tasks/operator/${operatorId}`);
    return response.data;
  },

  getActiveTasksByOperatorId: async (operatorId) => {
    const response = await api.get(`/maintenance-tasks/operator/${operatorId}/active`);
    return response.data;
  },

  assignOperatorToTask: async (taskId, operatorId) => {
    const response = await api.patch(`/maintenance-tasks/${taskId}/assign-operator/${operatorId}`);
    return response.data;
  }
};

export default maintenanceTaskService;