/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosRequestConfig } from 'axios';
import { refreshToken } from './auth';
import { API_URL } from '../utils/constants';
import { PostCreateRequest } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  if (!config.url?.includes('/auth/refresh') && !config.url?.includes('/auth/register') && !config.url?.includes('/auth/login')) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evită bucla infinită
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Dacă e 401 și nu s-a mai retrimis
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshToken();

        if (refreshed) {
          originalRequest.headers.Authorization = `Bearer ${refreshed.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
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
export const createFormDataRequest = (
  postData: PostCreateRequest,
  images?: File[]
): FormData => {
  const formData = new FormData();

  // Trimite întreg obiectul ca JSON
  formData.append('post', new Blob(
    [JSON.stringify(postData)], 
    { type: 'application/json' }
  ));

  // Trimite fișierele
  if (images && images.length > 0) {
    images.forEach(file => formData.append('images', file));
  }

  return formData;
};



export const multipartConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};