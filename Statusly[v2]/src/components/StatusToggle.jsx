// AI: Status toggle component with smooth animations and visual feedback
import React from 'react';

const StatusToggle = ({ isOpen, onToggle, loading = false }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Shop Status:</span>
      
      <button
        onClick={onToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            isOpen ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium transition-colors duration-200 ${
        isOpen ? 'text-green-600' : 'text-gray-500'
      }`}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
      
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
      )}
    </div>
  );
};

export default StatusToggle;
