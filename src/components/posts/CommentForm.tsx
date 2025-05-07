import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { createComment } from '../../services/comments';
import { useAuth } from '../../context/AuthContext';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

interface FormValues {
  text: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  onCommentAdded 
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      text: '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await createComment({
        postId,
        userId: user.id,
        text: data.text
      });
      
      reset();
      onCommentAdded();
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400">You need to be logged in to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-lg p-4">
      <TextArea
        placeholder="Write your comment..."
        {...register('text', { 
          required: 'Comment text is required',
          maxLength: {
            value: 500,
            message: 'Comment cannot exceed 500 characters'
          }
        })}
        error={errors.text?.message}
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={submitting}
          disabled={submitting}
          rightIcon={<Send size={16} />}
        >
          Comment
        </Button>
      </div>
    </form>
  );
};