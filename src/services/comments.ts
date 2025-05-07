import api from './api';
import { 
  Comment, 
  CommentCreateRequest, 
  PaginatedResponse 
} from '../types';

// Get comments for a post with pagination
export const getPostComments = async (
  postId: string, 
  page = 0, 
  size = 5
): Promise<PaginatedResponse<Comment>> => {
  try {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/comments/post/${postId}?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error(`Get comments for post ${postId} error:`, error);
    throw error;
  }
};

// Create a comment
export const createComment = async (
  commentData: CommentCreateRequest
): Promise<Comment> => {
  try {
    const response = await api.post<Comment>('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('Create comment error:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (
  id: string, 
  userId: string
): Promise<boolean> => {
  try {
    await api.delete(`/comments/${id}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error(`Delete comment ${id} error:`, error);
    throw error;
  }
};