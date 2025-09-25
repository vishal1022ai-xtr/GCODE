import { mockEventBus, type RealTimeEvent } from './mockEventBus';
import { predictiveAnalytics, type RiskAssessment, type PopulationInsight } from './predictiveAnalytics';
import { PATIENTS, DOCTORS, HOSPITALS } from '../database/mockDatabase';

export interface AppState {
  notifications: NotificationItem[];
  riskAlerts: RiskAlert[];
  aiInsights: AIInsight[];
  patientUpdates: PatientUpdate[];
  careActions: CareAction[];
  systemMetrics: SystemMetrics;
  lastUpdated: Date;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  urgent: boolean;
  userId?: string; // For user-specific notifications
  actionable: boolean;
  read: boolean;
}

export interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  primaryConcern: string;
  recommendedAction: string;
  doctorId: string;
  hospitalId: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  affectedEntities: number; // patients, doctors, hospitals affected
  actionItems: string[];
  timestamp: Date;
  implemented: boolean;
}

export interface PatientUpdate {
  id: string;
  patientId: string;
  patientName: string;
  updateType: 'medication_taken' | 'medication_missed' | 'status_change' | 'appointment';
  details: string;
  impact: string;
  timestamp: Date;
  requiresAction: boolean;
}

export interface CareAction {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo: string; // doctor or nurse ID
  patientId?: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedTime: number; // minutes
  category: 'medication' | 'follow_up' | 'monitoring' | 'education';
}

export interface SystemMetrics {
  totalPatients: number;
  activeAlerts: number;
  complianceRate: number;
  averageRiskScore: number;
  aiInsightCount: number;
  pendingActions: number;
  lastDataRefresh: Date;
}

// State change listeners
export type StateChangeListener = (newState: AppState) => void;

class RealtimeStateManager {
  private state: AppState;
  private listeners: Set<StateChangeListener> = new Set();
  private notificationId = 0;

  constructor() {
    this.state = this.initializeState();
    this.setupEventListeners();
  }

  private initializeState(): AppState {
    return {
      notifications: [],
      riskAlerts: [],
      aiInsights: [],
      patientUpdates: [],
      careActions: this.generateInitialCareActions(),
      systemMetrics: this.calculateSystemMetrics(),
      lastUpdated: new Date()
    };
  }

  private setupEventListeners(): void {
    // Subscribe to all event bus events
    mockEventBus.subscribe('all', (event: RealTimeEvent) => {
      this.handleRealTimeEvent(event);
    });
  }

  private handleRealTimeEvent(event: RealTimeEvent): void {
    const updatedState = { ...this.state };
    updatedState.lastUpdated = new Date();

    switch (event.type) {
      case 'patient_risk_change':
        this.handlePatientRiskChange(event, updatedState);
        break;
      case 'medication_missed':
      case 'medication_taken':
        this.handleMedicationEvent(event, updatedState);
        break;
      case 'ai_insight_generated':
        this.handleAIInsightEvent(event, updatedState);
        break;
      case 'compliance_alert':
        this.handleComplianceAlert(event, updatedState);
        break;
      default:
        this.handleGenericEvent(event, updatedState);
    }

    // Update system metrics
    updatedState.systemMetrics = this.calculateSystemMetrics(updatedState);
    
    this.setState(updatedState);
  }

  private handlePatientRiskChange(event: RealTimeEvent, state: AppState): void {
    const { data } = event;
    
    // Add risk alert
    const riskAlert: RiskAlert = {
      id: `risk_${event.id}`,
      patientId: data.patientId,
      patientName: data.patientName,
      riskLevel: data.newRiskLevel,
      riskScore: this.getRiskScoreFromLevel(data.newRiskLevel),
      primaryConcern: data.factors[0] || 'General compliance concern',
      recommendedAction: data.recommendedActions[0] || 'Review patient status',
      doctorId: data.doctorId,
      hospitalId: data.hospitalId,
      timestamp: event.timestamp,
      acknowledged: false
    };

    state.riskAlerts.unshift(riskAlert);
    
    // Keep only latest 20 risk alerts
    if (state.riskAlerts.length > 20) {
      state.riskAlerts = state.riskAlerts.slice(0, 20);
    }

    // Add notification
    this.addNotification(state, {
      type: event.severity === 'critical' ? 'error' : 'warning',
      title: 'Patient Risk Alert',
      message: `${data.patientName} risk level changed to ${data.newRiskLevel}`,
      urgent: event.severity === 'critical',
      actionable: true
    });

    // Generate care action if high risk
    if (['High', 'Critical'].includes(data.newRiskLevel)) {
      const careAction: CareAction = {
        id: `action_${Date.now()}`,
        title: `Review High-Risk Patient: ${data.patientName}`,
        description: `Patient risk elevated due to: ${data.factors.join(', ')}`,
        priority: data.newRiskLevel === 'Critical' ? 'Urgent' : 'High',
        assignedTo: data.doctorId,
        patientId: data.patientId,
        dueDate: new Date(Date.now() + (data.newRiskLevel === 'Critical' ? 2 : 24) * 60 * 60 * 1000),
        status: 'pending',
        estimatedTime: 30,
        category: 'monitoring'
      };
      
      state.careActions.unshift(careAction);
    }
  }

  private handleMedicationEvent(event: RealTimeEvent, state: AppState): void {
    const { data } = event;
    
    const patientUpdate: PatientUpdate = {
      id: `update_${event.id}`,
      patientId: data.patientId,
      patientName: data.patientName,
      updateType: event.type as 'medication_taken' | 'medication_missed',
      details: `${data.medicationName} at ${data.scheduledTime}`,
      impact: data.impact,
      timestamp: event.timestamp,
      requiresAction: event.type === 'medication_missed'
    };

    state.patientUpdates.unshift(patientUpdate);
    
    // Keep only latest 50 updates
    if (state.patientUpdates.length > 50) {
      state.patientUpdates = state.patientUpdates.slice(0, 50);
    }

    // Add notification for missed medications
    if (event.type === 'medication_missed') {
      this.addNotification(state, {
        type: 'warning',
        title: 'Medication Missed',
        message: `${data.patientName} missed ${data.medicationName}`,
        urgent: false,
        actionable: true
      });
    }
  }

  private handleAIInsightEvent(event: RealTimeEvent, state: AppState): void {
    const { data } = event;
    
    const aiInsight: AIInsight = {
      id: `insight_${event.id}`,
      title: 'AI-Generated Insight',
      description: data.insight,
      category: data.category,
      confidence: data.confidence,
      impact: this.getImpactFromConfidence(data.confidence),
      affectedEntities: data.affectedPatients,
      actionItems: data.actionableSteps,
      timestamp: event.timestamp,
      implemented: false
    };

    state.aiInsights.unshift(aiInsight);
    
    // Keep only latest 15 insights
    if (state.aiInsights.length > 15) {
      state.aiInsights = state.aiInsights.slice(0, 15);
    }

    // Add notification for high-confidence insights
    if (data.confidence >= 80) {
      this.addNotification(state, {
        type: 'info',
        title: 'AI Insight',
        message: data.insight.substring(0, 100) + (data.insight.length > 100 ? '...' : ''),
        urgent: false,
        actionable: true
      });
    }
  }

  private handleComplianceAlert(event: RealTimeEvent, state: AppState): void {
    const { data } = event;
    
    this.addNotification(state, {
      type: data.complianceRate < 70 ? 'error' : 'warning',
      title: 'Compliance Alert',
      message: `Overall compliance rate: ${data.complianceRate}% (${data.criticalCases} critical cases)`,
      urgent: data.complianceRate < 60,
      actionable: true
    });
  }

  private handleGenericEvent(event: RealTimeEvent, state: AppState): void {
    this.addNotification(state, {
      type: 'info',
      title: 'System Update',
      message: event.data.message || `${event.type} event occurred`,
      urgent: false,
      actionable: false
    });
  }

  private addNotification(state: AppState, notification: Partial<NotificationItem>): void {
    this.notificationId++;
    
    const fullNotification: NotificationItem = {
      id: `notification_${this.notificationId}`,
      type: notification.type || 'info',
      title: notification.title || 'System Notification',
      message: notification.message || '',
      timestamp: new Date(),
      urgent: notification.urgent || false,
      userId: notification.userId,
      actionable: notification.actionable || false,
      read: false
    };

    state.notifications.unshift(fullNotification);
    
    // Keep only latest 30 notifications
    if (state.notifications.length > 30) {
      state.notifications = state.notifications.slice(0, 30);
    }
  }

  private getRiskScoreFromLevel(level: string): number {
    switch (level) {
      case 'Critical': return 85 + Math.random() * 15;
      case 'High': return 60 + Math.random() * 25;
      case 'Medium': return 30 + Math.random() * 30;
      case 'Low': return Math.random() * 30;
      default: return 0;
    }
  }

  private getImpactFromConfidence(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 85) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
  }

  private calculateSystemMetrics(state?: AppState): SystemMetrics {
    const currentState = state || this.state;
    
    return {
      totalPatients: PATIENTS.length,
      activeAlerts: currentState.riskAlerts.filter(alert => !alert.acknowledged).length,
      complianceRate: this.calculateOverallComplianceRate(),
      averageRiskScore: this.calculateAverageRiskScore(),
      aiInsightCount: currentState.aiInsights.length,
      pendingActions: currentState.careActions.filter(action => action.status === 'pending').length,
      lastDataRefresh: new Date()
    };
  }

  private calculateOverallComplianceRate(): number {
    const compliantPatients = PATIENTS.filter(p => p.complianceStatus === 'Compliant').length;
    return Math.round((compliantPatients / PATIENTS.length) * 100);
  }

  private calculateAverageRiskScore(): number {
    const riskAssessments = predictiveAnalytics.getAllRiskAssessments();
    if (riskAssessments.length === 0) return 0;
    
    const totalScore = riskAssessments.reduce((sum, assessment) => sum + assessment.riskScore, 0);
    return Math.round(totalScore / riskAssessments.length);
  }

  private generateInitialCareActions(): CareAction[] {
    const actions: CareAction[] = [];
    
    // Generate some sample care actions for demo
    const sampleActions = [
      {
        title: 'Review Medication Adherence - John Smith',
        description: 'Patient has missed 3 doses in the past week',
        priority: 'High' as const,
        category: 'medication' as const,
        estimatedTime: 20
      },
      {
        title: 'Schedule Follow-up Call - Mary Johnson',
        description: 'Post-discharge medication review needed',
        priority: 'Medium' as const,
        category: 'follow_up' as const,
        estimatedTime: 15
      },
      {
        title: 'Patient Education Session - Robert Brown',
        description: 'Diabetes medication management training',
        priority: 'Medium' as const,
        category: 'education' as const,
        estimatedTime: 45
      }
    ];

    sampleActions.forEach((action, index) => {
      actions.push({
        id: `initial_action_${index}`,
        ...action,
        assignedTo: `doctor${Math.floor(Math.random() * 10) + 1}`,
        patientId: `patient${Math.floor(Math.random() * 50) + 1}`,
        dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000),
        status: 'pending'
      });
    });

    return actions;
  }

  // Public methods
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  private setState(newState: AppState): void {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in state change listener:', error);
      }
    });
  }

  // Action methods
  acknowledgeRiskAlert(alertId: string): void {
    const updatedState = { ...this.state };
    const alert = updatedState.riskAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      updatedState.lastUpdated = new Date();
      this.setState(updatedState);
    }
  }

  markNotificationAsRead(notificationId: string): void {
    const updatedState = { ...this.state };
    const notification = updatedState.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      updatedState.lastUpdated = new Date();
      this.setState(updatedState);
    }
  }

  updateCareActionStatus(actionId: string, status: CareAction['status']): void {
    const updatedState = { ...this.state };
    const action = updatedState.careActions.find(a => a.id === actionId);
    if (action) {
      action.status = status;
      updatedState.lastUpdated = new Date();
      this.setState(updatedState);
    }
  }

  // Utility methods for demo
  clearAllNotifications(): void {
    const updatedState = { ...this.state };
    updatedState.notifications = [];
    updatedState.lastUpdated = new Date();
    this.setState(updatedState);
  }

  triggerDemoScenario(scenario: 'high_risk_patient' | 'medication_crisis' | 'ai_insights'): void {
    switch (scenario) {
      case 'high_risk_patient':
        mockEventBus.triggerPatientRiskEvent('patient1', 'critical');
        break;
      case 'medication_crisis':
        mockEventBus.triggerMedicationEvent('patient2', 'medication_missed');
        setTimeout(() => mockEventBus.triggerMedicationEvent('patient3', 'medication_missed'), 2000);
        break;
      case 'ai_insights':
        mockEventBus.triggerAIInsight('prediction');
        setTimeout(() => mockEventBus.triggerAIInsight('recommendation'), 3000);
        break;
    }
  }
}

// Export singleton instance
export const realtimeStateManager = new RealtimeStateManager();