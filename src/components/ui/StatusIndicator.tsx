import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'paused';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  className = ''
}) => {
  if (status === 'active') {
    return (
      <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 animate-pulse ${className}`}>
        <div className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="text-sm font-medium">Active</span>
        </div>
      </div>
    );
  }

  if (status === 'paused') {
    return (
      <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 ${className}`}>
        <div className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Paused</span>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusIndicator;
