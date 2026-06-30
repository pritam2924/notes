// src/utils/apiTest.js
import { API_BASE_URL } from '../config/api';

export const testApiConnection = async () => {
  const tests = [
    { name: 'Equipment API', url: `${API_BASE_URL}/equipment/test` },
    { name: 'Alerts API', url: `${API_BASE_URL}/alerts/test` }
  ];

  const results = [];

  for (const test of tests) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.text();
        results.push({ name: test.name, status: 'success', message: data });
      } else {
        results.push({ name: test.name, status: 'error', message: `HTTP ${response.status}` });
      }
    } catch (error) {
      results.push({ name: test.name, status: 'error', message: error.message });
    }
  }

  return results;
};

export const getApiStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment/test`);
    return response.ok;
  } catch (error) {
    return false;
  }
};