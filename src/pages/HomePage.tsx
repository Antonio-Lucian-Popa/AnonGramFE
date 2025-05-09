import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Users, Filter } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PostList } from '../components/posts/PostList';
import { getPosts } from '../services/posts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { PostFilters as FilterType } from '../components/posts/PostFilters';
import { FilterModal } from '../components/posts/FilterModal';

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm">
    <div className="p-3 bg-indigo-600/20 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    searchTerm: '',
    radius: 10,
    tags: [],
  });

  useEffect(() => {
    if (!navigator.geolocation) return;
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.warn('Location access denied or unavailable:', error);
      }
    );
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterType) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 500); // Delay de 0.5 secunde pentru UX mai plăcut (sau până se încarcă ceva real)

    return () => clearTimeout(delay);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (!isLoggedIn) {
    return (
      <Layout>
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-4 pt-16 pb-24 relative">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Share Your Thoughts
                <span className="block text-indigo-400">Anonymously & Locally</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with people in your area while maintaining your privacy. 
                Share stories, experiences, and thoughts without revealing your identity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose AnonGram?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={<Shield className="h-8 w-8 text-indigo-400" />}
              title="Complete Anonymity"
              description="Share your thoughts freely without revealing your identity. Your privacy is our top priority."
            />
            <Feature
              icon={<MapPin className="h-8 w-8 text-indigo-400" />}
              title="Location-Based"
              description="Connect with people in your area. Discover local stories and experiences."
            />
            <Feature
              icon={<Users className="h-8 w-8 text-indigo-400" />}
              title="Vibrant Community"
              description="Join a supportive community where everyone can express themselves freely."
            />
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="bg-gray-800/50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Recent Public Posts
              </h2>
              <p className="text-gray-400">
                Get a glimpse of the conversations happening in your area
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <PostList 
                fetchPosts={getPosts} 
                emptyMessage="No posts yet. Be the first to share something!" 
              />
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Create an account now and start sharing your thoughts anonymously.
            </p>
            <Button
            className='bg-gray-700 hover:bg-gray-800 text-white border-transparent
    text-base px-6 py-3
    rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    transition-colors duration-200 ease-in-out
    disabled:opacity-60 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    mx-auto block'
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Recent Posts</h1>
          <Button
            variant="secondary"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filter Posts
          </Button>
        </div>

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
        
        <PostList 
          fetchPosts={(page, size) => getPosts(page, size, filters)}
          emptyMessage="No posts yet. Be the first to share something!" 
        />
      </div>
    </Layout>
  );
};