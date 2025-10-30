export type Patient = {
  id: string
  name: string
  abhaId: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  admissionDate: string
  dischargeDate?: string
  status: 'Admitted' | 'Discharged' | 'Reconciliation Pending'
  avatarUrl: string
  vitals: Vital[]
  medications: {
    preAdmission: Medication[]
    postDischarge: Medication[]
  }
  alerts: Alert[]
  caregivers: Caregiver[]
  abhaRecord: string
  diagnosis: string
  followUp: string
  adherence: AdherenceEvent[]
}

export type Vital = {
  date: string
  systolic: number
  diastolic: number
  heartRate: number
}

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  route: string
  status?: 'New' | 'Changed' | 'Unchanged' | 'Discontinued'
}

export type Alert = {
  id: string
  type:
    | 'Drug-Drug'
    | 'Drug-Disease'
    | 'Allergy'
    | 'Dose'
    | 'Drug-Interaction'
    | 'Dosage-Warning'
    | 'Formulary-Alert'
    | 'Anomaly-Detection'
  severity: 'Critical' | 'Warning' | 'Info'
  description: string
  reasoning?: string
}

export type Caregiver = {
  id: string
  name: string
  relation: string
  phone: string
  avatarUrl: string
}

export type AdherenceEvent = {
  id: string
  medicationId: string
  medicationName: string
  scheduledTime: string
  status: 'Taken' | 'Missed' | 'Pending'
  actualTime?: string
}
