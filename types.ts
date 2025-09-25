// Fix: Populating `types.ts` with necessary type definitions for the application.
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: { time: string; taken: boolean }[];
  instructions: string;
  category?: string;
  condition?: string;
}

export interface Prescription {
  patientName: string;
  doctorName: string;
  medications: Medication[];
}

export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'super_admin';

// Base user for login
export interface BaseUser {
  id: string;
  name: string;
  role: UserRole;
}

// Specific User types that hold the full data object
export interface PatientUser extends BaseUser {
  role: 'patient';
  data: Patient;
}
export interface DoctorUser extends BaseUser {
  role: 'doctor';
  data: Doctor;
}
export interface HospitalAdminUser extends BaseUser {
  role: 'hospital_admin';
  data: Hospital;
}
export interface SuperAdminUser extends BaseUser {
  role: 'super_admin';
}

export type User = PatientUser | DoctorUser | HospitalAdminUser | SuperAdminUser;


export type ComplianceStatus = 'Compliant' | 'Partial' | 'Non-Compliant';

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender?: string;
    lastVisit: string;
    nextAppointment?: string;
    compliance: string;
    complianceStatus: ComplianceStatus;
    doctorId: string;
    hospitalId: string;
    medications: Medication[];
    medicalConditions?: string[];
    contactNumber?: string;
    email?: string;
    address?: string;
    bloodGroup?: string;
    emergencyContact?: {
        name: string;
        relation: string;
        phone: string;
    };
}

export interface Doctor {
  id: string;
  name: string;
  gender?: string;
  specialty: string;
  hospitalId: string;
  yearsOfExperience?: number;
  qualifications?: string;
  consultationFee?: number;
  availability?: Array<{
    day: string;
    slots: Array<{ time: string; available: boolean }>;
  }>;
  contactNumber?: string;
  email?: string;
  licenseNumber?: string;
  rating?: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  address?: string;
  type?: string;
  established?: number;
  bedCapacity?: number;
  departments?: string[];
  accreditation?: string[];
  contactNumber?: string;
  email?: string;
  website?: string;
  emergencyNumber?: string;
  doctors: Doctor[];
  patients: Patient[];
}