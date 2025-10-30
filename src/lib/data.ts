import type { Patient } from './types'

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    abhaId: '12-3456-7890-1234',
    age: 68,
    gender: 'Female',
    admissionDate: '2024-05-10',
    status: 'Reconciliation Pending',
    avatarUrl: 'https://picsum.photos/seed/patient1/100/100',
    vitals: [
      { date: '2024-05-10', systolic: 140, diastolic: 90, heartRate: 85 },
      { date: '2024-05-11', systolic: 135, diastolic: 88, heartRate: 82 },
      { date: '2024-05-12', systolic: 130, diastolic: 85, heartRate: 78 },
      { date: '2024-05-13', systolic: 128, diastolic: 82, heartRate: 75 },
    ],
    medications: {
      preAdmission: [
        { id: 'med1', name: 'Metformin', dosage: '500 mg', frequency: 'Twice a day', route: 'Oral' },
        { id: 'med2', name: 'Amlodipine', dosage: '5 mg', frequency: 'Once a day', route: 'Oral' },
      ],
      postDischarge: [
        { id: 'med1', name: 'Metformin', dosage: '500 mg', frequency: 'Twice a day', route: 'Oral', status: 'Unchanged' },
        { id: 'med3', name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once a day', route: 'Oral', status: 'New' },
        { id: 'med4', name: 'Aspirin', dosage: '75 mg', frequency: 'Once a day', route: 'Oral', status: 'New' },
        { id: 'med2', name: 'Amlodipine', dosage: '10 mg', frequency: 'Once a day', route: 'Oral', status: 'Changed' },
      ],
    },
    alerts: [
      { id: 'alert1', type: 'Drug-Drug', severity: 'Warning', description: 'Aspirin and Warfarin have a potential interaction. Monitor INR levels.' },
      { id: 'alert2', type: 'Dose', severity: 'Info', description: 'Amlodipine dose increased from 5mg to 10mg.' },
    ],
    caregivers: [
      { id: 'care1', name: 'Rohan Sharma', relation: 'Son', phone: '+91-9876543210', avatarUrl: 'https://picsum.photos/seed/caregiver1/100/100' },
    ],
    abhaRecord: `Patient Name: Priya Sharma
ABHA ID: 12-3456-7890-1234
DOB: 1956-03-15
Allergies: Penicillin
Past Medical History: Type 2 Diabetes (diagnosed 2010), Hypertension (diagnosed 2015).
Previous Surgeries: None.
Family History: Father had coronary artery disease.`,
    diagnosis: 'Unstable Angina (ICD-10: I20.0)',
    followUp: 'Follow up with Dr. Mehta in Cardiology OPD after 1 week. Contact hospital at 011-23456789 for appointments.',
    adherence: [
        { id: 'adh1', medicationId: 'med1', medicationName: 'Metformin', scheduledTime: '2024-05-18T08:00:00', status: 'Taken', actualTime: '2024-05-18T08:05:00' },
        { id: 'adh2', medicationId: 'med3', medicationName: 'Atorvastatin', scheduledTime: '2024-05-18T08:00:00', status: 'Taken', actualTime: '2024-05-18T08:05:00' },
        { id: 'adh3', medicationId: 'med4', medicationName: 'Aspirin', scheduledTime: '2024-05-18T08:00:00', status: 'Taken', actualTime: '2024-05-18T08:05:00' },
        { id: 'adh4', medicationId: 'med2', medicationName: 'Amlodipine', scheduledTime: '2024-05-18T08:00:00', status: 'Taken', actualTime: '2024-05-18T08:05:00' },
        { id: 'adh5', medicationId: 'med1', medicationName: 'Metformin', scheduledTime: '2024-05-18T20:00:00', status: 'Missed' },

        { id: 'adh6', medicationId: 'med1', medicationName: 'Metformin', scheduledTime: '2024-05-19T08:00:00', status: 'Taken', actualTime: '2024-05-19T08:15:00' },
        { id: 'adh7', medicationId: 'med3', medicationName: 'Atorvastatin', scheduledTime: '2024-05-19T08:00:00', status: 'Taken', actualTime: '2024-05-19T08:15:00' },
        { id: 'adh8', medicationId: 'med4', medicationName: 'Aspirin', scheduledTime: '2024-05-19T08:00:00', status: 'Taken', actualTime: '2024-05-19T08:15:00' },
        { id: 'adh9', medicationId: 'med2', medicationName: 'Amlodipine', scheduledTime: '2024-05-19T08:00:00', status: 'Taken', actualTime: '2024-05-19T08:15:00' },
        { id: 'adh10', medicationId: 'med1', medicationName: 'Metformin', scheduledTime: '2024-05-19T20:00:00', status: 'Pending' },

        { id: 'adh11', medicationId: 'med1', medicationName: 'Metformin', scheduledTime: '2024-05-20T08:00:00', status: 'Pending' },
        { id: 'adh12', medicationId: 'med3', medicationName: 'Atorvastatin', scheduledTime: '2024-05-20T08:00:00', status: 'Pending' },
      ],
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    abhaId: '23-4567-8901-2345',
    age: 72,
    gender: 'Male',
    admissionDate: '2024-05-12',
    status: 'Discharged',
    avatarUrl: 'https://picsum.photos/seed/patient2/100/100',
    vitals: [],
    medications: { preAdmission: [], postDischarge: [] },
    alerts: [],
    caregivers: [],
    abhaRecord: '',
    diagnosis: '',
    followUp: '',
    adherence: [],
  },
  {
    id: '3',
    name: 'Anjali Devi',
    abhaId: '34-5678-9012-3456',
    age: 55,
    gender: 'Female',
    admissionDate: '2024-05-14',
    status: 'Admitted',
    avatarUrl: 'https://picsum.photos/seed/patient3/100/100',
    vitals: [],
    medications: { preAdmission: [], postDischarge: [] },
    alerts: [],
    caregivers: [],
    abhaRecord: '',
    diagnosis: '',
    followUp: '',
    adherence: [],
  },
  {
    id: '4',
    name: 'Vikram Singh',
    abhaId: '45-6789-0123-4567',
    age: 80,
    gender: 'Male',
    admissionDate: '2024-05-15',
    status: 'Reconciliation Pending',
    avatarUrl: 'https://picsum.photos/seed/patient4/100/100',
    vitals: [],
    medications: { preAdmission: [], postDischarge: [] },
    alerts: [{id: 'alert-ped', type: 'Dose', severity: 'Critical', description: 'High-risk medication for elderly. Verify dosage.'}],
    caregivers: [],
    abhaRecord: '',
    diagnosis: '',
    followUp: '',
    adherence: [],
  },
];

export const getPatientById = (id: string) => {
  return patients.find(p => p.id === id);
};
