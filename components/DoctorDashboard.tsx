import React from 'react';
import { MOCK_PATIENTS } from '../constants';
import type { Doctor, Patient } from '../types';
import CompliancePieChart from './CompliancePieChart';

interface DoctorDashboardProps {
    doctor: Doctor;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor }) => {
  const myPatients = MOCK_PATIENTS.filter(p => p.doctorId === doctor.id);

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
       <p>Welcome, {doctor.name}</p>
       
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
           <CompliancePieChart patients={myPatients} />
       </div>
       
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">My Patients</h2>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="border-b dark:border-gray-700">
                    <th className="p-3">Name</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Last Visit</th>
                    <th className="p-3">Compliance</th>
                    <th className="p-3">Status</th>
                </tr>
                </thead>
                <tbody>
                {myPatients.map(patient => (
                    <tr key={patient.id} className="border-b dark:border-gray-700 last:border-b-0">
                        <td className="p-3 font-semibold">{patient.name}</td>
                        <td className="p-3">{patient.age}</td>
                        <td className="p-3">{patient.lastVisit}</td>
                        <td className="p-3">{patient.compliance}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                patient.complianceStatus === 'Compliant' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                patient.complianceStatus === 'Partial' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                                {patient.complianceStatus}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
  );
};

export default DoctorDashboard;