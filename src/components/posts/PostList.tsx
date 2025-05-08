import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Post, PaginatedResponse } from '../../types';
import { PostCard } from './PostCard';
import { Button } from '../ui/Button';

interface PostListProps {
  fetchPosts: (page: number, size: number) => Promise<PaginatedResponse<Post>>;
  emptyMessage?: string;
}

export const PostList: React.FC<PostListProps> = ({ 
  fetchPosts, 
  emptyMessage = "No posts found" 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadPosts = async (pageToLoad = page) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchPosts(pageToLoad, 10);
      
      if (pageToLoad === 0) {
        setPosts(response.content || []);
      } else {
        setPosts(prev => [...prev, ...(response.content || [])]);
      }
      
      setHasMore(!response.last);
      setPage(pageToLoad);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    setPage(0);
    loadPosts(0);
  }, [fetchPosts]);

  // Handle refresh
  const handleRefresh = () => {
    loadPosts(0);
  };

  // Load more posts
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  if (initialLoad && loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse flex flex-col space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-48 w-full max-w-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-center gap-3 my-6">
        <AlertCircle className="text-red-500" />
        <p className="text-red-400">{error}</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleRefresh}
          className="ml-auto"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!loading && (!posts || posts.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onPostUpdated={handleRefresh}
        />
      ))}
      
      {hasMore && (
        <div className="flex justify-center my-6">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            isLoading={loading}
            disabled={loading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};