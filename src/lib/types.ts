export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  insuranceProvider: string;
  insuranceId: string;
  notes: ClinicalNote[];
  appointments: Appointment[];
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  type: 'intake' | 'progress' | 'session' | 'discharge';
  title: string;
  content: string;
  sessionDate: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'initial_consultation' | 'individual_therapy' | 'couples_therapy' | 'group_therapy' | 'assessment' | 'follow_up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  fee: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  insuranceClaimId?: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface TherapistSettings {
  name: string;
  licenseNumber: string;
  specialty: string;
  sessionFee: number;
  businessName: string;
  email: string;
  phone: string;
  officeAddress: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
}

export const SESSION_TYPES = {
  initial_consultation: 'Initial Consultation',
  individual_therapy: 'Individual Therapy',
  couples_therapy: 'Couples Therapy',
  group_therapy: 'Group Therapy',
  assessment: 'Assessment',
  follow_up: 'Follow-up',
} as const;

export const NOTE_TYPES = {
  intake: 'Intake Assessment',
  progress: 'Progress Note',
  session: 'Session Note',
  discharge: 'Discharge Summary',
} as const;

export const APPOINTMENT_STATUS = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
} as const;