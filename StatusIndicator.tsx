
import React from 'react';

interface StatusIndicatorProps {
  isOnline: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline }) => {
  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
      isOnline
        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
        : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
    }`}>
      <span className="relative flex h-3 w-3">
        {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </span>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
};

export default StatusIndicator;
