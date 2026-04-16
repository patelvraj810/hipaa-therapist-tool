export interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: 'patient' | 'appointment' | 'billing' | 'note' | 'settings' | 'auth';
  resource_id?: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

const AUDIT_LOG_KEY = 'thera_audit_logs';

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newEntry);
  // Keep only last 1000 entries in local storage
  if (logs.length > 1000) {
    logs.length = 1000;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(AUDIT_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const AUDIT_ACTIONS = {
  PATIENT_CREATE: 'patient.create',
  PATIENT_VIEW: 'patient.view',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_DELETE: 'patient.delete',
  APPOINTMENT_CREATE: 'appointment.create',
  APPOINTMENT_VIEW: 'appointment.view',
  APPOINTMENT_UPDATE: 'appointment.update',
  APPOINTMENT_DELETE: 'appointment.delete',
  NOTE_CREATE: 'note.create',
  NOTE_VIEW: 'note.view',
  NOTE_UPDATE: 'note.update',
  BILLING_CREATE: 'billing.create',
  BILLING_VIEW: 'billing.view',
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  SETTINGS_UPDATE: 'settings.update',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];