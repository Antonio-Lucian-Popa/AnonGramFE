import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { MessageSquare, LogOut, User, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-bold text-white">AnonGram</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PlusCircle className="h-4 w-4" />}
                onClick={() => navigate('/create')}
              >
                New Post
              </Button>
              
              <div className="flex items-center gap-2 text-gray-300 text-sm bg-gray-800 px-3 py-1 rounded-full">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.alias}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="h-4 w-4" />}
                className="hidden sm:flex"
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="h-4 w-4" />}
                className="sm:hidden"
              />
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};