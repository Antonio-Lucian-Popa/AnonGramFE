import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reportPost } from '../../services/posts';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

interface FormValues {
  reason: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  postId 
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      reason: '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await reportPost({
        postId,
        userId: user.id,
        reason: data.reason
      });
      
      setSuccess(true);
      reset();
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Report error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div 
        className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Report Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {success ? (
            <div className="text-center py-6">
              <p className="text-green-400 font-medium">Report submitted successfully!</p>
              <p className="text-gray-400 mt-2">Thank you for helping keep our community safe.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="text-gray-300 mb-4">
                Please let us know why you're reporting this post. Your report will be reviewed by our moderation team.
              </p>
              
              <TextArea
                label="Reason for reporting"
                placeholder="Please explain why you're reporting this content..."
                {...register('reason', { 
                  required: 'Please provide a reason',
                  minLength: {
                    value: 10,
                    message: 'Please provide a more detailed explanation'
                  }
                })}
                error={errors.reason?.message}
              />
              
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}
                >
                  Submit Report
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};