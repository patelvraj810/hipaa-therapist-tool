'use client';

import { useEffect, useState } from 'react';
import { getPatients, savePatient, deletePatient } from '@/lib/store';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import type { Patient } from '@/lib/types';
import Link from 'next/link';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newPatient, setNewPatient] = useState({ fullName: '', email: '', phone: '', dateOfBirth: '', emergencyContact: '', insuranceProvider: '', insuranceId: '' });

  useEffect(() => { setPatients(getPatients()); }, []);

  const filtered = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newPatient.fullName) return;
    const patient: Patient = {
      id: crypto.randomUUID(),
      ...newPatient,
      notes: [],
      appointments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePatient(patient);
    logAuditEvent({ action: AUDIT_ACTIONS.PATIENT_CREATE, resource_type: 'patient', resource_id: patient.id, details: `Created patient: ${patient.fullName}` });
    setPatients(getPatients());
    setShowAdd(false);
    setNewPatient({ fullName: '', email: '', phone: '', dateOfBirth: '', emergencyContact: '', insuranceProvider: '', insuranceId: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this patient? This action is logged for HIPAA compliance.')) return;
    deletePatient(id);
    logAuditEvent({ action: AUDIT_ACTIONS.PATIENT_DELETE, resource_type: 'patient', resource_id: id, details: 'Deleted patient record' });
    setPatients(getPatients());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Patients</h1>
          <p className="text-gray-400 mt-1">🔒 All records encrypted with AES-256</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name or email..."
          className="w-full max-w-md px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Patient Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Add New Patient</h2>
            <div className="space-y-4">
              {[
                { key: 'fullName', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                { key: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
                { key: 'insuranceProvider', label: 'Insurance Provider', type: 'text' },
                { key: 'insuranceId', label: 'Insurance ID', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={(newPatient as Record<string, string>)[field.key]}
                    onChange={(e) => setNewPatient({ ...newPatient, [field.key]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Add Patient</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-xl font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((patient) => (
          <div key={patient.id} className="glass-card p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-medium text-lg">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <Link href={`/dashboard/patients/${patient.id}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                    {patient.fullName}
                  </Link>
                  <div className="text-sm text-gray-400">{patient.email}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(patient.id)} className="text-gray-500 hover:text-red-400 transition-colors text-sm">✕</button>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>Phone:</span><span className="text-gray-300">{patient.phone || '—'}</span></div>
              <div className="flex justify-between"><span>DOB:</span><span className="text-gray-300">{patient.dateOfBirth || '—'}</span></div>
              <div className="flex justify-between"><span>Insurance:</span><span className="text-gray-300">{patient.insuranceProvider || '—'}</span></div>
              <div className="flex justify-between"><span>Notes:</span><span className="text-gray-300">{patient.notes.length}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800/50">
              <Link href={`/dashboard/patients/${patient.id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No patients found. Add your first patient to get started.
        </div>
      )}
    </div>
  );
}