import React, { useState, useMemo } from 'react';
import { MOCK_HOSPITALS, MOCK_DOCTORS, MOCK_PATIENTS, DATABASE_STATS } from '../constants';
import { HospitalIcon, DoctorIcon, UserIcon, SearchIcon, FilterIcon, PlusIcon } from './Icons';
import { StatCard } from './ui/Cards';
import { DataTable, TableColumn } from './ui/DataTable';
import { SearchInput, FilterDropdown } from './ui/SearchAndFilter';
import { Breadcrumb } from './ui/Navigation';
import { MedicalDataEmpty } from './ui/ErrorStates';
import type { Hospital } from '../types';

const SuperAdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  // Get unique locations and types for filters
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(MOCK_HOSPITALS.map(h => h.location))];
    return uniqueLocations.map(location => ({
      label: location,
      value: location,
      count: MOCK_HOSPITALS.filter(h => h.location === location).length
    }));
  }, []);

  const types = useMemo(() => {
    const uniqueTypes = [...new Set(MOCK_HOSPITALS.map(h => h.type).filter(Boolean))];
    return uniqueTypes.map(type => ({
      label: type!,
      value: type!,
      count: MOCK_HOSPITALS.filter(h => h.type === type).length
    }));
  }, []);

  // Filter hospitals based on search and filters
  const filteredHospitals = useMemo(() => {
    return MOCK_HOSPITALS.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter.length === 0 || locationFilter.includes(hospital.location);
      const matchesType = typeFilter.length === 0 || (hospital.type && typeFilter.includes(hospital.type));
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, locationFilter, typeFilter]);

  // Table columns definition
  const columns: TableColumn<Hospital>[] = [
    {
      key: 'name',
      header: 'Hospital Name',
      accessor: (hospital) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <HospitalIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{hospital.name}</div>
            {hospital.type && (
              <div className="text-sm text-gray-500 dark:text-gray-400">{hospital.type}</div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      width: '300px'
    },
    {
      key: 'location',
      header: 'Location',
      accessor: (hospital) => (
        <div>
          <div className="text-gray-900 dark:text-gray-100">{hospital.location}</div>
          {hospital.address && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {hospital.address}
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: 'doctors',
      header: 'Doctors',
      accessor: (hospital) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {hospital.doctors.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Medical Staff</div>
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '120px'
    },
    {
      key: 'patients',
      header: 'Patients',
      accessor: (hospital) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {hospital.patients.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Active Patients</div>
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '120px'
    },
    {
      key: 'capacity',
      header: 'Bed Capacity',
      accessor: (hospital) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {hospital.bedCapacity || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Beds</div>
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '120px'
    },
    {
      key: 'established',
      header: 'Established',
      accessor: (hospital) => (
        <div className="text-gray-600 dark:text-gray-400">
          {hospital.established || 'Unknown'}
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '120px'
    }
  ];

  const handleHospitalClick = (hospital: Hospital) => {
    // TODO: Navigate to hospital details page
    console.log('View hospital details:', hospital.id);
  };

  const handleAddHospital = () => {
    // TODO: Open add hospital modal
    console.log('Add new hospital');
  };

  // Calculate additional stats
  const totalBedCapacity = MOCK_HOSPITALS.reduce((sum, hospital) => sum + (hospital.bedCapacity || 0), 0);
  const avgPatientsPerHospital = Math.round(MOCK_PATIENTS.length / MOCK_HOSPITALS.length);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'System Administration', current: true }
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            System Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of all hospitals, medical staff, and patients in the system
          </p>
        </div>
        <button
          onClick={handleAddHospital}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Hospital
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hospitals"
          value={MOCK_HOSPITALS.length}
          icon={<HospitalIcon className="w-8 h-8" />}
          color="red"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Medical Staff"
          value={MOCK_DOCTORS.length}
          icon={<DoctorIcon className="w-8 h-8" />}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Patients"
          value={MOCK_PATIENTS.length.toLocaleString()}
          icon={<UserIcon className="w-8 h-8" />}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Bed Capacity"
          value={totalBedCapacity.toLocaleString()}
          icon={<HospitalIcon className="w-8 h-8" />}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {avgPatientsPerHospital}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Average Patients per Hospital
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(MOCK_DOCTORS.length / MOCK_HOSPITALS.length)}
          </div>
          <div className="text-sm text-green-800 dark:text-green-300 font-medium">
            Average Doctors per Hospital
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(totalBedCapacity / MOCK_HOSPITALS.length)}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">
            Average Bed Capacity per Hospital
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search hospitals by name or location..."
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex gap-3">
            <FilterDropdown
              label="Location"
              options={locations}
              selectedValues={locationFilter}
              onChange={setLocationFilter}
              multiple
            />
            <FilterDropdown
              label="Type"
              options={types}
              selectedValues={typeFilter}
              onChange={setTypeFilter}
              multiple
            />
          </div>
        </div>
        {(searchQuery || locationFilter.length > 0 || typeFilter.length > 0) && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredHospitals.length} of {MOCK_HOSPITALS.length} hospitals
          </div>
        )}
      </div>

      {/* Hospitals Table */}
      <DataTable
        columns={columns}
        data={filteredHospitals}
        pagination={{ enabled: true, pageSize: 10, showPageInfo: true }}
        sorting={{ enabled: true, defaultSort: { key: 'name', direction: 'asc' } }}
        onRowClick={handleHospitalClick}
        emptyState={
          <MedicalDataEmpty
            type="hospitals"
            onAdd={handleAddHospital}
          />
        }
      />
    </div>
  );
};

export default SuperAdminDashboard;