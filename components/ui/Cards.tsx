import React from 'react';
import { LoadingSpinner } from './LoadingStates';

// Base Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  padding = "md",
  shadow = "md" 
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg"
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}>
      {children}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  isLoading = false,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500'
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-4">
        {icon && (
          <div className={`w-12 h-12 ${colorClasses[color]} flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Patient Card Component
interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    condition?: string;
    lastVisit: string;
    compliance: string;
    complianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant';
  };
  onClick?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const complianceColors = {
    'Compliant': 'text-green-600 bg-green-50 dark:bg-green-900/20',
    'Partial': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    'Non-Compliant': 'text-red-600 bg-red-50 dark:bg-red-900/20'
  };

  return (
    <Card className={`transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Age: {patient.age}</p>
            {patient.condition && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{patient.condition}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${complianceColors[patient.complianceStatus]}`}>
            {patient.compliance}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last visit: {patient.lastVisit}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Doctor Card Component
interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    experience?: number;
    rating?: number;
    consultationFee?: number;
  };
  onClick?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <Card className={`transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`} onClick={onClick}>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <span className="text-green-600 dark:text-green-400 font-semibold text-xl">
            {doctor.name.split(' ').slice(-1)[0][0]}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{doctor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
          {doctor.experience && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{doctor.experience} years experience</p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            {doctor.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{doctor.rating}</span>
              </div>
            )}
            {doctor.consultationFee && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ₹{doctor.consultationFee}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  isLoading = false,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10',
    green: 'border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/10',
    yellow: 'border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/10',
    red: 'border-red-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10',
    purple: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10'
  };

  return (
    <Card 
      className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {isLoading ? <LoadingSpinner size="md" /> : icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};