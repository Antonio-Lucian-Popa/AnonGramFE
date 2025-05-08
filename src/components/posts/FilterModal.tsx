import React, { useState } from 'react';
import { Search, MapPin, Tag, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PostFilters) => void;
  initialFilters: PostFilters;
}

export interface PostFilters {
  searchTerm: string;
  radius: number;
  tags: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<PostFilters>(initialFilters);
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput && !filters.tags.includes(tagInput)) {
      const newTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;
      setFilters({
        ...filters,
        tags: [...filters.tags, newTag],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Filter Posts</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="Search posts..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Search radius: {filters.radius}km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.radius}
                onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value, 10) })}
                className="w-full"
              />
            </div>
            
            <div>
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
              
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {filters.tags.map(tag => (
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
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};