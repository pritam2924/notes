// src/services/dashboardService.js
import api from '../config/api.js';
import { ENDPOINTS } from '../config/api.js';

const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get(`${ENDPOINTS.DASHBOARD}/stats`);
      const data = response.data;
      
      return {
        totalEquipment: data.totalEquipment || 0,
        activeVendors: data.activeVendors || 0,
        pendingMaintenance: data.pendingMaintenance || 0,
        uptime: data.uptime || '0%',
        totalAlerts: data.totalAlerts || 0,
        criticalAlerts: data.criticalAlerts || 0,
        warningAlerts: data.warningAlerts || 0,
        statusDistribution: data.statusDistribution || {},
        categoryDistribution: data.categoryDistribution || {}
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return await dashboardService.getFallbackStats();
    }
  },

  getFallbackStats: async () => {
    try {
      const [equipmentResponse, vendorsResponse] = await Promise.all([
        api.get(ENDPOINTS.EQUIPMENT),
        api.get(ENDPOINTS.VENDORS)
      ]);

      const equipment = equipmentResponse.data || [];
      const vendors = vendorsResponse.data || [];

      const totalEquipment = equipment.length;
      const activeVendors = vendors.length;
      
      const operationalEquipment = equipment.filter(eq => 
        eq.equipmentStatus && (eq.equipmentStatus.toLowerCase() === 'operational' || eq.equipmentStatus === 'OPERATIONAL')
      ).length;
      
      const uptime = totalEquipment > 0 
        ? Math.round((operationalEquipment / totalEquipment) * 100) 
        : 0;

      const pendingMaintenance = equipment.filter(eq => 
        eq.equipmentStatus && (eq.equipmentStatus.toLowerCase() === 'maintenance' || eq.equipmentStatus === 'MAINTENANCE')
      ).length;

      const statusDistribution = {};
      const categoryDistribution = {};
      
      equipment.forEach(eq => {
        const status = eq.equipmentStatus || 'Unknown';
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        
        const category = eq.category || 'Unknown';
        categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      });

      return {
        totalEquipment,
        activeVendors,
        pendingMaintenance,
        uptime: `${uptime}%`,
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        statusDistribution,
        categoryDistribution
      };
    } catch (error) {
      console.error('Error fetching fallback dashboard stats:', error);
      return {
        totalEquipment: 0,
        activeVendors: 0,
        pendingMaintenance: 0,
        uptime: '0%',
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        statusDistribution: {},
        categoryDistribution: {}
      };
    }
  },

  getEquipmentStatusDistribution: async () => {
    try {
      const stats = await dashboardService.getDashboardStats();
      return stats.statusDistribution;
    } catch (error) {
      console.error('Error fetching equipment status distribution:', error);
      throw error;
    }
  }
};

export default dashboardService;