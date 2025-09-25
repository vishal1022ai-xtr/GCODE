import React from 'react';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="h-full w-full border-4 border-gray-200 border-t-blue-500 rounded-full"></div>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Table Loading Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, j) => (
              <div key={j} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Page Loading Component
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading medical data..." 
}) => (
  <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
  </div>
);

// Dashboard Loading Component
export const DashboardLoading: React.FC = () => (
  <div className="space-y-6">
    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <TableSkeleton />
  </div>
);

// Inline Loading Component
export const InlineLoading: React.FC<{ text?: string }> = ({ 
  text = "Loading..." 
}) => (
  <div className="flex items-center space-x-2">
    <LoadingSpinner size="sm" />
    <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
  </div>
);