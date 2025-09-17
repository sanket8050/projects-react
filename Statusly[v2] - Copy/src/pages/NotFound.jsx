// AI: 404 Not Found page component with modern design and navigation
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                ← Back to Home
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>Or try one of these pages:</p>
              <div className="mt-2 space-x-4">
                <Link to="/" className="text-green-600 hover:text-green-500">
                  Browse Shops
                </Link>
                <Link to="/login" className="text-green-600 hover:text-green-500">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
