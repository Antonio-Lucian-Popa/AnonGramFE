import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PostList } from '../components/posts/PostList';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getUserPosts } from '../services/posts';

export const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/settings')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white ml-2">
            My Posts
          </h1>
        </div>

        <PostList 
          fetchPosts={(page, size) => getUserPosts(page, size)}
          emptyMessage="You haven't created any posts yet." 
        />
      </div>
    </Layout>
  );
};