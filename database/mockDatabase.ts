import type { Hospital, Doctor, Patient, Medication, ComplianceStatus } from '../types';

// Expanded medical data for realistic generation
const MEDICAL_CONDITIONS = [
  'Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia', 'Asthma', 'COPD', 'Depression',
  'Anxiety Disorder', 'Osteoarthritis', 'Rheumatoid Arthritis', 'Coronary Artery Disease',
  'Heart Failure', 'Atrial Fibrillation', 'Stroke', 'Chronic Kidney Disease', 'Hypothyroidism',
  'Gastroesophageal Reflux', 'Migraine', 'Epilepsy', 'Parkinson\'s Disease', 'Alzheimer\'s Disease'
];

const COMPREHENSIVE_MEDICATIONS = [
  { name: 'Metformin', dosage: ['500mg', '850mg', '1000mg'], category: 'Antidiabetic', conditions: ['Type 2 Diabetes'] },
  { name: 'Lisinopril', dosage: ['5mg', '10mg', '20mg'], category: 'ACE Inhibitor', conditions: ['Hypertension', 'Heart Failure'] },
  { name: 'Atorvastatin', dosage: ['10mg', '20mg', '40mg', '80mg'], category: 'Statin', conditions: ['Hyperlipidemia'] },
  { name: 'Amlodipine', dosage: ['2.5mg', '5mg', '10mg'], category: 'Calcium Channel Blocker', conditions: ['Hypertension'] },
  { name: 'Omeprazole', dosage: ['20mg', '40mg'], category: 'Proton Pump Inhibitor', conditions: ['Gastroesophageal Reflux'] },
  { name: 'Levothyroxine', dosage: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'], category: 'Thyroid Hormone', conditions: ['Hypothyroidism'] },
  { name: 'Sertraline', dosage: ['25mg', '50mg', '100mg'], category: 'SSRI', conditions: ['Depression', 'Anxiety Disorder'] },
  { name: 'Albuterol', dosage: ['90mcg/inhaler'], category: 'Bronchodilator', conditions: ['Asthma', 'COPD'] },
  { name: 'Warfarin', dosage: ['1mg', '2mg', '5mg'], category: 'Anticoagulant', conditions: ['Atrial Fibrillation', 'Stroke'] },
  { name: 'Furosemide', dosage: ['20mg', '40mg', '80mg'], category: 'Diuretic', conditions: ['Heart Failure', 'Hypertension'] },
  { name: 'Aspirin', dosage: ['81mg', '325mg'], category: 'Antiplatelet', conditions: ['Coronary Artery Disease', 'Stroke'] },
  { name: 'Ibuprofen', dosage: ['200mg', '400mg', '600mg'], category: 'NSAID', conditions: ['Osteoarthritis', 'Rheumatoid Arthritis'] },
  { name: 'Sumatriptan', dosage: ['25mg', '50mg', '100mg'], category: 'Triptan', conditions: ['Migraine'] },
  { name: 'Phenytoin', dosage: ['100mg', '200mg'], category: 'Anticonvulsant', conditions: ['Epilepsy'] },
  { name: 'Carbidopa-Levodopa', dosage: ['25-100mg', '25-250mg'], category: 'Dopamine Precursor', conditions: ['Parkinson\'s Disease'] }
];

const MEDICAL_SPECIALTIES = [
  'Internal Medicine', 'Family Medicine', 'Cardiology', 'Endocrinology', 'Pulmonology',
  'Gastroenterology', 'Nephrology', 'Neurology', 'Psychiatry', 'Rheumatology',
  'Dermatology', 'Ophthalmology', 'Orthopedics', 'Urology', 'Oncology',
  'Emergency Medicine', 'Anesthesiology', 'Radiology', 'Pathology', 'Surgery'
];

const HOSPITAL_NAMES = [
  'Apollo Hospital', 'Fortis Healthcare', 'Max Super Speciality Hospital', 'Medanta - The Medicity',
  'AIIMS (All India Institute of Medical Sciences)', 'Christian Medical College', 'Tata Memorial Hospital',
  'Sankara Nethralaya', 'Narayana Health', 'Manipal Hospital', 'Columbia Asia Hospital',
  'Kokilaben Dhirubhai Ambani Hospital', 'Sir Ganga Ram Hospital', 'Ruby Hall Clinic',
  'Breach Candy Hospital', 'Jaslok Hospital', 'Hinduja Hospital', 'Lilavati Hospital',
  'King Edward Memorial Hospital', 'Seth G.S. Medical College', 'Grant Medical College',
  'Lokmanya Tilak Municipal Medical College', 'Topiwala National Medical College'
];

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore', 'Thane',
  'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Madurai'
];

const INDIAN_NAMES = {
  male: {
    first: ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
            'Atharv', 'Advaith', 'Arnav', 'Aadi', 'Kiaan', 'Shivansh', 'Abhinav', 'Prathvik', 'Aayan', 'Rudra'],
    last: ['Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Patel', 'Jain', 'Agarwal', 'Yadav', 'Shah',
           'Mehta', 'Reddy', 'Naidu', 'Rao', 'Iyer', 'Menon', 'Nair', 'Pillai', 'Chandra', 'Varma']
  },
  female: {
    first: ['Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Diya', 'Myra', 'Anika', 'Avni',
            'Kavya', 'Arya', 'Sia', 'Riya', 'Kiara', 'Aditi', 'Ira', 'Tara', 'Shreya', 'Priya'],
    last: ['Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Patel', 'Jain', 'Agarwal', 'Yadav', 'Shah',
           'Mehta', 'Reddy', 'Naidu', 'Rao', 'Iyer', 'Menon', 'Nair', 'Pillai', 'Chandra', 'Varma']
  }
};

// Utility functions
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomDate = (daysBack: number = 30): string => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const getRandomTime = (): string => {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
  return `${hours}:${minutes} ${ampm}`;
};

const generateMedicationSchedule = (frequency: string) => {
  const schedules: { [key: string]: string[] } = {
    'Once daily': ['8:00 AM'],
    'Twice daily': ['8:00 AM', '8:00 PM'],
    'Three times daily': ['8:00 AM', '2:00 PM', '8:00 PM'],
    'Four times daily': ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM'],
    'As needed': ['As needed']
  };
  
  const times = schedules[frequency] || schedules['Once daily'];
  return times.map(time => ({
    time,
    taken: Math.random() > 0.2 // 80% compliance rate
  }));
};

// Enhanced data generation functions
const generateRealisticPatient = (id: number, doctorId: string, hospitalId: string): Patient => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = getRandomElement(INDIAN_NAMES[gender].first);
  const lastName = getRandomElement(INDIAN_NAMES[gender].last);
  
  // Assign 1-3 medical conditions based on age
  const age = 25 + Math.floor(Math.random() * 55); // Age 25-80
  const conditionCount = age > 60 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2) + 1;
  const conditions = getRandomElements(MEDICAL_CONDITIONS, conditionCount);
  
  // Generate medications based on conditions
  const medications: Medication[] = [];
  conditions.forEach(condition => {
    const relevantMeds = COMPREHENSIVE_MEDICATIONS.filter(med => med.conditions.includes(condition));
    if (relevantMeds.length > 0) {
      const med = getRandomElement(relevantMeds);
      const dosage = getRandomElement(med.dosage);
      const frequency = getRandomElement(['Once daily', 'Twice daily', 'Three times daily']);
      
      medications.push({
        name: med.name,
        dosage: dosage,
        schedule: generateMedicationSchedule(frequency),
        instructions: `Take ${frequency.toLowerCase()} with food. ${med.category} for ${condition}.`,
        category: med.category,
        condition: condition
      });
    }
  });
  
  // Calculate compliance based on medication adherence
  const totalDoses = medications.reduce((acc, med) => acc + med.schedule.length, 0);
  const takenDoses = medications.reduce((acc, med) => 
    acc + med.schedule.filter(s => s.taken).length, 0);
  const complianceValue = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
  
  const complianceStatus: ComplianceStatus = 
    complianceValue >= 90 ? 'Compliant' : 
    complianceValue >= 70 ? 'Partial' : 'Non-Compliant';
  
  return {
    id: `patient${id}`,
    name: `${firstName} ${lastName}`,
    age,
    gender,
    lastVisit: getRandomDate(60),
    nextAppointment: getRandomDate(-7), // Future appointment
    compliance: `${complianceValue}%`,
    complianceStatus,
    doctorId,
    hospitalId,
    medications,
    medicalConditions: conditions,
    contactNumber: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    address: `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(['MG Road', 'Park Street', 'Brigade Road', 'Commercial Street'])}, ${getRandomElement(INDIAN_CITIES)}`,
    bloodGroup: getRandomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    emergencyContact: {
      name: `${getRandomElement(INDIAN_NAMES.male.first)} ${lastName}`,
      relation: getRandomElement(['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister']),
      phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`
    }
  };
};

const generateRealisticDoctor = (id: number, hospitalId: string): Doctor => {
  const gender = Math.random() > 0.7 ? 'female' : 'male'; // 30% female doctors
  const firstName = getRandomElement(INDIAN_NAMES[gender].first);
  const lastName = getRandomElement(INDIAN_NAMES[gender].last);
  const specialty = getRandomElement(MEDICAL_SPECIALTIES);
  
  const yearsOfExperience = Math.floor(Math.random() * 25) + 5; // 5-30 years
  const qualifications = [
    'MBBS',
    ...(Math.random() > 0.3 ? [`MD (${specialty})`] : []),
    ...(Math.random() > 0.7 ? ['FRCP'] : []),
    ...(Math.random() > 0.8 ? ['DNB'] : [])
  ];
  
  return {
    id: `doctor${id}`,
    name: `Dr. ${firstName} ${lastName}`,
    gender,
    specialty,
    hospitalId,
    yearsOfExperience,
    qualifications: qualifications.join(', '),
    consultationFee: Math.floor(Math.random() * 1500) + 500, // ₹500-2000
    availability: generateDoctorAvailability(),
    contactNumber: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    email: `dr.${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
    licenseNumber: `DL${Math.floor(100000 + Math.random() * 900000)}`,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)) // 3.5-5.0 rating
  };
};

const generateDoctorAvailability = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.map(day => ({
    day,
    slots: Math.random() > 0.2 ? [
      { time: '9:00 AM - 12:00 PM', available: true },
      { time: '2:00 PM - 5:00 PM', available: Math.random() > 0.3 }
    ] : []
  }));
};

const generateRealisticHospital = (id: number): Hospital => {
  const name = getRandomElement(HOSPITAL_NAMES);
  const city = getRandomElement(INDIAN_CITIES);
  
  return {
    id: `hospital${id}`,
    name,
    location: city,
    address: `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(['Sector', 'Block', 'Phase'])} ${Math.floor(Math.random() * 50) + 1}, ${city}`,
    type: getRandomElement(['Multi-specialty', 'Super-specialty', 'Teaching Hospital', 'Government Hospital', 'Private Hospital']),
    established: Math.floor(Math.random() * 50) + 1970, // 1970-2020
    bedCapacity: Math.floor(Math.random() * 800) + 200, // 200-1000 beds
    departments: getRandomElements(MEDICAL_SPECIALTIES, Math.floor(Math.random() * 10) + 8), // 8-18 departments
    accreditation: getRandomElements(['NABH', 'JCI', 'ISO 9001', 'NABL'], Math.floor(Math.random() * 3) + 1),
    contactNumber: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    email: `info@${name.toLowerCase().replace(/\s+/g, '')}.com`,
    website: `www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    emergencyNumber: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    doctors: [],
    patients: []
  };
};

// Main database generation function
export const generateComprehensiveMockDatabase = () => {
  const hospitals: Hospital[] = [];
  const doctors: Doctor[] = [];
  const patients: Patient[] = [];
  
  // Generate 50 realistic hospitals
  for (let i = 1; i <= 50; i++) {
    hospitals.push(generateRealisticHospital(i));
  }
  
  // Generate 500 doctors (10 per hospital on average)
  for (let i = 1; i <= 500; i++) {
    const hospital = getRandomElement(hospitals);
    const doctor = generateRealisticDoctor(i, hospital.id);
    doctors.push(doctor);
    hospital.doctors.push(doctor);
  }
  
  // Generate 2000 patients (4 per doctor on average)
  for (let i = 1; i <= 2000; i++) {
    const doctor = getRandomElement(doctors);
    const hospital = hospitals.find(h => h.id === doctor.hospitalId)!;
    const patient = generateRealisticPatient(i, doctor.id, hospital.id);
    patients.push(patient);
    hospital.patients.push(patient);
  }
  
  return {
    hospitals,
    doctors,
    patients,
    summary: {
      totalHospitals: hospitals.length,
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      avgPatientsPerDoctor: Math.round(patients.length / doctors.length),
      avgDoctorsPerHospital: Math.round(doctors.length / hospitals.length)
    }
  };
};

// Database instance
export const mockDatabase = generateComprehensiveMockDatabase();

// Export collections
export const HOSPITALS = mockDatabase.hospitals;
export const DOCTORS = mockDatabase.doctors;
export const PATIENTS = mockDatabase.patients;
export const DATABASE_SUMMARY = mockDatabase.summary;

// Helper functions for querying the database
export const getDoctorsByHospital = (hospitalId: string) => 
  DOCTORS.filter(doctor => doctor.hospitalId === hospitalId);

export const getPatientsByDoctor = (doctorId: string) => 
  PATIENTS.filter(patient => patient.doctorId === doctorId);

export const getPatientsByHospital = (hospitalId: string) => 
  PATIENTS.filter(patient => patient.hospitalId === hospitalId);

export const getDoctorById = (doctorId: string) => 
  DOCTORS.find(doctor => doctor.id === doctorId);

export const getHospitalById = (hospitalId: string) => 
  HOSPITALS.find(hospital => hospital.id === hospitalId);

export const getPatientById = (patientId: string) => 
  PATIENTS.find(patient => patient.id === patientId);

// Advanced query functions
export const searchPatients = (query: string) => 
  PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(query.toLowerCase()) ||
    patient.medicalConditions.some(condition => 
      condition.toLowerCase().includes(query.toLowerCase())
    )
  );

export const searchDoctors = (query: string) => 
  DOCTORS.filter(doctor => 
    doctor.name.toLowerCase().includes(query.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(query.toLowerCase())
  );

export const getComplianceStatistics = () => {
  const compliant = PATIENTS.filter(p => p.complianceStatus === 'Compliant').length;
  const partial = PATIENTS.filter(p => p.complianceStatus === 'Partial').length;
  const nonCompliant = PATIENTS.filter(p => p.complianceStatus === 'Non-Compliant').length;
  
  return {
    compliant,
    partial,
    nonCompliant,
    total: PATIENTS.length,
    complianceRate: Math.round((compliant / PATIENTS.length) * 100)
  };
};