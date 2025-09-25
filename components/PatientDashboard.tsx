import React, { useState, useMemo } from 'react';
import AIChat from './AIChat';
import ComplianceChart from './ComplianceChart';
// Fix: Import types from '../types' instead of '../constants' as they are not re-exported.
import type { Patient, Prescription } from '../types';
import DailyProgress from './DailyProgress';
import { MOCK_DOCTORS } from '../constants';

interface PatientDashboardProps {
    patient: Patient;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [medications, setMedications] = useState(patient.medications);
  const doctorName = MOCK_DOCTORS.find(d => d.id === patient.doctorId)?.name || 'Your Doctor';

  const handleToggleTaken = (medName: string, time: string) => {
    setMedications(prevMeds =>
      prevMeds.map(med => {
        if (med.name === medName) {
          return {
            ...med,
            schedule: med.schedule.map(s =>
              s.time === time ? { ...s, taken: !s.taken } : s
            ),
          };
        }
        return med;
      })
    );
  };

  const dailyProgress = useMemo(() => {
    const totalDoses = medications.reduce((acc, med) => acc + med.schedule.length, 0);
    const takenDoses = medications.reduce((acc, med) =>
        acc + med.schedule.filter(s => s.taken).length, 0);
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  }, [medications]);

  const prescriptionForAI: Prescription = {
    patientName: patient.name,
    doctorName: doctorName,
    medications: medications,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                 <h2 className="text-2xl font-bold">Today's Progress</h2>
                 <p className="text-gray-500 dark:text-gray-400">You're doing great! Keep it up.</p>
            </div>
            <DailyProgress progress={dailyProgress} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">My Medication Schedule</h2>
          <p className="mb-4 text-sm">Prescribed by: <span className="font-semibold">{doctorName}</span></p>
          <div className="space-y-4">
            {medications.map((med) => (
              <div key={med.name} className="p-4 border rounded-lg dark:border-gray-700">
                <h3 className="font-bold text-lg">{med.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({med.dosage})</span></h3>
                <p className="text-sm my-1 italic">{med.instructions}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {med.schedule.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleToggleTaken(med.name, s.time)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${s.taken 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                      {s.taken ? '✔ Taken' : 'Mark as Taken'} ({s.time})
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <h3 className="font-semibold mb-2">Need a reminder?</h3>
            <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">Remind via WhatsApp</button>
                <button className="px-3 py-1.5 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800">Remind via IVR Call</button>
            </div>
          </div>
        </div>
        
        <ComplianceChart />
      </div>
      <div className="lg:col-span-1">
        <AIChat prescription={prescriptionForAI} />
      </div>
    </div>
  );
};

export default PatientDashboard;