import React, { useState, useMemo } from 'react';
import AIChat from './AIChat';
import ComplianceChart from './ComplianceChart';
import type { Patient, Prescription } from '../types';
import DailyProgress from './DailyProgress';
import { MOCK_DOCTORS } from '../constants';
import { StatCard, Card } from './ui/Cards';
import { MedicationStatusBadge, ComplianceBadge } from './ui/StatusBadges';
import { Breadcrumb, TabNavigation } from './ui/Navigation';
import { CheckIcon, ClockIcon, PillIcon, CalendarIcon } from './Icons';
import { WarningMessage } from './ui/ErrorStates';

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

  const doctor = MOCK_DOCTORS.find(d => d.id === patient.doctorId);
  const todaysMedications = medications.filter(med => med.schedule.length > 0);
  const missedDoses = medications.flatMap(med => 
    med.schedule.filter(s => !s.taken).map(s => ({ medication: med.name, time: s.time }))
  );
  
  const upcomingDoses = medications.flatMap(med =>
    med.schedule.slice(0, 2).map(s => ({ medication: med.name, time: s.time, taken: s.taken }))
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'medications', label: 'Medications', count: medications.length },
    { id: 'history', label: 'History' },
    { id: 'reports', label: 'Reports' }
  ];

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'My Health Dashboard', current: true }
        ]}
      />

      {/* Patient Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome, {patient.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Age: {patient.age} • {patient.gender || 'N/A'} • Blood Group: {patient.bloodGroup || 'N/A'}
              </p>
              {doctor && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Primary Care: {doctor.name} ({doctor.specialty})
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <ComplianceBadge status={patient.complianceStatus} />
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Overall Compliance: {patient.compliance}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Progress"
          value={`${dailyProgress}%`}
          icon={<CheckIcon className="w-8 h-8" />}
          color="green"
          trend={{ value: dailyProgress >= 80 ? 5 : -3, isPositive: dailyProgress >= 80 }}
        />
        <StatCard
          title="Active Medications"
          value={medications.length}
          icon={<PillIcon className="w-8 h-8" />}
          color="blue"
        />
        <StatCard
          title="Missed Doses"
          value={missedDoses.length}
          icon={<ClockIcon className="w-8 h-8" />}
          color="red"
        />
        <StatCard
          title="Next Appointment"
          value={patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}
          icon={<CalendarIcon className="w-8 h-8" />}
          color="purple"
        />
      </div>

      {/* Missed Doses Warning */}
      {missedDoses.length > 0 && (
        <WarningMessage
          message={`You have ${missedDoses.length} missed doses. Please review your medication schedule and mark them as taken if applicable.`}
          dismissible
        />
      )}

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Progress */}
            <Card>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Today's Progress</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {dailyProgress >= 80 ? "You're doing great! Keep it up." : "Let's improve your medication adherence."}
                  </p>
                </div>
                <DailyProgress progress={dailyProgress} />
              </div>
            </Card>

            {/* Upcoming Doses */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upcoming Doses Today
              </h3>
              <div className="space-y-3">
                {upcomingDoses.slice(0, 4).map((dose, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{dose.medication}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{dose.time}</div>
                    </div>
                    <MedicationStatusBadge status={dose.taken ? 'taken' : 'pending'} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Compliance Chart */}
            <ComplianceChart />
          </div>
          
          <div className="lg:col-span-1">
            <AIChat prescription={prescriptionForAI} />
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Medication Schedule</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prescribed by: <span className="font-semibold">{doctorName}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {med.name}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                          ({med.dosage})
                        </span>
                      </h3>
                      {med.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full mt-1">
                          {med.category}
                        </span>
                      )}
                      {med.condition && (
                        <span className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full mt-1 ml-1">
                          For: {med.condition}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                    {med.instructions}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {med.schedule.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleToggleTaken(med.name, s.time)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                          s.taken 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {s.taken ? (
                          <span className="flex items-center">
                            <CheckIcon className="w-4 h-4 mr-1" /> Taken at {s.time}
                          </span>
                        ) : (
                          <span>Mark as Taken ({s.time})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reminder Options */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Medication Reminders</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  📱 WhatsApp Reminders
                </button>
                <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  📞 Voice Call Reminders
                </button>
                <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  📧 Email Reminders
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Medical History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive medical history and treatment timeline coming soon.
          </p>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Health Reports
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed health analytics and compliance reports coming soon.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PatientDashboard;