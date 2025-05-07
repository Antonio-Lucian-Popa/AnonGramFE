import React from 'react';
import { MessageSquare, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 mt-auto py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold text-white">AnonGram</span>
          </div>
          
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p className="mb-1">© {new Date().getFullYear()} AnonGram - Anonymous Social Network</p>
            <p className="flex items-center justify-center md:justify-end gap-1">
              <Github className="h-4 w-4" />
              <span>Open source project</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};