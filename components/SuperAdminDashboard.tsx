import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_HOSPITALS, MOCK_DOCTORS, MOCK_PATIENTS, DATABASE_STATS } from '../constants';
import { HospitalIcon, DoctorIcon, UserIcon, SearchIcon, FilterIcon, PlusIcon, AlertIcon, TrendingUpIcon, BrainIcon } from './Icons';
import { StatCard } from './ui/Cards';
import { DataTable, TableColumn } from './ui/DataTable';
import { SearchInput, FilterDropdown } from './ui/SearchAndFilter';
import { Breadcrumb } from './ui/Navigation';
import { MedicalDataEmpty } from './ui/ErrorStates';
import type { Hospital } from '../types';

// Re-enabled with error handling
import { realtimeStateManager } from '../services/realtimeStateManager';
import { predictiveAnalytics } from '../services/predictiveAnalytics';
import { demoController } from '../services/demoController';

// Define types locally to avoid import issues
type AppState = {
  systemMetrics: {
    activeAlerts: number;
    complianceRate: number;
    pendingActions: number;
    averageRiskScore: number;
  };
  riskAlerts: any[];
  aiInsights: any[];
  lastUpdated: Date;
};

const SuperAdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [showRiskAlerts, setShowRiskAlerts] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [populationInsights, setPopulationInsights] = useState<any[]>([]);
  const [highRiskPatients, setHighRiskPatients] = useState<any[]>([]);
  const [serviceError, setServiceError] = useState<string | null>(null);
  
  // Mock data for demo - TODO: Replace with real services
  const mockAppState = {
    systemMetrics: {
      activeAlerts: 3,
      complianceRate: 85,
      pendingActions: 7,
      averageRiskScore: 45
    },
    riskAlerts: [
      {
        id: 'alert1',
        patientName: 'John Doe',
        riskLevel: 'High',
        primaryConcern: 'Multiple missed doses',
        riskScore: 75,
        timestamp: new Date()
      }
    ],
    aiInsights: [
      {
        id: 'insight1',
        title: 'AI Risk Prediction',
        description: 'Patients with similar profiles show 40% better outcomes with morning medication timing',
        confidence: 87,
        affectedEntities: 24,
        actionItems: ['Implement morning reminder system', 'Schedule educator sessions'],
        timestamp: new Date()
      }
    ],
    lastUpdated: new Date()
  };

  // Initialize services with error handling
  useEffect(() => {
    try {
      // Get initial state
      const initialState = realtimeStateManager.getState();
      setAppState(initialState);
      
      // Load predictive analytics data
      const insights = predictiveAnalytics.getPopulationInsights();
      const riskPatients = predictiveAnalytics.getHighRiskPatients();
      setPopulationInsights(insights);
      setHighRiskPatients(riskPatients);
      
      // Subscribe to real-time updates
      const unsubscribe = realtimeStateManager.subscribe((newState) => {
        setAppState(newState);
      });
      
      setServiceError(null);
      console.log('✅ Real-time services initialized successfully');
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error initializing real-time services:', error);
      setServiceError('Real-time features unavailable');
      // Fallback to mock data if services fail
      setAppState(mockAppState as AppState);
      setPopulationInsights([
        {
          id: 'pop1',
          title: 'Declining Adherence in Diabetes Patients (Mock)',
          description: '42 patients show concerning adherence patterns',
          affectedPatients: 42,
          confidence: 87
        }
      ]);
      setHighRiskPatients([
        { id: 'hr1', patientName: 'Jane Smith', riskScore: 85 },
        { id: 'hr2', patientName: 'Bob Wilson', riskScore: 78 }
      ]);
    }
  }, []);

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

  // Enhanced demo controls with real services
  const handleStartDemo = () => {
    try {
      if (demoController) {
        demoController.startScenario('hackathon_showcase');
        console.log('🎯 Demo: Starting Hackathon Showcase');
      }
    } catch (error) {
      console.error('Demo start failed:', error);
    }
  };

  const handleStopDemo = () => {
    try {
      if (demoController) {
        demoController.stopScenario();
        console.log('🛑 Demo: Stopping demo scenario');
      }
    } catch (error) {
      console.error('Demo stop failed:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    try {
      if (demoController) {
        switch (action) {
          case 'risk_alert':
            demoController.quickActions.triggerHighRiskAlert();
            break;
          case 'ai_insight':
            demoController.quickActions.triggerAIInsight();
            break;
          case 'medication_crisis':
            demoController.quickActions.triggerMedication('missed');
            break;
        }
        console.log(`⚡ Demo: Triggered ${action}`);
      }
    } catch (error) {
      console.error(`Demo action ${action} failed:`, error);
    }
  };

  // Calculate additional stats
  const totalBedCapacity = MOCK_HOSPITALS.reduce((sum, hospital) => sum + (hospital.bedCapacity || 0), 0);
  const avgPatientsPerHospital = Math.round(MOCK_PATIENTS.length / MOCK_HOSPITALS.length);
  
  // Real-time metrics (mock)
  const criticalAlerts = mockAppState.riskAlerts.filter(alert => alert.riskLevel === 'Critical').length;
  const recentAIInsights = mockAppState.aiInsights.length;

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

      {/* Demo Controls */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🎯 Hackathon Demo Controls</h2>
            <p className="text-blue-100">Showcase real-time AI-powered healthcare insights</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleStartDemo}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors"
            >
              ▶️ Start Demo
            </button>
            <button
              onClick={handleStopDemo}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
            >
              ⏹️ Stop Demo
            </button>
            <button
              onClick={() => handleQuickAction('risk_alert')}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm transition-colors"
            >
              🚨 Risk Alert
            </button>
            <button
              onClick={() => handleQuickAction('ai_insight')}
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm transition-colors"
            >
              🧠 AI Insight
            </button>
            <button
              onClick={() => handleQuickAction('medication_crisis')}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm transition-colors"
            >
              💊 Med Crisis
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Alerts Banner */}
      {criticalAlerts > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertIcon className="w-6 h-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                🚨 {criticalAlerts} Critical Patient Alert{criticalAlerts > 1 ? 's' : ''}
              </h3>
              <p className="text-red-600 dark:text-red-300">Immediate attention required</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid with Real-time Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hospitals"
          value={MOCK_HOSPITALS.length}
          icon={<HospitalIcon className="w-8 h-8" />}
          color="red"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Alerts"
          value={mockAppState.systemMetrics.activeAlerts}
          icon={<AlertIcon className="w-8 h-8" />}
          color="orange"
          trend={{ value: mockAppState.systemMetrics.activeAlerts > 5 ? -15 : 8, isPositive: mockAppState.systemMetrics.activeAlerts <= 5 }}
        />
        <StatCard
          title="AI Insights"
          value={recentAIInsights}
          icon={<BrainIcon className="w-8 h-8" />}
          color="purple"
          trend={{ value: 25, isPositive: true }}
        />
        <StatCard
          title="Compliance Rate"
          value={`${mockAppState.systemMetrics.complianceRate}%`}
          icon={<TrendingUpIcon className="w-8 h-8" />}
          color="green"
          trend={{ value: mockAppState.systemMetrics.complianceRate > 80 ? 12 : -8, isPositive: mockAppState.systemMetrics.complianceRate > 80 }}
        />
      </div>

      {/* Real-time Dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Alerts Panel */}
        {showRiskAlerts && mockAppState.riskAlerts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <AlertIcon className="w-6 h-6 text-red-500 mr-2" />
                Risk Alerts ({mockAppState.riskAlerts.length})
              </h3>
              <button
                onClick={() => setShowRiskAlerts(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockAppState.riskAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.riskLevel === 'Critical'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-400'
                      : alert.riskLevel === 'High'
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.patientName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {alert.primaryConcern}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Risk Score: {Math.round(alert.riskScore)}/100
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.riskLevel === 'Critical'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : alert.riskLevel === 'High'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {alert.riskLevel}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights Panel */}
        {showAIInsights && mockAppState.aiInsights.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <BrainIcon className="w-6 h-6 text-purple-500 mr-2" />
                AI Insights ({mockAppState.aiInsights.length})
              </h3>
              <button
                onClick={() => setShowAIInsights(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {mockAppState.aiInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300">
                      {insight.title}
                    </h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {Math.round(insight.confidence)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {insight.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    <p>Affects {insight.affectedEntities} entities</p>
                    <p className="mt-1">{new Date(insight.timestamp).toLocaleString()}</p>
                  </div>
                  {insight.actionItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Action Items:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {insight.actionItems.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-500 mr-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Population Insights */}
      {populationInsights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUpIcon className="w-6 h-6 text-green-500 mr-2" />
            Population Health Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {populationInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">{insight.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {insight.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{insight.affectedPatients} patients</span>
                  <span>{insight.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {mockAppState.systemMetrics.averageRiskScore}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Average Risk Score
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {mockAppState.systemMetrics.pendingActions}
          </div>
          <div className="text-sm text-green-800 dark:text-green-300 font-medium">
            Pending Care Actions
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {highRiskPatients.length}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">
            High-Risk Patients
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {Math.round(totalBedCapacity / MOCK_HOSPITALS.length)}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300 font-medium">
            Avg Bed Capacity
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

      {/* Hospitals Table with Enhanced Data */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold">Hospital Network Overview</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time monitoring of {filteredHospitals.length} healthcare facilities
          </p>
        </div>
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
      {/* Real-time Status Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🔄 Last updated: {mockAppState.lastUpdated.toLocaleTimeString()} • 
          📊 3 notifications • 
          🏥 {MOCK_HOSPITALS.length} hospitals monitored • 
          👥 {MOCK_PATIENTS.length.toLocaleString()} patients tracked
        </p>
        <div className="mt-2 flex justify-center items-center space-x-4 text-xs">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            Real-time monitoring active
          </span>
          <span className="flex items-center">
            <BrainIcon className="w-3 h-3 text-purple-500 mr-1" />
            AI insights enabled
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;