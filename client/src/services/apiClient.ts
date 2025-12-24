// src/services/apiClient.ts
import axios from 'axios';

// Create a single instance for the whole app
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shorttheurl-qawf.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Fail if backend takes > 10s
});

// Optional: Add interceptors for global error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors globally (e.g. to Sentry)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;