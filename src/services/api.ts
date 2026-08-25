import axios from 'axios';
import { useAppStore } from '../store/useAppStore';

// Default base URL for local backend, override with env var in production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sync axios baseURL with zustand store
useAppStore.subscribe((state) => {
  if (apiClient.defaults.baseURL !== state.apiBaseUrl) {
    apiClient.defaults.baseURL = state.apiBaseUrl;
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a 404 Not Found, don't trigger a global error
    // (e.g., initial state where robot hasn't checked in yet)
    if (error.response && error.response.status === 404) {
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.detail || error.message || 'An unexpected network error occurred.';
    
    // Instead of react-native-toast-message, just log for web (could be replaced with a Web Toast later)
    console.error('[API Error]', message);
    
    return Promise.reject(error);
  }
);
