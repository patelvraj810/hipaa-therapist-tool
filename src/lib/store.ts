import type { Patient, Appointment, Invoice, TherapistSettings } from './types';

const STORAGE_KEYS = {
  patients: 'thera_patients',
  appointments: 'thera_appointments',
  invoices: 'thera_invoices',
  settings: 'thera_settings',
};

// Demo data for showcase
const demoPatients: Patient[] = [
  {
    id: 'p1',
    fullName: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    emergencyContact: 'John Smith - (555) 987-6543',
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS-123456',
    notes: [
      {
        id: 'n1',
        patientId: 'p1',
        type: 'intake',
        title: 'Initial Intake Assessment',
        content: 'Patient presents with symptoms of generalized anxiety. Reports difficulty sleeping and increased worry about work performance. No previous therapy experience. GAD-7 score: 14 (moderate). PHQ-9 score: 10 (moderate).',
        sessionDate: '2026-03-01',
        createdAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'n2',
        patientId: 'p1',
        type: 'progress',
        title: 'Session 4 - Progress Note',
        content: 'Patient reports improvement in sleep quality. CBT techniques for anxiety management are being practiced regularly. Work stress has decreased. GAD-7 score: 9 (mild). Continue current treatment plan.',
        sessionDate: '2026-04-01',
        createdAt: '2026-04-01T14:00:00Z',
      },
    ],
    appointments: [],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-04-01T14:00:00Z',
  },
  {
    id: 'p2',
    fullName: 'Michael Johnson',
    email: 'm.johnson@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1978-08-22',
    emergencyContact: 'Sarah Johnson - (555) 876-5432',
    insuranceProvider: 'Aetna',
    insuranceId: 'AET-789012',
    notes: [
      {
        id: 'n3',
        patientId: 'p2',
        type: 'session',
        title: 'Session Note - Relationship Issues',
        content: 'Patient discusses ongoing marital concerns. Explored communication patterns and identified avoidance behaviors. Introduced Gottman method concepts. Homework: practice "I feel" statements daily.',
        sessionDate: '2026-04-10',
        createdAt: '2026-04-10T11:00:00Z',
      },
    ],
    appointments: [],
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-04-10T11:00:00Z',
  },
  {
    id: 'p3',
    fullName: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1992-11-30',
    emergencyContact: 'David Chen - (555) 765-4321',
    insuranceProvider: 'UnitedHealthcare',
    insuranceId: 'UHC-345678',
    notes: [],
    appointments: [],
    createdAt: '2026-04-12T15:00:00Z',
    updatedAt: '2026-04-12T15:00:00Z',
  },
];

const demoAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Jane Smith',
    date: '2026-04-16',
    startTime: '09:00',
    endTime: '10:00',
    type: 'individual_therapy',
    status: 'scheduled',
    fee: 150,
    createdAt: '2026-04-01T14:00:00Z',
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Michael Johnson',
    date: '2026-04-16',
    startTime: '11:00',
    endTime: '12:00',
    type: 'couples_therapy',
    status: 'scheduled',
    fee: 200,
    createdAt: '2026-04-10T11:00:00Z',
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Emily Chen',
    date: '2026-04-17',
    startTime: '14:00',
    endTime: '15:00',
    type: 'initial_consultation',
    status: 'scheduled',
    fee: 175,
    createdAt: '2026-04-12T15:00:00Z',
  },
  {
    id: 'a4',
    patientId: 'p1',
    patientName: 'Jane Smith',
    date: '2026-04-23',
    startTime: '09:00',
    endTime: '10:00',
    type: 'individual_therapy',
    status: 'scheduled',
    fee: 150,
    createdAt: '2026-04-01T14:00:00Z',
  },
];

const demoInvoices: Invoice[] = [
  {
    id: 'inv1',
    patientId: 'p1',
    patientName: 'Jane Smith',
    appointmentId: 'a1',
    amount: 150,
    status: 'paid',
    dueDate: '2026-04-16',
    paidAt: '2026-04-16T09:00:00Z',
    createdAt: '2026-04-01T14:00:00Z',
  },
  {
    id: 'inv2',
    patientId: 'p2',
    patientName: 'Michael Johnson',
    amount: 200,
    status: 'pending',
    dueDate: '2026-04-20',
    createdAt: '2026-04-10T11:00:00Z',
  },
];

const defaultSettings: TherapistSettings = {
  name: 'Dr. Sarah Mitchell, LCSW',
  licenseNumber: 'LCSW-12345',
  specialty: 'Anxiety & Depression',
  sessionFee: 150,
  businessName: 'Mitchell Therapy Associates',
  email: 'dr.mitchell@example.com',
  phone: '(555) 100-2000',
  officeAddress: '123 Wellness Blvd, Suite 200, Portland, OR 97201',
  workingHours: { start: '08:00', end: '18:00' },
  workingDays: [1, 2, 3, 4, 5], // Mon-Fri
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getPatients(): Patient[] {
  if (!isBrowser()) return demoPatients;
  const stored = localStorage.getItem(STORAGE_KEYS.patients);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(demoPatients));
    return demoPatients;
  }
  return JSON.parse(stored);
}

export function getPatient(id: string): Patient | undefined {
  return getPatients().find(p => p.id === id);
}

export function savePatient(patient: Patient): Patient {
  const patients = getPatients();
  const idx = patients.findIndex(p => p.id === patient.id);
  if (idx >= 0) {
    patients[idx] = { ...patient, updatedAt: new Date().toISOString() };
  } else {
    patients.push({ ...patient, id: patient.id || crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
  return patient;
}

export function deletePatient(id: string): void {
  const patients = getPatients().filter(p => p.id !== id);
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
}

export function getAppointments(): Appointment[] {
  if (!isBrowser()) return demoAppointments;
  const stored = localStorage.getItem(STORAGE_KEYS.appointments);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(demoAppointments));
    return demoAppointments;
  }
  return JSON.parse(stored);
}

export function saveAppointment(appointment: Appointment): Appointment {
  const appointments = getAppointments();
  const idx = appointments.findIndex(a => a.id === appointment.id);
  if (idx >= 0) {
    appointments[idx] = appointment;
  } else {
    appointments.push({ ...appointment, id: appointment.id || crypto.randomUUID(), createdAt: new Date().toISOString() });
  }
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  return appointment;
}

export function deleteAppointment(id: string): void {
  const appointments = getAppointments().filter(a => a.id !== id);
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
}

export function checkConflict(date: string, startTime: string, endTime: string, excludeId?: string): Appointment | null {
  const appointments = getAppointments();
  const conflict = appointments.find(a => {
    if (a.id === excludeId) return false;
    if (a.date !== date) return false;
    if (a.status === 'cancelled') return false;
    return startTime < a.endTime && endTime > a.startTime;
  });
  return conflict || null;
}

export function getInvoices(): Invoice[] {
  if (!isBrowser()) return demoInvoices;
  const stored = localStorage.getItem(STORAGE_KEYS.invoices);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(demoInvoices));
    return demoInvoices;
  }
  return JSON.parse(stored);
}

export function saveInvoice(invoice: Invoice): Invoice {
  const invoices = getInvoices();
  const idx = invoices.findIndex(i => i.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.push({ ...invoice, id: invoice.id || crypto.randomUUID(), createdAt: new Date().toISOString() });
  }
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));
  return invoice;
}

export function getSettings(): TherapistSettings {
  if (!isBrowser()) return defaultSettings;
  const stored = localStorage.getItem(STORAGE_KEYS.settings);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  return JSON.parse(stored);
}

export function saveSettings(settings: TherapistSettings): TherapistSettings {
  if (isBrowser()) localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  return settings;
}