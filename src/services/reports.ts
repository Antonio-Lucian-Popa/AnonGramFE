import api from './api';
import { Report, PaginatedResponse } from '../types';

// Get reports with pagination (admin only)
export const getReports = async (
  page = 0, 
  size = 10
): Promise<PaginatedResponse<Report>> => {
  try {
    const response = await api.get<PaginatedResponse<Report>>(`/reports?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Get reports error:', error);
    throw error;
  }
};