import type { Patient, Doctor, Hospital } from '../types';

// Event types for the mock event bus
export interface RealTimeEvent {
  id: string;
  timestamp: Date;
  type: EventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: any;
}

export type EventType = 
  | 'medication_missed'
  | 'compliance_alert' 
  | 'patient_risk_change'
  | 'emergency_contact'
  | 'ai_insight_generated'
  | 'care_team_action'
  | 'medication_taken'
  | 'appointment_reminder'
  | 'vital_signs_alert';

export interface PatientRiskAlert extends RealTimeEvent {
  type: 'patient_risk_change';
  data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    hospitalId: string;
    oldRiskLevel: string;
    newRiskLevel: string;
    factors: string[];
    aiInsight: string;
    recommendedActions: string[];
  };
}

export interface MedicationEvent extends RealTimeEvent {
  type: 'medication_missed' | 'medication_taken';
  data: {
    patientId: string;
    patientName: string;
    medicationName: string;
    scheduledTime: string;
    actualTime?: string;
    impact: string;
  };
}

export interface AIInsightEvent extends RealTimeEvent {
  type: 'ai_insight_generated';
  data: {
    insight: string;
    category: 'prediction' | 'recommendation' | 'alert';
    affectedPatients: number;
    confidence: number;
    actionableSteps: string[];
  };
}

// Mock Event Bus Implementation
class MockEventBus {
  private subscribers: Map<EventType | 'all', Set<(event: RealTimeEvent) => void>> = new Map();
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private eventId = 0;

  // Sample data for generating realistic events
  private riskFactors = [
    'Multiple missed doses',
    'Medication interaction detected',
    'Recent hospitalization',
    'Complex medication regimen',
    'Age-related factors',
    'Comorbidity management',
    'Social determinants',
    'Economic barriers'
  ];

  private aiInsights = [
    'Patients with similar profiles show 40% better outcomes with morning medication timing',
    'Predictive analysis suggests intervention needed for 12 high-risk patients this week',
    'Medication adherence patterns indicate optimal reminder timing at 8 AM and 6 PM',
    'Risk stratification identifies 3 patients requiring immediate care coordination',
    'AI analysis reveals seasonal compliance patterns affecting elderly patients'
  ];

  private careActions = [
    'Schedule follow-up call',
    'Adjust medication timing',
    'Initiate care team huddle',
    'Send educational materials',
    'Coordinate with family members',
    'Review medication regimen',
    'Schedule in-person consultation'
  ];

  subscribe(eventType: EventType | 'all', callback: (event: RealTimeEvent) => void) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);
  }

  unsubscribe(eventType: EventType | 'all', callback: (event: RealTimeEvent) => void) {
    this.subscribers.get(eventType)?.delete(callback);
  }

  private emit(event: RealTimeEvent) {
    // Emit to specific event type subscribers
    this.subscribers.get(event.type)?.forEach(callback => callback(event));
    // Emit to 'all' subscribers
    this.subscribers.get('all')?.forEach(callback => callback(event));
  }

  // Generate realistic mock events
  private generateRandomEvent(): RealTimeEvent {
    const eventTypes: EventType[] = [
      'medication_missed',
      'patient_risk_change',
      'ai_insight_generated',
      'medication_taken',
      'compliance_alert'
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = this.getRandomSeverity();
    
    this.eventId++;

    switch (eventType) {
      case 'patient_risk_change':
        return this.generatePatientRiskEvent(severity);
      case 'medication_missed':
      case 'medication_taken':
        return this.generateMedicationEvent(eventType, severity);
      case 'ai_insight_generated':
        return this.generateAIInsightEvent(severity);
      case 'compliance_alert':
        return this.generateComplianceAlert(severity);
      default:
        return this.generateGenericEvent(eventType, severity);
    }
  }

  private generatePatientRiskEvent(severity: RealTimeEvent['severity']): PatientRiskAlert {
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
    const currentRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const newRisk = severity === 'critical' ? 'Critical' : 
                   severity === 'high' ? 'High' :
                   severity === 'medium' ? 'Medium' : 'Low';

    return {
      id: `event_${this.eventId}`,
      timestamp: new Date(),
      type: 'patient_risk_change',
      severity,
      data: {
        patientId: `patient${Math.floor(Math.random() * 100) + 1}`,
        patientName: `Patient ${Math.floor(Math.random() * 100) + 1}`,
        doctorId: `doctor${Math.floor(Math.random() * 50) + 1}`,
        hospitalId: `hospital${Math.floor(Math.random() * 10) + 1}`,
        oldRiskLevel: currentRisk,
        newRiskLevel: newRisk,
        factors: this.riskFactors.slice(0, Math.floor(Math.random() * 4) + 1),
        aiInsight: `AI analysis indicates ${newRisk.toLowerCase()} risk due to ${this.riskFactors[Math.floor(Math.random() * this.riskFactors.length)].toLowerCase()}`,
        recommendedActions: this.careActions.slice(0, Math.floor(Math.random() * 3) + 1)
      }
    };
  }

  private generateMedicationEvent(type: 'medication_missed' | 'medication_taken', severity: RealTimeEvent['severity']): MedicationEvent {
    const medications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine', 'Omeprazole'];
    const times = ['8:00 AM', '12:00 PM', '6:00 PM', '9:00 PM'];
    
    return {
      id: `event_${this.eventId}`,
      timestamp: new Date(),
      type,
      severity,
      data: {
        patientId: `patient${Math.floor(Math.random() * 100) + 1}`,
        patientName: `Patient ${Math.floor(Math.random() * 100) + 1}`,
        medicationName: medications[Math.floor(Math.random() * medications.length)],
        scheduledTime: times[Math.floor(Math.random() * times.length)],
        actualTime: type === 'medication_taken' ? new Date().toLocaleTimeString() : undefined,
        impact: type === 'medication_missed' ? 'May affect treatment effectiveness' : 'Positive adherence progress'
      }
    };
  }

  private generateAIInsightEvent(severity: RealTimeEvent['severity']): AIInsightEvent {
    return {
      id: `event_${this.eventId}`,
      timestamp: new Date(),
      type: 'ai_insight_generated',
      severity,
      data: {
        insight: this.aiInsights[Math.floor(Math.random() * this.aiInsights.length)],
        category: ['prediction', 'recommendation', 'alert'][Math.floor(Math.random() * 3)] as 'prediction' | 'recommendation' | 'alert',
        affectedPatients: Math.floor(Math.random() * 50) + 5,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        actionableSteps: this.careActions.slice(0, Math.floor(Math.random() * 4) + 2)
      }
    };
  }

  private generateComplianceAlert(severity: RealTimeEvent['severity']): RealTimeEvent {
    return {
      id: `event_${this.eventId}`,
      timestamp: new Date(),
      type: 'compliance_alert',
      severity,
      data: {
        type: 'weekly_summary',
        totalPatients: Math.floor(Math.random() * 100) + 50,
        complianceRate: Math.floor(Math.random() * 30) + 60, // 60-90%
        trendDirection: Math.random() > 0.5 ? 'up' : 'down',
        criticalCases: Math.floor(Math.random() * 10) + 1
      }
    };
  }

  private generateGenericEvent(type: EventType, severity: RealTimeEvent['severity']): RealTimeEvent {
    return {
      id: `event_${this.eventId}`,
      timestamp: new Date(),
      type,
      severity,
      data: {
        message: `Mock ${type} event generated`,
        details: `Severity: ${severity}`
      }
    };
  }

  private getRandomSeverity(): RealTimeEvent['severity'] {
    const severities: RealTimeEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // More low/medium events than critical
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return severities[i];
      }
    }
    return 'low';
  }

  // Control methods for demo
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Generate events every 3-8 seconds for demo purposes
    this.intervalId = setInterval(() => {
      this.emit(this.generateRandomEvent());
    }, Math.random() * 5000 + 3000);
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Manual event triggers for demo scripting
  triggerPatientRiskEvent(patientId: string, severity: RealTimeEvent['severity'] = 'high') {
    const event = this.generatePatientRiskEvent(severity);
    event.data.patientId = patientId;
    this.emit(event);
  }

  triggerAIInsight(category: 'prediction' | 'recommendation' | 'alert' = 'prediction') {
    const event = this.generateAIInsightEvent('medium');
    event.data.category = category;
    this.emit(event);
  }

  triggerMedicationEvent(patientId: string, type: 'medication_missed' | 'medication_taken' = 'medication_missed') {
    const event = this.generateMedicationEvent(type, type === 'medication_missed' ? 'medium' : 'low');
    event.data.patientId = patientId;
    this.emit(event);
  }

  // Get current status
  isActive() {
    return this.isRunning;
  }
}

// Export singleton instance
export const mockEventBus = new MockEventBus();