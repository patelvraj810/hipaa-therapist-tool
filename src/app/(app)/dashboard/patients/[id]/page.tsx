'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPatient, savePatient } from '@/lib/store';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import type { Patient, ClinicalNote } from '@/lib/types';
import { NOTE_TYPES } from '@/lib/types';
import Link from 'next/link';

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState<{ type: keyof typeof NOTE_TYPES; title: string; content: string; sessionDate: string }>({
    type: 'session',
    title: '',
    content: '',
    sessionDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const p = getPatient(id);
    if (p) {
      setPatient(p);
      logAuditEvent({ action: AUDIT_ACTIONS.PATIENT_VIEW, resource_type: 'patient', resource_id: id, details: `Viewed patient: ${p.fullName}` });
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Patient not found</p>
        <Link href="/dashboard/patients" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">← Back to Patients</Link>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return;
    const note: ClinicalNote = {
      id: crypto.randomUUID(),
      patientId: id,
      type: newNote.type,
      title: newNote.title,
      content: newNote.content,
      sessionDate: newNote.sessionDate,
      createdAt: new Date().toISOString(),
    };
    const updated = { ...patient, notes: [note, ...patient.notes], updatedAt: new Date().toISOString() };
    savePatient(updated);
    logAuditEvent({ action: AUDIT_ACTIONS.NOTE_CREATE, resource_type: 'note', resource_id: note.id, details: `Created ${newNote.type} note for patient ${patient.fullName}` });
    setPatient(updated);
    setShowAddNote(false);
    setNewNote({ type: 'session', title: '', content: '', sessionDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <Link href="/dashboard/patients" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">← Back to Patients</Link>

      {/* Patient Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
            {patient.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{patient.fullName}</h1>
            <div className="text-gray-400 mt-1">{patient.email} · {patient.phone}</div>
            <div className="text-sm text-gray-500 mt-1">
              DOB: {patient.dateOfBirth || '—'} · Insurance: {patient.insuranceProvider || '—'} · Emergency: {patient.emergencyContact || '—'}
            </div>
          </div>
          <div className="hipaa-badge">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Encrypted
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clinical Notes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Clinical Notes</h2>
            <button onClick={() => setShowAddNote(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
              + Add Note
            </button>
          </div>

          {showAddNote && (
            <div className="glass-card p-6 mb-4">
              <h3 className="font-medium text-white mb-4">New Clinical Note</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Note Type</label>
                    <select
                      value={newNote.type}
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value as keyof typeof NOTE_TYPES })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(NOTE_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Session Date</label>
                    <input
                      type="date"
                      value={newNote.sessionDate}
                      onChange={(e) => setNewNote({ ...newNote, sessionDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Session note title"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Clinical Notes (AES-256 Encrypted)</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={6}
                    placeholder="Enter clinical observations, treatment notes, assessments..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddNote} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">Save Note</button>
                  <button onClick={() => setShowAddNote(false)} className="px-5 py-2 border border-gray-600 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {patient.notes.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">No clinical notes yet. Add your first note.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.notes.map((note) => (
                <div key={note.id} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium">
                        {NOTE_TYPES[note.type as keyof typeof NOTE_TYPES] || note.type}
                      </span>
                      <span className="text-sm text-gray-400">{note.sessionDate}</span>
                    </div>
                    <span className="text-xs text-gray-500">🔒 Encrypted</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-medium text-white mb-3">Patient Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="text-gray-300">{patient.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-gray-300">{patient.phone || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">DOB</span><span className="text-gray-300">{patient.dateOfBirth || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Emergency</span><span className="text-gray-300">{patient.emergencyContact || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Insurance</span><span className="text-gray-300">{patient.insuranceProvider || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Insurance ID</span><span className="text-gray-300">{patient.insuranceId || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Created</span><span className="text-gray-300">{new Date(patient.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-medium text-white mb-3">Access Log</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between"><span>Record viewed</span><span>Just now</span></div>
              <div className="flex justify-between"><span>Last modified</span><span>{new Date(patient.updatedAt).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Encryption</span><span className="text-green-400">AES-256 ✓</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}