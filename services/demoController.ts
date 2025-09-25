import { mockEventBus } from './mockEventBus';
import { realtimeStateManager } from './realtimeStateManager';
import { predictiveAnalytics } from './predictiveAnalytics';

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  steps: DemoStep[];
}

export interface DemoStep {
  delay: number; // seconds from scenario start
  action: () => void;
  description: string;
}

class DemoController {
  private activeScenario: string | null = null;
  private scenarioTimeouts: NodeJS.Timeout[] = [];
  
  private scenarios: DemoScenario[] = [
    {
      id: 'hackathon_showcase',
      name: 'Complete Hackathon Showcase',
      description: 'Full demo showing all features across all user roles',
      duration: 120,
      steps: [
        {
          delay: 0,
          action: () => {
            console.log('🎯 Demo: Starting Hackathon Showcase');
            this.startEventStream();
          },
          description: 'Start real-time event stream'
        },
        {
          delay: 5,
          action: () => {
            mockEventBus.triggerAIInsight('prediction');
            console.log('🤖 Demo: AI prediction generated');
          },
          description: 'Generate AI prediction insight'
        },
        {
          delay: 10,
          action: () => {
            mockEventBus.triggerPatientRiskEvent('patient15', 'high');
            console.log('⚠️ Demo: High-risk patient alert');
          },
          description: 'Trigger high-risk patient alert'
        },
        {
          delay: 18,
          action: () => {
            mockEventBus.triggerMedicationEvent('patient8', 'medication_missed');
            console.log('💊 Demo: Medication missed event');
          },
          description: 'Medication adherence issue'
        },
        {
          delay: 25,
          action: () => {
            mockEventBus.triggerAIInsight('recommendation');
            console.log('💡 Demo: AI recommendation generated');
          },
          description: 'Generate AI care recommendation'
        },
        {
          delay: 35,
          action: () => {
            mockEventBus.triggerPatientRiskEvent('patient22', 'critical');
            console.log('🚨 Demo: CRITICAL patient alert');
          },
          description: 'Critical patient risk escalation'
        },
        {
          delay: 45,
          action: () => {
            mockEventBus.triggerMedicationEvent('patient12', 'medication_taken');
            mockEventBus.triggerMedicationEvent('patient19', 'medication_taken');
            console.log('✅ Demo: Positive medication adherence');
          },
          description: 'Show positive medication adherence'
        },
        {
          delay: 55,
          action: () => {
            mockEventBus.triggerAIInsight('alert');
            console.log('📊 Demo: AI population insight');
          },
          description: 'Population-level AI insight'
        },
        {
          delay: 70,
          action: () => {
            realtimeStateManager.triggerDemoScenario('medication_crisis');
            console.log('🆘 Demo: Medication crisis scenario');
          },
          description: 'Multiple medication crisis events'
        },
        {
          delay: 85,
          action: () => {
            mockEventBus.triggerAIInsight('prediction');
            console.log('🔮 Demo: Final AI prediction');
          },
          description: 'Final predictive insight'
        }
      ]
    },
    {
      id: 'patient_crisis',
      name: 'Patient Crisis Response',
      description: 'Demonstrates rapid response to patient crisis',
      duration: 60,
      steps: [
        {
          delay: 0,
          action: () => {
            this.startEventStream();
            mockEventBus.triggerPatientRiskEvent('patient5', 'high');
          },
          description: 'Initial patient risk escalation'
        },
        {
          delay: 8,
          action: () => {
            mockEventBus.triggerMedicationEvent('patient5', 'medication_missed');
          },
          description: 'Patient misses critical medication'
        },
        {
          delay: 15,
          action: () => {
            mockEventBus.triggerPatientRiskEvent('patient5', 'critical');
            mockEventBus.triggerAIInsight('alert');
          },
          description: 'Risk escalates to critical, AI generates alert'
        },
        {
          delay: 25,
          action: () => {
            mockEventBus.triggerAIInsight('recommendation');
          },
          description: 'AI provides intervention recommendations'
        },
        {
          delay: 40,
          action: () => {
            mockEventBus.triggerMedicationEvent('patient5', 'medication_taken');
          },
          description: 'Patient takes medication after intervention'
        }
      ]
    },
    {
      id: 'ai_insights',
      name: 'AI Intelligence Showcase',
      description: 'Highlights AI-powered insights and predictions',
      duration: 45,
      steps: [
        {
          delay: 0,
          action: () => {
            this.startEventStream();
            mockEventBus.triggerAIInsight('prediction');
          },
          description: 'AI generates predictive insight'
        },
        {
          delay: 10,
          action: () => {
            mockEventBus.triggerAIInsight('recommendation');
          },
          description: 'AI suggests care optimization'
        },
        {
          delay: 20,
          action: () => {
            mockEventBus.triggerPatientRiskEvent('patient10', 'medium');
          },
          description: 'Risk change validates AI prediction'
        },
        {
          delay: 30,
          action: () => {
            mockEventBus.triggerAIInsight('alert');
          },
          description: 'AI identifies population trend'
        }
      ]
    }
  ];

  startScenario(scenarioId: string): boolean {
    if (this.activeScenario) {
      console.warn('Demo already running. Stop current demo first.');
      return false;
    }

    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      console.error(`Demo scenario '${scenarioId}' not found`);
      return false;
    }

    console.log(`🎬 Starting demo: ${scenario.name}`);
    this.activeScenario = scenarioId;

    // Schedule all steps
    scenario.steps.forEach(step => {
      const timeout = setTimeout(() => {
        try {
          step.action();
        } catch (error) {
          console.error(`Error executing demo step: ${step.description}`, error);
        }
      }, step.delay * 1000);

      this.scenarioTimeouts.push(timeout);
    });

    // Auto-stop after duration
    const stopTimeout = setTimeout(() => {
      this.stopScenario();
      console.log(`🎬 Demo '${scenario.name}' completed`);
    }, scenario.duration * 1000);

    this.scenarioTimeouts.push(stopTimeout);

    return true;
  }

  stopScenario(): void {
    if (!this.activeScenario) return;

    console.log('🛑 Stopping demo scenario');
    
    // Clear all timeouts
    this.scenarioTimeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    this.scenarioTimeouts = [];
    
    // Stop event stream
    this.stopEventStream();
    
    this.activeScenario = null;
  }

  private startEventStream(): void {
    if (!mockEventBus.isActive()) {
      mockEventBus.start();
      console.log('📡 Event stream started');
    }
  }

  private stopEventStream(): void {
    if (mockEventBus.isActive()) {
      mockEventBus.stop();
      console.log('📡 Event stream stopped');
    }
  }

  // Quick demo actions for manual testing
  quickActions = {
    triggerHighRiskAlert: () => {
      mockEventBus.triggerPatientRiskEvent('demo_patient', 'high');
      console.log('⚠️ Quick action: High-risk patient alert triggered');
    },
    
    triggerCriticalAlert: () => {
      mockEventBus.triggerPatientRiskEvent('demo_patient', 'critical');
      console.log('🚨 Quick action: Critical patient alert triggered');
    },
    
    triggerAIInsight: () => {
      mockEventBus.triggerAIInsight('prediction');
      console.log('🤖 Quick action: AI insight generated');
    },
    
    triggerMedication: (type: 'missed' | 'taken' = 'missed') => {
      mockEventBus.triggerMedicationEvent('demo_patient', 
        type === 'missed' ? 'medication_missed' : 'medication_taken');
      console.log(`💊 Quick action: Medication ${type} triggered`);
    },
    
    startBasicStream: () => {
      this.startEventStream();
      console.log('📡 Quick action: Basic event stream started');
    },
    
    stopBasicStream: () => {
      this.stopEventStream();
      console.log('📡 Quick action: Event stream stopped');
    }
  };

  // Get available scenarios
  getScenarios(): DemoScenario[] {
    return [...this.scenarios];
  }

  // Get current scenario status
  getStatus(): { active: boolean; scenario?: string } {
    return {
      active: this.activeScenario !== null,
      scenario: this.activeScenario || undefined
    };
  }

  // Demo state helpers for UI
  isDemoActive(): boolean {
    return this.activeScenario !== null;
  }

  getCurrentScenarioName(): string | null {
    if (!this.activeScenario) return null;
    const scenario = this.scenarios.find(s => s.id === this.activeScenario);
    return scenario?.name || null;
  }
}

// Export singleton instance
export const demoController = new DemoController();

// Add to window for console access during demos
if (typeof window !== 'undefined') {
  (window as any).demoController = demoController;
  console.log('🎮 Demo controller available at window.demoController');
  console.log('Quick actions available at demoController.quickActions');
}