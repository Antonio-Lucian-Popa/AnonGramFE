import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, fullWidth = true, ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-300 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            bg-gray-800 text-gray-200 border border-gray-700 rounded-md
            focus:ring-indigo-500 focus:border-indigo-500 
            block w-full px-3 py-2 shadow-sm min-h-[100px]
            disabled:bg-gray-700 disabled:text-gray-400 
            ${error ? 'border-red-500' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';