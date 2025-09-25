import type { Patient, Doctor, Hospital, ComplianceStatus } from '../types';
import { PATIENTS, DOCTORS, HOSPITALS } from '../database/mockDatabase';

export interface RiskAssessment {
  patientId: string;
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: RiskFactor[];
  predictions: Prediction[];
  recommendations: Recommendation[];
  lastUpdated: Date;
}

export interface RiskFactor {
  factor: string;
  impact: number; // 0-10
  description: string;
  category: 'medication' | 'behavioral' | 'clinical' | 'social';
}

export interface Prediction {
  type: 'adherence_drop' | 'hospitalization_risk' | 'medication_interaction' | 'care_gap';
  probability: number; // 0-100
  timeframe: string;
  description: string;
  confidence: number; // 0-100
}

export interface Recommendation {
  action: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: 'medication' | 'lifestyle' | 'monitoring' | 'care_coordination';
  description: string;
  expectedImpact: string;
}

export interface PopulationInsight {
  id: string;
  title: string;
  description: string;
  category: 'adherence' | 'outcomes' | 'risk_factors' | 'care_patterns';
  affectedPatients: number;
  confidence: number;
  actionableItems: string[];
  generatedAt: Date;
}

class PredictiveAnalytics {
  private riskAssessments = new Map<string, RiskAssessment>();
  private populationInsights: PopulationInsight[] = [];
  
  // Risk factor definitions
  private riskFactorTemplates = {
    medication: [
      { name: 'Complex Regimen', baseImpact: 7, description: 'Multiple medications with different schedules' },
      { name: 'Recent Medication Changes', baseImpact: 6, description: 'Medication adjustments in last 30 days' },
      { name: 'Missed Doses Pattern', baseImpact: 8, description: 'Consistent pattern of missed medications' },
      { name: 'Drug Interactions', baseImpact: 9, description: 'Potential interactions between prescribed medications' }
    ],
    behavioral: [
      { name: 'Low Health Literacy', baseImpact: 6, description: 'Limited understanding of medication importance' },
      { name: 'Poor Engagement', baseImpact: 7, description: 'Low interaction with healthcare team' },
      { name: 'Irregular Schedule', baseImpact: 5, description: 'Inconsistent daily routines affecting medication timing' }
    ],
    clinical: [
      { name: 'Multiple Comorbidities', baseImpact: 8, description: 'Several chronic conditions requiring management' },
      { name: 'Recent Hospitalization', baseImpact: 9, description: 'Hospital admission within last 90 days' },
      { name: 'Age-Related Factors', baseImpact: 6, description: 'Advanced age affecting medication management' },
      { name: 'Cognitive Impairment', baseImpact: 9, description: 'Memory or cognitive issues affecting adherence' }
    ],
    social: [
      { name: 'Social Isolation', baseImpact: 6, description: 'Limited family or social support system' },
      { name: 'Economic Barriers', baseImpact: 8, description: 'Financial constraints affecting medication access' },
      { name: 'Transportation Issues', baseImpact: 5, description: 'Difficulty accessing healthcare services' }
    ]
  };

  // Generate comprehensive risk assessment for a patient
  generateRiskAssessment(patientId: string): RiskAssessment {
    const patient = PATIENTS.find(p => p.id === patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const riskFactors = this.generatePatientRiskFactors(patient);
    const riskScore = this.calculateRiskScore(riskFactors, patient);
    const riskLevel = this.determineRiskLevel(riskScore);
    const predictions = this.generatePredictions(patient, riskScore);
    const recommendations = this.generateRecommendations(riskFactors, predictions);

    const assessment: RiskAssessment = {
      patientId,
      riskScore,
      riskLevel,
      riskFactors,
      predictions,
      recommendations,
      lastUpdated: new Date()
    };

    this.riskAssessments.set(patientId, assessment);
    return assessment;
  }

  private generatePatientRiskFactors(patient: Patient): RiskFactor[] {
    const factors: RiskFactor[] = [];
    
    // Medication-related factors
    if (patient.medications.length >= 5) {
      factors.push({
        factor: 'Complex Regimen',
        impact: Math.min(patient.medications.length * 1.2, 10),
        description: `Managing ${patient.medications.length} different medications`,
        category: 'medication'
      });
    }

    // Compliance-based factors
    if (patient.complianceStatus === 'Non-Compliant') {
      factors.push({
        factor: 'Poor Adherence History',
        impact: 9,
        description: 'Consistent non-compliance with medication regimen',
        category: 'behavioral'
      });
    } else if (patient.complianceStatus === 'Partial') {
      factors.push({
        factor: 'Inconsistent Adherence',
        impact: 6,
        description: 'Irregular medication adherence patterns',
        category: 'behavioral'
      });
    }

    // Age-related factors
    if (patient.age >= 75) {
      factors.push({
        factor: 'Advanced Age',
        impact: 7,
        description: 'Age-related challenges in medication management',
        category: 'clinical'
      });
    }

    // Condition-based factors
    if (patient.medicalConditions && patient.medicalConditions.length >= 3) {
      factors.push({
        factor: 'Multiple Comorbidities',
        impact: 8,
        description: `Managing ${patient.medicalConditions.length} chronic conditions`,
        category: 'clinical'
      });
    }

    // Add some random realistic factors for demo
    const randomFactors = this.getRandomRiskFactors(2);
    factors.push(...randomFactors);

    return factors;
  }

  private getRandomRiskFactors(count: number): RiskFactor[] {
    const allFactors = [
      ...this.riskFactorTemplates.medication,
      ...this.riskFactorTemplates.behavioral,
      ...this.riskFactorTemplates.clinical,
      ...this.riskFactorTemplates.social
    ];

    const selectedFactors: RiskFactor[] = [];
    for (let i = 0; i < count && i < allFactors.length; i++) {
      const randomIndex = Math.floor(Math.random() * allFactors.length);
      const template = allFactors[randomIndex];
      
      selectedFactors.push({
        factor: template.name,
        impact: template.baseImpact + (Math.random() * 2 - 1), // ±1 variation
        description: template.description,
        category: this.getFactorCategory(template.name)
      });
    }

    return selectedFactors;
  }

  private getFactorCategory(factorName: string): 'medication' | 'behavioral' | 'clinical' | 'social' {
    for (const [category, factors] of Object.entries(this.riskFactorTemplates)) {
      if (factors.some(f => f.name === factorName)) {
        return category as 'medication' | 'behavioral' | 'clinical' | 'social';
      }
    }
    return 'clinical';
  }

  private calculateRiskScore(riskFactors: RiskFactor[], patient: Patient): number {
    let score = 0;
    
    // Base score from risk factors
    const factorScore = riskFactors.reduce((sum, factor) => sum + factor.impact, 0);
    score += factorScore * 2; // Amplify factor impact

    // Compliance adjustment
    switch (patient.complianceStatus) {
      case 'Non-Compliant':
        score += 20;
        break;
      case 'Partial':
        score += 10;
        break;
      case 'Compliant':
        score -= 5;
        break;
    }

    // Age adjustment
    if (patient.age >= 65) score += 5;
    if (patient.age >= 80) score += 10;

    // Medication count adjustment
    if (patient.medications.length >= 5) score += patient.medications.length * 2;

    return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
  }

  private determineRiskLevel(riskScore: number): 'Low' | 'Medium' | 'High' | 'Critical' {
    if (riskScore >= 80) return 'Critical';
    if (riskScore >= 60) return 'High';
    if (riskScore >= 40) return 'Medium';
    return 'Low';
  }

  private generatePredictions(patient: Patient, riskScore: number): Prediction[] {
    const predictions: Prediction[] = [];

    // Adherence drop prediction
    if (riskScore > 40) {
      predictions.push({
        type: 'adherence_drop',
        probability: Math.min(riskScore + Math.random() * 20 - 10, 95),
        timeframe: 'next 30 days',
        description: 'Risk of significant decline in medication adherence',
        confidence: 78 + Math.random() * 20
      });
    }

    // Hospitalization risk
    if (riskScore > 60) {
      predictions.push({
        type: 'hospitalization_risk',
        probability: Math.min(riskScore * 0.7 + Math.random() * 15, 90),
        timeframe: 'next 90 days',
        description: 'Elevated risk of hospital readmission',
        confidence: 72 + Math.random() * 25
      });
    }

    // Medication interaction prediction
    if (patient.medications.length >= 4) {
      predictions.push({
        type: 'medication_interaction',
        probability: patient.medications.length * 8 + Math.random() * 20,
        timeframe: 'ongoing',
        description: 'Potential drug-drug interactions requiring monitoring',
        confidence: 85 + Math.random() * 15
      });
    }

    return predictions;
  }

  private generateRecommendations(riskFactors: RiskFactor[], predictions: Prediction[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High-impact recommendations based on risk factors
    const highImpactFactors = riskFactors.filter(f => f.impact >= 7);
    
    if (highImpactFactors.some(f => f.category === 'medication')) {
      recommendations.push({
        action: 'Medication Reconciliation',
        priority: 'High',
        category: 'medication',
        description: 'Comprehensive review of all medications with clinical pharmacist',
        expectedImpact: 'Reduce medication-related risks by 40-60%'
      });
    }

    if (highImpactFactors.some(f => f.category === 'behavioral')) {
      recommendations.push({
        action: 'Enhanced Patient Education',
        priority: 'Medium',
        category: 'care_coordination',
        description: 'Structured education program on medication importance and adherence',
        expectedImpact: 'Improve adherence by 25-35%'
      });
    }

    // Predictions-based recommendations
    const highRiskPredictions = predictions.filter(p => p.probability >= 60);
    
    if (highRiskPredictions.length > 0) {
      recommendations.push({
        action: 'Intensive Monitoring Program',
        priority: 'High',
        category: 'monitoring',
        description: 'Enroll in high-risk patient monitoring program',
        expectedImpact: 'Reduce adverse outcomes by 45-70%'
      });
    }

    // Add some standard recommendations
    recommendations.push({
      action: 'Care Team Huddle',
      priority: 'Medium',
      category: 'care_coordination',
      description: 'Multidisciplinary team discussion for care planning',
      expectedImpact: 'Improve care coordination and outcomes'
    });

    return recommendations;
  }

  // Population-level insights
  generatePopulationInsights(): PopulationInsight[] {
    const insights: PopulationInsight[] = [];
    
    // Adherence patterns insight
    const nonCompliantCount = PATIENTS.filter(p => p.complianceStatus === 'Non-Compliant').length;
    insights.push({
      id: 'adherence-trend-001',
      title: 'Declining Adherence in Diabetes Patients',
      description: `${nonCompliantCount} patients show concerning adherence patterns, with highest risk in morning medication schedules`,
      category: 'adherence',
      affectedPatients: nonCompliantCount,
      confidence: 87,
      actionableItems: [
        'Implement morning reminder system',
        'Schedule diabetes educator sessions',
        'Review medication timing with providers'
      ],
      generatedAt: new Date()
    });

    // Risk factors insight
    insights.push({
      id: 'risk-factor-002',
      title: 'Polypharmacy Risk Increasing',
      description: 'Patients on 5+ medications show 3x higher risk of adverse events',
      category: 'risk_factors',
      affectedPatients: PATIENTS.filter(p => p.medications.length >= 5).length,
      confidence: 92,
      actionableItems: [
        'Prioritize medication reconciliation',
        'Consider deprescribing opportunities',
        'Enhance pharmacy collaboration'
      ],
      generatedAt: new Date()
    });

    // Care patterns insight
    insights.push({
      id: 'care-pattern-003',
      title: 'Emergency Department Utilization Pattern',
      description: 'High-risk patients visiting ED 40% more frequently, primarily medication-related issues',
      category: 'care_patterns',
      affectedPatients: Math.floor(PATIENTS.length * 0.15),
      confidence: 79,
      actionableItems: [
        'Implement preventive care protocols',
        'Establish rapid response team',
        'Enhance patient education programs'
      ],
      generatedAt: new Date()
    });

    this.populationInsights = insights;
    return insights;
  }

  // Get risk assessment for patient
  getRiskAssessment(patientId: string): RiskAssessment | null {
    return this.riskAssessments.get(patientId) || null;
  }

  // Get all risk assessments
  getAllRiskAssessments(): RiskAssessment[] {
    return Array.from(this.riskAssessments.values());
  }

  // Get high-risk patients
  getHighRiskPatients(): RiskAssessment[] {
    return this.getAllRiskAssessments()
      .filter(assessment => assessment.riskLevel === 'High' || assessment.riskLevel === 'Critical')
      .sort((a, b) => b.riskScore - a.riskScore);
  }

  // Get population insights
  getPopulationInsights(): PopulationInsight[] {
    if (this.populationInsights.length === 0) {
      return this.generatePopulationInsights();
    }
    return this.populationInsights;
  }

  // Initialize risk assessments for all patients (for demo purposes)
  initializeAllRiskAssessments(): void {
    // Generate for a subset of patients to avoid performance issues
    const samplePatients = PATIENTS.slice(0, Math.min(50, PATIENTS.length));
    
    samplePatients.forEach(patient => {
      this.generateRiskAssessment(patient.id);
    });
  }
}

// Export singleton instance
export const predictiveAnalytics = new PredictiveAnalytics();

// Initialize on module load for demo
predictiveAnalytics.initializeAllRiskAssessments();