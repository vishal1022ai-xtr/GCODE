import React, { useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import type { User, UserRole } from './types';
import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_SUPER_ADMIN, MOCK_HOSPITAL_ADMIN } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, userId: string): boolean => {
    let foundUser: User | null = null;
    
    // Find the user in our new mock database
    switch(role) {
        case 'super_admin':
            if (userId === MOCK_SUPER_ADMIN.id) {
                foundUser = MOCK_SUPER_ADMIN;
            }
            break;
        case 'hospital_admin':
            // For demo, we only have one hospital admin
            if (userId === MOCK_HOSPITAL_ADMIN.id) {
                foundUser = MOCK_HOSPITAL_ADMIN;
            }
            break;
        case 'doctor':
            const doctor = MOCK_DOCTORS.find(d => d.id === userId);
            if (doctor) {
                foundUser = { role: 'doctor', id: doctor.id, name: doctor.name, data: doctor };
            }
            break;
        case 'patient':
            const patient = MOCK_PATIENTS.find(p => p.id === userId);
            if (patient) {
                foundUser = { role: 'patient', id: patient.id, name: patient.name, data: patient };
            }
            break;
    }

    if (foundUser) {
        setUser(foundUser);
        return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;