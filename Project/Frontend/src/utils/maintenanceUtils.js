import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getPendingMaintenanceCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/maintenanceTasks`);
    const tasks = response.data;
    return tasks.filter(
      (task) => task.status === "Scheduled" || task.status === "In Progress"
    ).length;
  } catch (error) {
    console.error("Error fetching maintenance count:", error);
    return 0;
  }
};
