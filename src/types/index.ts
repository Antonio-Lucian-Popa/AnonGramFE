// User types
export interface User {
  id: string;
  email: string;
  alias: string;
  firstName: string;
  lastName: string;
  userRole: 'USER' | 'ADMIN';
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  alias: string;
  userRole: 'USER';
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Post types
export interface Post {
  id: string;
  userId: string;
  text: string;
  latitude?: number;
  longitude?: number;
  tag?: string;
  images?: string[];
  createdAt: string;
  expiresAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  userVote?: 1 | -1 | null;
}

export interface PostCreateRequest {
  userId: string;
  text: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  expiresAt?: string;
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface CommentCreateRequest {
  postId: string;
  userId: string;
  text: string;
}

// Vote types
export interface VoteRequest {
  postId: string;
  userId: string;
  voteType: 1 | -1;
}

// Report types
export interface Report {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  createdAt: string;
  status: 'PENDING' | 'REVIEWED';
}

export interface ReportCreateRequest {
  postId: string;
  userId: string;
  reason: string;
}

// Pagination
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}