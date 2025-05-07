import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PostList } from '../components/posts/PostList';
import { getPosts } from '../services/posts';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          Recent Posts
        </h1>
        
        <PostList 
          fetchPosts={getPosts} 
          emptyMessage="No posts yet. Be the first to share something!" 
        />
      </div>
    </Layout>
  );
};