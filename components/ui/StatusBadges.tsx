import React from 'react';
import type { ComplianceStatus } from '../../types';

// Base Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md' 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const variantClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Compliance Status Badge
export const ComplianceBadge: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
  const variants = {
    'Compliant': 'success',
    'Partial': 'warning',
    'Non-Compliant': 'danger'
  } as const;

  return (
    <Badge variant={variants[status]}>
      {status}
    </Badge>
  );
};

// Priority Badge
export const PriorityBadge: React.FC<{ priority: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  const variants = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  } as const;

  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  return (
    <Badge variant={variants[priority]}>
      {labels[priority]}
    </Badge>
  );
};

// Appointment Status Badge
export const AppointmentStatusBadge: React.FC<{ 
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' 
}> = ({ status }) => {
  const variants = {
    scheduled: 'info',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'danger',
    'no-show': 'warning'
  } as const;

  const labels = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'no-show': 'No Show'
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

// Medical Condition Severity Badge
export const SeverityBadge: React.FC<{ severity: 'mild' | 'moderate' | 'severe' | 'critical' }> = ({ 
  severity 
}) => {
  const variants = {
    mild: 'info',
    moderate: 'warning',
    severe: 'warning',
    critical: 'danger'
  } as const;

  const labels = {
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    critical: 'Critical'
  };

  return (
    <Badge variant={variants[severity]}>
      {labels[severity]}
    </Badge>
  );
};

// Online Status Badge
export const OnlineStatusBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
    <span className={`text-sm ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  </div>
);

// Medication Status Badge
export const MedicationStatusBadge: React.FC<{ 
  status: 'taken' | 'missed' | 'pending' | 'skipped' 
}> = ({ status }) => {
  const variants = {
    taken: 'success',
    missed: 'danger',
    pending: 'warning',
    skipped: 'neutral'
  } as const;

  const labels = {
    taken: 'Taken',
    missed: 'Missed',
    pending: 'Pending',
    skipped: 'Skipped'
  };

  return (
    <Badge variant={variants[status]} size="sm">
      {labels[status]}
    </Badge>
  );
};

// Department Badge
export const DepartmentBadge: React.FC<{ department: string }> = ({ department }) => (
  <Badge variant="info" size="sm">
    {department}
  </Badge>
);