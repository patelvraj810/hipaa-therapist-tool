'use client';

import { useEffect, useState } from 'react';
import { getAppointments, saveAppointment, deleteAppointment, checkConflict, getPatients } from '@/lib/store';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import type { Appointment, Patient } from '@/lib/types';
import { SESSION_TYPES, APPOINTMENT_STATUS } from '@/lib/types';

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [conflictError, setConflictError] = useState('');
  const [newApt, setNewApt] = useState({
    patientId: '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'individual_therapy' as Appointment['type'],
    fee: 150,
  });

  useEffect(() => {
    setAppointments(getAppointments());
    setPatients(getPatients());
  }, []);

  const grouped = appointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(grouped).sort();

  const handleAdd = () => {
    setConflictError('');
    const selectedPatient = patients.find(p => p.id === newApt.patientId);
    const conflict = checkConflict(newApt.date, newApt.startTime, newApt.endTime);
    if (conflict) {
      setConflictError(`⚠️ Conflict: ${conflict.patientName} already has an appointment at ${conflict.startTime}-${conflict.endTime} on ${conflict.date}`);
      return;
    }
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      patientId: newApt.patientId,
      patientName: selectedPatient?.fullName || newApt.patientName || 'Unknown',
      date: newApt.date,
      startTime: newApt.startTime,
      endTime: newApt.endTime,
      type: newApt.type,
      status: 'scheduled',
      fee: newApt.fee,
      createdAt: new Date().toISOString(),
    };
    saveAppointment(appointment);
    logAuditEvent({ action: AUDIT_ACTIONS.APPOINTMENT_CREATE, resource_type: 'appointment', resource_id: appointment.id, details: `Scheduled ${newApt.type} with ${appointment.patientName}` });
    setAppointments(getAppointments());
    setShowAdd(false);
    setNewApt({ patientId: '', patientName: '', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', type: 'individual_therapy', fee: 150 });
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      saveAppointment({ ...apt, status });
      logAuditEvent({ action: AUDIT_ACTIONS.APPOINTMENT_UPDATE, resource_type: 'appointment', resource_id: id, details: `Status changed to ${status}` });
      setAppointments(getAppointments());
    }
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    logAuditEvent({ action: AUDIT_ACTIONS.APPOINTMENT_DELETE, resource_type: 'appointment', resource_id: id, details: 'Appointment deleted' });
    setAppointments(getAppointments());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Schedule</h1>
          <p className="text-gray-400 mt-1">Manage appointments with conflict detection</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + New Appointment
        </button>
      </div>

      {/* Add Appointment Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">New Appointment</h2>
            {conflictError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{conflictError}</div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                <select
                  value={newApt.patientId}
                  onChange={(e) => setNewApt({ ...newApt, patientId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Session Type</label>
                <select
                  value={newApt.type}
                  onChange={(e) => setNewApt({ ...newApt, type: e.target.value as Appointment['type'] })}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(SESSION_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input type="date" value={newApt.date} onChange={(e) => setNewApt({ ...newApt, date: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input type="time" value={newApt.startTime} onChange={(e) => setNewApt({ ...newApt, startTime: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input type="time" value={newApt.endTime} onChange={(e) => setNewApt({ ...newApt, endTime: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Session Fee ($)</label>
                <input type="number" value={newApt.fee} onChange={(e) => setNewApt({ ...newApt, fee: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Schedule</button>
              <button onClick={() => { setShowAdd(false); setConflictError(''); }} className="flex-1 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-xl font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments by Date */}
      {sortedDates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500">No appointments scheduled. Click &quot;+ New Appointment&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-3">
                {grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((apt) => (
                  <div key={apt.id} className="glass-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[70px]">
                          <div className="text-lg font-bold text-white">{apt.startTime}</div>
                          <div className="text-xs text-gray-400">{apt.endTime}</div>
                        </div>
                        <div>
                          <div className="font-medium text-white">{apt.patientName}</div>
                          <div className="text-sm text-gray-400">{SESSION_TYPES[apt.type] || apt.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          apt.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                          apt.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          apt.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {APPOINTMENT_STATUS[apt.status]}
                        </span>
                        <span className="text-gray-300 font-medium">${apt.fee}</span>
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as Appointment['status'])}
                          className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white focus:outline-none"
                        >
                          {Object.entries(APPOINTMENT_STATUS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                        <button onClick={() => handleDelete(apt.id)} className="text-gray-500 hover:text-red-400 transition-colors text-sm">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}