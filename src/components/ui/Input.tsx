import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, fullWidth = true, ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-300 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            bg-gray-800 text-gray-200 border border-gray-700 rounded-md
            focus:ring-indigo-500 focus:border-indigo-500 
            block px-3 py-2 shadow-sm ${fullWidth ? 'w-full' : ''}
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

Input.displayName = 'Input';