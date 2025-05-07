import api, { createFormDataRequest, multipartConfig } from './api';
import { 
  Post, 
  PostCreateRequest, 
  PaginatedResponse,
  VoteRequest,
  ReportCreateRequest 
} from '../types';

// Get posts with pagination
export const getPosts = async (page = 0, size = 10): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await api.get<PaginatedResponse<Post>>(`/posts?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get post ${id} error:`, error);
    throw error;
  }
};

// Create a new post
export const createPost = async (
  postData: PostCreateRequest, 
  images?: File[]
): Promise<Post> => {
  try {
    const formData = createFormDataRequest(postData, images);
    
    const response = await api.post<Post>(
      '/posts', 
      formData,
      multipartConfig
    );
    
    return response.data;
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (id: string, userId: string): Promise<boolean> => {
  try {
    await api.delete(`/posts/${id}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error(`Delete post ${id} error:`, error);
    throw error;
  }
};

// Vote on a post
export const votePost = async (voteData: VoteRequest): Promise<boolean> => {
  try {
    await api.post('/votes', voteData);
    return true;
  } catch (error) {
    console.error('Vote error:', error);
    throw error;
  }
};

// Report a post
export const reportPost = async (reportData: ReportCreateRequest): Promise<boolean> => {
  try {
    await api.post('/reports', reportData);
    return true;
  } catch (error) {
    console.error('Report error:', error);
    throw error;
  }
};