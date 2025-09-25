import { HOSPITALS, DOCTORS, PATIENTS, DATABASE_SUMMARY } from './database/mockDatabase';
// Fix: Import user types to correctly type mock admin users.
import type { Hospital, Doctor, Patient, SuperAdminUser, HospitalAdminUser } from './types';

// Use the comprehensive database
export const MOCK_HOSPITALS: Hospital[] = HOSPITALS;
export const MOCK_DOCTORS: Doctor[] = DOCTORS;
export const MOCK_PATIENTS: Patient[] = PATIENTS;
export const DATABASE_STATS = DATABASE_SUMMARY;

// Fix: Add mock compliance data for the patient dashboard chart.
export const COMPLIANCE_DATA = [
    { day: 'Mon', compliance: 95 },
    { day: 'Tue', compliance: 80 },
    { day: 'Wed', compliance: 100 },
    { day: 'Thu', compliance: 75 },
    { day: 'Fri', compliance: 90 },
    { day: 'Sat', compliance: 100 },
    { day: 'Sun', compliance: 60 },
];

// Add a default super_admin and hospital_admin for login purposes
// Fix: Explicitly type mock admin users to resolve type mismatch errors in App.tsx.
export const MOCK_SUPER_ADMIN: SuperAdminUser = { id: 'superadmin', name: 'Super Admin', role: 'super_admin' };
export const MOCK_HOSPITAL_ADMIN: HospitalAdminUser = { id: 'hospitaladmin1', name: 'Admin - Hospital 1', role: 'hospital_admin', data: MOCK_HOSPITALS[0] };