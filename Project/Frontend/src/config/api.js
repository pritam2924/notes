import axios from "axios";

// API Configuration - ALL requests go through API Gateway
export const API_BASE_URL = "http://localhost:8084/api";

export const API_CONFIG = {
  BASE_URL: "http://localhost:8084/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API Endpoints
export const ENDPOINTS = {
  EQUIPMENT: "/equipment",
  VENDORS: "/vendors",
  DASHBOARD: "/dashboard",
  PERFORMANCE_METRICS: "/performance-metrics",
  ALERTS: "/alerts",
  SPARE_PARTS: "/spare-parts",
};

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    console.error("API Error:", error); 
    return Promise.reject(error);
  },
);

export default api;
