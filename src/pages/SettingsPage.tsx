import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, User, MapPin, Trash2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { deleteAccount, updateUserSettings } from '../services/auth';


export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState({
    defaultRadius: 10,
    emailNotifications: true,
  });

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserSettings(user.id, settings);
      // Show success message
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await deleteAccount(user.id);
      logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setLoading(false);
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
            Account Settings
          </h1>
        </div>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h2>
            
            <div className="grid gap-4">
              <Input
                label="Email"
                type="email"
                value={user?.email}
                disabled
              />
              
              <Input
                label="Alias"
                value={user?.alias}
                disabled
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={user?.firstName}
                  disabled
                />
                <Input
                  label="Last Name"
                  value={user?.lastName}
                  disabled
                />
              </div>
            </div>
          </div>
          
          {/* Preferences Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Default Search Radius (km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.defaultRadius}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultRadius: parseInt(e.target.value, 10)
                  })}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  {settings.defaultRadius} kilometers
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailNotifications: e.target.checked
                  })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                />
                <label
                  htmlFor="emailNotifications"
                  className="ml-2 text-gray-300"
                >
                  Receive email notifications
                </label>
              </div>
              
              <Button
                onClick={handleSaveSettings}
                isLoading={loading}
                disabled={loading}
              >
                Save Preferences
              </Button>
            </div>
          </div>
          
          {/* Delete Account Section */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </h2>
            
            {!showDeleteConfirm ? (
              <div>
                <p className="text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete My Account
                </Button>
              </div>
            ) : (
              <div className="bg-red-900/30 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-red-400">
                      Are you absolutely sure?
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    isLoading={loading}
                    disabled={loading}
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};