import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Shield } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/reports';
import { Button } from '../components/ui/Button';
import { Report } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getReports(0, 50);
      setReports(response.content);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userRole === 'ADMIN') {
      fetchReports();
    }
  }, [user]);

  if (user?.userRole !== 'ADMIN') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-400">
            You don't have permission to access the admin area.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="mr-2" />
            Admin Dashboard
          </h1>
          
          <div className="animate-pulse">
            <div className="bg-gray-800 h-10 rounded-t-lg"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 h-20 mt-1"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="mr-2" />
            Admin Dashboard
          </h1>
          
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" />
            <p className="text-red-400">{error}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={fetchReports}
              className="ml-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Shield className="mr-2" />
          Admin Dashboard
        </h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              User Reports
            </h2>
          </div>
          
          {reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Post ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reports.map(report => (
                    <tr key={report.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-200">{report.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <a 
                            href={`/post/${report.postId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline"
                          >
                            {report.postId.substring(0, 8)}...
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {format(new Date(report.createdAt), 'MMM d, yyyy HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'PENDING' 
                            ? 'bg-yellow-900/20 text-yellow-400' 
                            : 'bg-green-900/20 text-green-400'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(`/post/${report.postId}`, '_blank')}
                        >
                          View Post
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-400">No reports found. That's good news!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};