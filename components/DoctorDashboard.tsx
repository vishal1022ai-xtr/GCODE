import React, { useState, useMemo } from 'react';
import { MOCK_PATIENTS } from '../constants';
import type { Doctor, Patient } from '../types';
import CompliancePieChart from './CompliancePieChart';
import { StatCard, PatientCard } from './ui/Cards';
import { DataTable, TableColumn } from './ui/DataTable';
import { SearchInput, FilterDropdown, QuickFilterChips } from './ui/SearchAndFilter';
import { Breadcrumb, TabNavigation } from './ui/Navigation';
import { ComplianceBadge } from './ui/StatusBadges';
import { UserIcon, CalendarIcon, PlusIcon } from './Icons';
import { MedicalDataEmpty } from './ui/ErrorStates';

interface DoctorDashboardProps {
    doctor: Doctor;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [complianceFilter, setComplianceFilter] = useState<string[]>([]);
  const [urgentFilter, setUrgentFilter] = useState('');
  
  const myPatients = MOCK_PATIENTS.filter(p => p.doctorId === doctor.id);

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return myPatients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (patient.medicalConditions && patient.medicalConditions.some(condition => 
                             condition.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCompliance = complianceFilter.length === 0 || complianceFilter.includes(patient.complianceStatus);
      
      return matchesSearch && matchesCompliance;
    });
  }, [myPatients, searchQuery, complianceFilter]);

  // Compliance statistics
  const complianceStats = useMemo(() => {
    const compliant = myPatients.filter(p => p.complianceStatus === 'Compliant').length;
    const partial = myPatients.filter(p => p.complianceStatus === 'Partial').length;
    const nonCompliant = myPatients.filter(p => p.complianceStatus === 'Non-Compliant').length;
    return { compliant, partial, nonCompliant, total: myPatients.length };
  }, [myPatients]);

  // Table columns
  const columns: TableColumn<Patient>[] = [
    {
      key: 'name',
      header: 'Patient',
      accessor: (patient) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Age: {patient.age} • {patient.gender || 'N/A'}</div>
            {patient.medicalConditions && patient.medicalConditions.length > 0 && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {patient.medicalConditions.slice(0, 2).join(', ')}
                {patient.medicalConditions.length > 2 && ' +' + (patient.medicalConditions.length - 2)}
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      width: '300px'
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      accessor: (patient) => (
        <div>
          <div className="text-gray-900 dark:text-gray-100">{patient.lastVisit}</div>
          {patient.nextAppointment && (
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Next: {patient.nextAppointment}
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: 'medications',
      header: 'Medications',
      accessor: (patient) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {patient.medications.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
        </div>
      ),
      align: 'center',
      width: '120px'
    },
    {
      key: 'compliance',
      header: 'Compliance',
      accessor: (patient) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {patient.compliance}
          </div>
          <ComplianceBadge status={patient.complianceStatus} />
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '140px'
    },
    {
      key: 'contact',
      header: 'Contact',
      accessor: (patient) => (
        <div>
          {patient.contactNumber && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {patient.contactNumber}
            </div>
          )}
          {patient.email && (
            <div className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-xs">
              {patient.email}
            </div>
          )}
        </div>
      ),
      width: '180px'
    }
  ];

  const handlePatientClick = (patient: Patient) => {
    console.log('View patient details:', patient.id);
  };

  const handleScheduleAppointment = () => {
    console.log('Schedule new appointment');
  };

  const complianceFilters = [
    { label: 'All Patients', value: '', active: complianceFilter.length === 0 },
    { label: 'Compliant', value: 'Compliant', active: complianceFilter.includes('Compliant') },
    { label: 'Partial', value: 'Partial', active: complianceFilter.includes('Partial') },
    { label: 'Non-Compliant', value: 'Non-Compliant', active: complianceFilter.includes('Non-Compliant') }
  ];

  const handleQuickFilterClick = (value: string) => {
    if (value === '') {
      setComplianceFilter([]);
    } else {
      setComplianceFilter(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  const tabs = [
    { id: 'overview', label: 'Patient Overview', count: myPatients.length },
    { id: 'appointments', label: 'Appointments', count: 12 },
    { id: 'reports', label: 'Medical Reports', count: 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Medical Practice', current: true }
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome, {doctor.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {doctor.specialty} • {doctor.yearsOfExperience || 'N/A'} years experience
          </p>
          {doctor.rating && (
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium ml-1">{doctor.rating}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">rating</span>
            </div>
          )}
        </div>
        <button
          onClick={handleScheduleAppointment}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Schedule Appointment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={myPatients.length}
          icon={<UserIcon className="w-8 h-8" />}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Compliant Patients"
          value={complianceStats.compliant}
          icon={<UserIcon className="w-8 h-8" />}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Needs Attention"
          value={complianceStats.nonCompliant}
          icon={<UserIcon className="w-8 h-8" />}
          color="red"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Avg Compliance"
          value={`${Math.round((complianceStats.compliant / complianceStats.total) * 100)}%`}
          icon={<UserIcon className="w-8 h-8" />}
          color="purple"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <>
          {/* Compliance Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <CompliancePieChart patients={myPatients} />
          </div>

          {/* Quick Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Quick Filters
            </h3>
            <QuickFilterChips
              filters={complianceFilters}
              onFilterClick={handleQuickFilterClick}
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 max-w-md">
                <SearchInput
                  placeholder="Search patients by name or condition..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                />
              </div>
            </div>
            {(searchQuery || complianceFilter.length > 0) && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPatients.length} of {myPatients.length} patients
              </div>
            )}
          </div>

          {/* Patients Table */}
          <DataTable
            columns={columns}
            data={filteredPatients}
            pagination={{ enabled: true, pageSize: 10, showPageInfo: true }}
            sorting={{ enabled: true, defaultSort: { key: 'name', direction: 'asc' } }}
            onRowClick={handlePatientClick}
            emptyState={
              <MedicalDataEmpty
                type="patients"
                onAdd={() => console.log('Add patient')}
              />
            }
          />
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Appointment Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced appointment scheduling and management features coming soon.
          </p>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Medical Reports
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive medical reporting and analytics dashboard coming soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;