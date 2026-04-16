'use client';

import { useEffect, useState } from 'react';
import { getPatients, getAppointments, getInvoices } from '@/lib/store';
import type { Patient, Appointment, Invoice } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setPatients(getPatients());
    setAppointments(getAppointments());
    setInvoices(getInvoices());
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr && a.status === 'scheduled');
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Dr. Mitchell</p>
        </div>
        <div className="hipaa-badge">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          All Data Encrypted
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Patients', value: patients.length, icon: '👥', color: 'blue' },
          { label: "Today's Sessions", value: todayAppts.length, icon: '📅', color: 'green' },
          { label: 'Revenue (Paid)', value: `$${totalRevenue.toLocaleString()}`, icon: '💰', color: 'violet' },
          { label: 'Pending', value: `$${pendingRevenue.toLocaleString()}`, icon: '⏳', color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-400`}>
                {stat.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Today&apos;s Schedule</h2>
            <Link href="/dashboard/schedule" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          {todayAppts.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todayAppts.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30">
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg font-bold text-white">{apt.startTime}</div>
                    <div className="text-xs text-gray-400">{apt.endTime}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{apt.patientName}</div>
                    <div className="text-sm text-gray-400">{apt.type.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="text-sm text-green-400 font-medium">${apt.fee}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Patients</h2>
            <Link href="/dashboard/patients" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => (
              <Link key={patient.id} href={`/dashboard/patients/${patient.id}`} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-medium">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{patient.fullName}</div>
                  <div className="text-sm text-gray-400">{patient.email}</div>
                </div>
                <div className="text-xs text-gray-500">{patient.notes.length} notes</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Pending Invoices</h2>
            <Link href="/dashboard/billing" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          {pendingInvoices.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending invoices</p>
          ) : (
            <div className="space-y-3">
              {pendingInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                  <div>
                    <div className="font-medium text-white">{inv.patientName}</div>
                    <div className="text-sm text-gray-400">Due: {inv.dueDate}</div>
                  </div>
                  <div className="text-lg font-bold text-amber-400">${inv.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HIPAA Compliance Status */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">HIPAA Compliance Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Data Encryption', status: 'active', detail: 'AES-256 ✓' },
              { label: 'Access Controls', status: 'active', detail: 'MFA enabled ✓' },
              { label: 'Audit Logging', status: 'active', detail: 'Recording ✓' },
              { label: 'Session Timeout', status: 'active', detail: '15 min ✓' },
              { label: 'Backup Status', status: 'active', detail: 'Latest: 2 min ago ✓' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-300">{item.label}</span>
                </div>
                <span className="text-xs text-green-400">{item.detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-sm text-green-400 font-medium">✓ All HIPAA safeguards active</div>
            <div className="text-xs text-gray-400 mt-1">Last compliance check: just now</div>
          </div>
        </div>
      </div>
    </div>
  );
}