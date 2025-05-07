import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { getPostById } from '../services/posts';
import { getPostComments } from '../services/comments';
import { Post, Comment, PaginatedResponse } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { CommentForm } from '../components/posts/CommentForm';
import { CommentItem } from '../components/posts/CommentItem';
import { Button } from '../components/ui/Button';
import { LocationDisplay } from '../components/posts/LocationDisplay';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [commentsPage, setCommentsPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPost = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const postData = await getPostById(id);
      setPost(postData);
    } catch (err) {
      setError('Failed to load post. It may have been deleted or expired.');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (page = 0) => {
    if (!id) return;
    
    setLoadingComments(true);
    
    try {
      const response = await getPostComments(id, page, 10);
      
      if (page === 0) {
        setComments(response.content);
      } else {
        setComments(prev => [...prev, ...response.content]);
      }
      
      setHasMoreComments(!response.last);
      setCommentsPage(page);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPost();
    fetchComments(0);
  }, [id]);

  const handlePostUpdated = () => {
    fetchPost();
  };

  const handleCommentAdded = () => {
    fetchComments(0);
  };

  const handleCommentDeleted = () => {
    fetchComments(0);
  };

  const handleLoadMoreComments = () => {
    if (!loadingComments && hasMoreComments) {
      fetchComments(commentsPage + 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/')}
            >
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white ml-2">
              Post Details
            </h1>
          </div>
          
          <div className="animate-pulse">
            <div className="bg-gray-800 rounded-lg h-64 mb-8"></div>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg h-24"></div>
              <div className="bg-gray-800 rounded-lg h-24"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/')}
            >
              Back
            </Button>
          </div>
          
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 flex flex-col items-center gap-3">
            <AlertCircle className="text-red-500 h-10 w-10" />
            <p className="text-red-400 text-lg">{error || 'Post not found'}</p>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="mt-2"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white ml-2">
            Post Details
          </h1>
        </div>
        
        <div className="mb-8">
          <PostCard post={post} onPostUpdated={handlePostUpdated} />
          
          {post.latitude && post.longitude && (
            <div className="mt-4">
              <LocationDisplay 
                latitude={post.latitude} 
                longitude={post.longitude} 
              />
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Comments ({post.commentCount})
          </h2>
          
          <CommentForm 
            postId={post.id} 
            onCommentAdded={handleCommentAdded} 
          />
        </div>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {comments.length > 0 ? (
            <>
              <div className="divide-y divide-gray-700">
                {comments.map(comment => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    onCommentDeleted={handleCommentDeleted} 
                  />
                ))}
              </div>
              
              {hasMoreComments && (
                <div className="p-4 text-center">
                  <Button
                    variant="secondary"
                    onClick={handleLoadMoreComments}
                    isLoading={loadingComments}
                    disabled={loadingComments}
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};