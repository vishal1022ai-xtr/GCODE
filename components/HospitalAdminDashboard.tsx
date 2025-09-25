import React from 'react';
import type { Hospital } from '../types';
import { DoctorIcon, UserIcon, DownloadIcon } from './Icons';

interface HospitalAdminDashboardProps {
    hospital: Hospital;
}

const HospitalAdminDashboard: React.FC<HospitalAdminDashboardProps> = ({ hospital }) => {
  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Hospital Admin: {hospital.name}</h1>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <DownloadIcon className="w-5 h-5" />
                <span>Download Compliance Report</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
                <DoctorIcon className="w-10 h-10 text-blue-500" />
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Doctors</p>
                    <p className="text-2xl font-bold">{hospital.doctors.length}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
                <UserIcon className="w-10 h-10 text-green-500" />
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Patients</p>
                    <p className="text-2xl font-bold">{hospital.patients.length}</p>
                </div>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Doctors Overview</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b dark:border-gray-700">
                        <th className="p-3">Name</th>
                        <th className="p-3">Specialty</th>
                        <th className="p-3">Patient Load</th>
                    </tr>
                    </thead>
                    <tbody>
                    {hospital.doctors.map(doctor => (
                        <tr key={doctor.id} className="border-b dark:border-gray-700 last:border-b-0">
                        <td className="p-3 font-semibold">{doctor.name}</td>
                        <td className="p-3">{doctor.specialty}</td>
                        <td className="p-3">{hospital.patients.filter(p => p.doctorId === doctor.id).length}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HospitalAdminDashboard;