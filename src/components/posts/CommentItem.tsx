import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { deleteComment } from '../../services/comments';

interface CommentItemProps {
  comment: Comment;
  onCommentDeleted: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onCommentDeleted 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  
  // Check if the logged in user is the comment author
  const isAuthor = user?.id === comment.userId;

  const handleDelete = async () => {
    if (!user || !isAuthor) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;
    
    setLoading(true);
    try {
      await deleteComment(comment.id, user.id);
      onCommentDeleted();
    } catch (error) {
      console.error('Delete comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-700 last:border-b-0 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center text-gray-300 font-medium text-sm">
          A
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-300">{user?.alias}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            
            {isAuthor && (
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <p className="mt-2 text-gray-300">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};