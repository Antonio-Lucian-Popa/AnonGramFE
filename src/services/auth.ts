/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { 
  User, 
  UserRegisterRequest, 
  UserLoginRequest, 
  TokenResponse 
} from '../types';
import { jwtDecode } from 'jwt-decode';

// Register a new user
export const register = async (userData: UserRegisterRequest): Promise<boolean> => {
  try {
    await api.post('/auth/register', userData);
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials: UserLoginRequest): Promise<boolean> => {
  try {
    const response = await api.post<TokenResponse>('/auth/login', credentials);
    
    // Store tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Refresh token
export const refreshToken = async (): Promise<TokenResponse | null> => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;

  try {
    const response = await api.post<TokenResponse>('/auth/refresh', {
      refresh_token: refresh
    });

    const tokens = response.data;

    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);

    return tokens;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    const decoded: any = jwtDecode(token);
    const keycloakId = decoded.sub || decoded.user_id;
    
    if (!keycloakId) return null;
    
    const response = await api.get<User>(`/users/me?keycloakId=${keycloakId}`);
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};