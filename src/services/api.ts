import axios, { AxiosRequestConfig } from 'axios';
import { refreshToken } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Update token in the request
          const token = localStorage.getItem('access_token');
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Helper to create form data requests
export const createFormDataRequest = <T>(
  data: T,
  files?: File[] | null
): FormData => {
  const formData = new FormData();
  
  // Add JSON data
  formData.append('post', new Blob([JSON.stringify(data)], { 
    type: 'application/json' 
  }));
  
  // Add files if provided
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return formData;
};

export const multipartConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};