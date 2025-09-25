import React from 'react';
import type { User } from '../types';
import SuperAdminDashboard from './SuperAdminDashboard';
import HospitalAdminDashboard from './HospitalAdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import ThemeSwitcher from './ThemeSwitcher';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'hospital_admin':
        return <HospitalAdminDashboard hospital={user.data} />;
      case 'doctor':
        return <DoctorDashboard doctor={user.data} />;
      case 'patient':
        return <PatientDashboard patient={user.data} />;
      default:
        // This should not happen with proper type checking
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">MediMinder</h1>
            <div className="flex items-center space-x-4">
                <span className="hidden sm:inline">Welcome, {user.name}</span>
                <ThemeSwitcher />
                <button 
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
        <main>
            {renderDashboard()}
        </main>
    </div>
  );
};

export default Dashboard;