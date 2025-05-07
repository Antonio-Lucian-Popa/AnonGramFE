import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, MapPin, Tag, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { createPost } from '../services/posts';
import { TextArea } from '../components/ui/TextArea';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface FormValues {
  text: string;
  tag?: string;
  useLocation: boolean;
  expiresIn: string;
}

const EXPIRY_OPTIONS = [
  { value: '1', label: '1 hour' },
  { value: '24', label: '24 hours' },
  { value: '72', label: '3 days' },
  { value: '168', label: '7 days' },
  { value: '720', label: '30 days' },
];

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      text: '',
      tag: '',
      useLocation: false,
      expiresIn: '168', // Default to 7 days
    }
  });
  
  const useLocationValue = watch('useLocation');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles].slice(0, 4); // Max 4 images
      setImages(newImages);
      
      // Create preview URLs
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Clean up preview URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      // Calculate expiry date
      const hoursToAdd = parseInt(data.expiresIn, 10);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + hoursToAdd);
      
      // Format as ISO string
      const expiresAtString = expiresAt.toISOString();
      
      const postData = {
        userId: user.id,
        text: data.text,
        tag: data.tag && data.tag.startsWith('#') ? data.tag : `#${data.tag}`,
        expiresAt: expiresAtString,
      };
      
      // Add location if enabled
      if (data.useLocation && latitude !== null && longitude !== null) {
        Object.assign(postData, { latitude, longitude });
      }
      
      // Create post with selected images
      const newPost = await createPost(postData, images.length > 0 ? images : undefined);
      
      // Navigate to the newly created post
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Create post error:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
            Create New Post
          </h1>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              label="Your anonymous message"
              placeholder="Share your thoughts anonymously..."
              {...register('text', { 
                required: 'Post content is required',
                minLength: {
                  value: 10,
                  message: 'Post must be at least 10 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Post cannot exceed 1000 characters'
                }
              })}
              error={errors.text?.message}
            />
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Images (optional)
              </label>
              
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-32">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-gray-900/70 rounded-full p-1 hover:bg-red-900/70"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {previewUrls.length < 4 && (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-indigo-500 transition-colors">
                  <label className="flex flex-col items-center cursor-pointer">
                    <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">
                      Click to upload images
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Max 4 images. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="Tag (optional)"
                  placeholder="#confession"
                  leftIcon={<Tag className="h-4 w-4 text-gray-400" />}
                  {...register('tag', { 
                    pattern: {
                      value: /^#?\w+$/,
                      message: 'Invalid tag format'
                    }
                  })}
                  error={errors.tag?.message}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Post expires in
                </label>
                <select
                  {...register('expiresIn')}
                  className="bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 shadow-sm"
                >
                  {EXPIRY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600 mr-2"
                    {...register('useLocation')}
                  />
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    Include my location
                  </span>
                </label>
                
                {useLocationValue && locationLoading && (
                  <span className="text-gray-400 text-sm">
                    Fetching location...
                  </span>
                )}
              </div>
              
              {useLocationValue && locationError && (
                <p className="text-red-400 text-sm mt-1">
                  Error getting location: {locationError}
                </p>
              )}
              
              {useLocationValue && latitude && longitude && (
                <p className="text-green-400 text-sm mt-1">
                  Location found! Your post will include geographic information.
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                This helps people see posts from your area. You'll remain anonymous.
              </p>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                isLoading={submitting}
                disabled={submitting}
              >
                Post Anonymously
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};