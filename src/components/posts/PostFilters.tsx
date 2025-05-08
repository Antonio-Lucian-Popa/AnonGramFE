import React, { useState } from 'react';
import { Search, MapPin, Tag, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface PostFiltersProps {
  onFilterChange: (filters: PostFilters) => void;
}

export interface PostFilters {
  searchTerm: string;
  radius: number;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

const DEFAULT_RADIUS = 10; // km

export const PostFilters: React.FC<PostFiltersProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;
      setTags([...tags, newTag]);
      setTagInput('');
      
      onFilterChange({
        searchTerm,
        radius,
        tags: [...tags, newTag],
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    
    onFilterChange({
      searchTerm,
      radius,
      tags: newTags,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onFilterChange({
      searchTerm: e.target.value,
      radius,
      tags,
    });
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setRadius(value);
    onFilterChange({
      searchTerm,
      radius: value,
      tags,
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          leftIcon={<Search className="h-4 w-4 text-gray-400" />}
        />
        
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">
              Search radius: {radius}km
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={handleRadiusChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add tag (e.g. #confession)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            leftIcon={<Tag className="h-4 w-4 text-gray-400" />}
          />
          <Button onClick={handleAddTag} disabled={!tagInput}>
            Add
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};