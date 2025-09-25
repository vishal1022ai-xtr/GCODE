import React, { useState } from 'react';
import type { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, userId: string) => boolean;
}

const DEMO_CREDENTIALS = {
    patient: 'patient1',
    doctor: 'doctor1',
    hospital_admin: 'hospitaladmin1',
    super_admin: 'superadmin',
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('patient');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('password'); // Pre-fill for demo
  const [error, setError] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setUserId(''); // Clear user ID when role changes
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError('Please enter both User ID and Password.');
      return;
    }
    
    const success = onLogin(role, userId);
    
    if (!success) {
      setError(`User ID "${userId}" not found for the selected role.`);
    } else {
      setError('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Log in to your MediMinder account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              I am a
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital_admin">Hospital Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={`e.g., ${DEMO_CREDENTIALS[role]}`}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              required
            />
             <p className="text-xs text-gray-500 mt-1">
                For demo, try: <span className="font-mono">{DEMO_CREDENTIALS[role]}</span>, or any <span className="font-mono">{role + '[1-100]'}</span>
             </p>
          </div>
          <div>
            <label htmlFor="password"
                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              required
            />
             <p className="text-xs text-gray-500 mt-1">For demo, any password will work.</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;