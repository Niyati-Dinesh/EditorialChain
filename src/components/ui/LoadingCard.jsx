import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingCard = ({ 
  title = 'Loading...', 
  description = 'Please wait while we load your content.',
  showSkeleton = true 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <LoadingSpinner size="md" showText={false} />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      {showSkeleton && (
        <div className="mt-6 space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingCard;
