import React, { useState } from 'react';
import { MOCK_HOSPITALS, MOCK_DOCTORS, MOCK_PATIENTS } from '../constants';
import { HospitalIcon, DoctorIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

const ITEMS_PER_PAGE = 10;

const SuperAdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(MOCK_HOSPITALS.length / ITEMS_PER_PAGE);

  const paginatedHospitals = MOCK_HOSPITALS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
          <HospitalIcon className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Hospitals</p>
            <p className="text-2xl font-bold">{MOCK_HOSPITALS.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
          <DoctorIcon className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Doctors</p>
            <p className="text-2xl font-bold">{MOCK_DOCTORS.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
          <UserIcon className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Patients</p>
            <p className="text-2xl font-bold">{MOCK_PATIENTS.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Hospitals Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Doctors</th>
                <th className="p-3">Patients</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHospitals.map(hospital => (
                <tr key={hospital.id} className="border-b dark:border-gray-700 last:border-b-0">
                  <td className="p-3 font-semibold">{hospital.name}</td>
                  <td className="p-3">{hospital.location}</td>
                  <td className="p-3">{hospital.doctors.length}</td>
                  <td className="p-3">{hospital.patients.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center mt-4 space-x-4">
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-1 disabled:opacity-50">
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50">
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;