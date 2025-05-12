import api, { createFormDataRequest, multipartConfig } from './api';
import { 
  Post, 
  PostCreateRequest, 
  PaginatedResponse,
  VoteRequest,
  ReportCreateRequest 
} from '../types';
import { PostFilters } from '../components/posts/PostFilters';

// Get posts with pagination
export const getPosts = async (
  page = 0,
  size = 10,
  filters?: PostFilters
): Promise<PaginatedResponse<Post>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.searchTerm) {
      params.append('search', filters.searchTerm);
    }

    if (filters?.radius) {
      params.append('radius', filters.radius.toString());

      // ⚠️ Trimite doar dacă radius este setat!
      if (filters.latitude && filters.longitude) {
        params.append('latitude', filters.latitude.toString());
        params.append('longitude', filters.longitude.toString());
      }
    }

    if (filters?.tags?.length) {
      const joinedTags = filters.tags.join(',');
      params.append('tags', joinedTags);
    }

    const response = await api.get<PaginatedResponse<Post>>(`/posts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
};

// Get user's posts with pagination
export const getUserPosts = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await api.get<PaginatedResponse<Post>>(
      `/posts/user/?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error(`Get user posts error:`, error);
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

export const togglePostVote = async (postId: string, userId: string, voteType: 1 | -1): Promise<void> => {
  try {
    // Check if user already voted the same way
    const response = await api.get(`/votes/${postId}?userId=${userId}`);
    const existingVote = response.data;

    if (existingVote && existingVote.voteType === voteType) {
      // Same vote => remove it
      await api.delete(`/votes/${existingVote.id}`);
    } else {
      // New or changed vote => send new one
      const vote: VoteRequest = { postId, userId, voteType };
      await api.post('/votes', vote);
    }
  } catch (error) {
    console.error('Toggle vote error:', error);
    throw error;
  }
}

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