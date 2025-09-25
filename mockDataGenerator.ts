import type { Hospital, Doctor, Patient, Medication, ComplianceStatus } from './types';

// Source data for generation
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Diya', 'Myra', 'Anika', 'Avni'];
const LAST_NAMES = ['Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Jain', 'Verma', 'Yadav', 'Shah', 'Mehta', 'Reddy', 'Naidu', 'Rao', 'Iyer', 'Menon'];
const HOSPITAL_NAMES_PREFIX = ['City', 'Community', 'General', 'Sunrise', 'Metro', 'Hope', 'Unity', 'Apex', 'Global', 'Fortis'];
const HOSPITAL_NAMES_SUFFIX = ['Medical Center', 'Hospital', 'Clinic', 'Health', 'Care Institute', 'Sanatorium'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const SPECIALTIES = ['Cardiology', 'Pediatrics', 'Neurology', 'Oncology', 'Orthopedics', 'Dermatology', 'Gastroenterology'];
const MEDICATIONS = [
    { name: 'Lisinopril', dosage: '10mg', instructions: 'Take one tablet twice daily with food.' },
    { name: 'Metformin', dosage: '500mg', instructions: 'Take one tablet with your evening meal.' },
    { name: 'Atorvastatin', dosage: '20mg', instructions: 'Take one tablet at bedtime.' },
    { name: 'Amlodipine', dosage: '5mg', instructions: 'Take one tablet daily in the morning.' },
    { name: 'Omeprazole', dosage: '20mg', instructions: 'Take one capsule 30 minutes before breakfast.' },
    { name: 'Paracetamol', dosage: '650mg', instructions: 'Take as needed for pain, max 4 times a day.' },
];

// Utility functions
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (): string => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Main generator function
export const generateMockData = (numHospitals: number, numDoctors: number, numPatients: number) => {
    const hospitals: Hospital[] = [];
    const doctors: Doctor[] = [];
    const patients: Patient[] = [];

    // 1. Generate Hospitals
    for (let i = 1; i <= numHospitals; i++) {
        hospitals.push({
            id: `hospital${i}`,
            name: `${getRandomElement(HOSPITAL_NAMES_PREFIX)} ${getRandomElement(HOSPITAL_NAMES_SUFFIX)}`,
            location: getRandomElement(LOCATIONS),
            doctors: [],
            patients: [],
        });
    }

    // 2. Generate Doctors and assign to Hospitals
    for (let i = 1; i <= numDoctors; i++) {
        const hospital = getRandomElement(hospitals);
        const doctor: Doctor = {
            id: `doctor${i}`,
            name: `Dr. ${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
            specialty: getRandomElement(SPECIALTIES),
            hospitalId: hospital.id,
        };
        doctors.push(doctor);
        hospital.doctors.push(doctor);
    }

    // 3. Generate Patients and assign to Doctors
    for (let i = 1; i <= numPatients; i++) {
        const doctor = getRandomElement(doctors);
        const complianceValue = 50 + Math.floor(Math.random() * 51); // 50-100%
        const complianceStatus: ComplianceStatus = complianceValue > 90 ? 'Compliant' : complianceValue > 70 ? 'Partial' : 'Non-Compliant';

        // Generate a random prescription
        const numMedications = 1 + Math.floor(Math.random() * 3);
        const patientMedications: Medication[] = [];
        for (let j = 0; j < numMedications; j++) {
            const medTemplate = getRandomElement(MEDICATIONS);
            patientMedications.push({
                ...medTemplate,
                schedule: [
                    { time: '8:00 AM', taken: Math.random() > 0.3 },
                    { time: '8:00 PM', taken: Math.random() > 0.7 },
                ],
            });
        }

        const patient: Patient = {
            id: `patient${i}`,
            name: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
            age: 20 + Math.floor(Math.random() * 50),
            lastVisit: getRandomDate(),
            compliance: `${complianceValue}%`,
            complianceStatus: complianceStatus,
            doctorId: doctor.id,
            hospitalId: doctor.hospitalId,
            medications: patientMedications,
        };
        patients.push(patient);
        const hospital = hospitals.find(h => h.id === doctor.hospitalId);
        hospital?.patients.push(patient);
    }

    return { hospitals, doctors, patients };
};