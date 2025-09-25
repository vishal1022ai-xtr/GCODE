import React from 'react';
import { AlertTriangleIcon, RefreshCcwIcon, XCircleIcon } from '../Icons';

interface ErrorBoundaryProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

// Generic Error Message Component
export const ErrorMessage: React.FC<ErrorBoundaryProps> = ({ 
  message = "An unexpected error occurred",
  onRetry,
  showRetry = true
}) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
    <div className="flex items-center space-x-3">
      <XCircleIcon className="w-6 h-6 text-red-500" />
      <div className="flex-1">
        <h3 className="text-red-800 dark:text-red-200 font-medium">Error</h3>
        <p className="text-red-700 dark:text-red-300 mt-1">{message}</p>
      </div>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCcwIcon className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  </div>
);

// Network Error Component
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage
    message="Unable to connect to the medical database. Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

// Data Error Component
export const DataError: React.FC<{ entity?: string; onRetry?: () => void }> = ({ 
  entity = "data",
  onRetry 
}) => (
  <ErrorMessage
    message={`Failed to load ${entity}. This might be a temporary issue.`}
    onRetry={onRetry}
  />
);

// Warning Component
export const WarningMessage: React.FC<{ message: string; dismissible?: boolean; onDismiss?: () => void }> = ({ 
  message,
  dismissible = false,
  onDismiss
}) => (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
    <div className="flex items-center space-x-3">
      <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />
      <p className="text-yellow-800 dark:text-yellow-200 flex-1">{message}</p>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

// Empty State Component
export const EmptyState: React.FC<{ 
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    {icon && <div className="mb-4 text-gray-400">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Medical Data Empty State
export const MedicalDataEmpty: React.FC<{ 
  type: 'patients' | 'doctors' | 'hospitals' | 'appointments';
  onAdd?: () => void;
}> = ({ type, onAdd }) => {
  const messages = {
    patients: {
      title: "No patients found",
      description: "No patient records match your current filters or search criteria.",
      action: "Add New Patient"
    },
    doctors: {
      title: "No doctors found",
      description: "No doctors are currently assigned to this department or search criteria.",
      action: "Add New Doctor"
    },
    hospitals: {
      title: "No hospitals found",
      description: "No hospitals match your current search criteria.",
      action: "Add New Hospital"
    },
    appointments: {
      title: "No appointments scheduled",
      description: "There are no appointments scheduled for the selected time period.",
      action: "Schedule Appointment"
    }
  };

  const message = messages[type];

  return (
    <EmptyState
      title={message.title}
      description={message.description}
      actionLabel={message.action}
      onAction={onAdd}
      icon={<div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <span className="text-2xl text-gray-400">📋</span>
      </div>}
    />
  );
};