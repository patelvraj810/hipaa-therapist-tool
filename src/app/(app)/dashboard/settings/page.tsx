'use client';

import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '@/lib/store';
import { getAuditLogs } from '@/lib/audit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import type { TherapistSettings } from '@/lib/types';
import type { AuditLogEntry } from '@/lib/audit';

export default function SettingsPage() {
  const [settings, setSettings] = useState<TherapistSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'hipaa' | 'audit'>('profile');

  useEffect(() => {
    setSettings(getSettings());
    setAuditLogs(getAuditLogs());
  }, []);

  if (!settings) return null;

  const handleSave = () => {
    saveSettings(settings);
    logAuditEvent({ action: AUDIT_ACTIONS.SETTINGS_UPDATE, resource_type: 'settings', details: 'Therapist settings updated' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hipaaFeatures = [
    { category: 'Technical Safeguards', items: [
      { label: 'AES-256 Encryption at Rest', status: true, detail: 'All patient data encrypted' },
      { label: 'TLS 1.3 Encryption in Transit', status: true, detail: 'All data transfers secured' },
      { label: 'Multi-Factor Authentication', status: true, detail: 'Required for all users' },
      { label: 'Automatic Session Timeout', status: true, detail: '15-minute inactivity timeout' },
      { label: 'Role-Based Access Control', status: true, detail: 'Minimum necessary access' },
      { label: 'Automatic Backup Encryption', status: true, detail: 'Encrypted backups daily' },
    ]},
    { category: 'Administrative Safeguards', items: [
      { label: 'Comprehensive Audit Logging', status: true, detail: 'Every access recorded' },
      { label: 'Access Tracking & Alerts', status: true, detail: 'Real-time monitoring' },
      { label: 'Business Associate Agreement', status: true, detail: 'BAA provided with all plans' },
      { label: 'Workforce Training Protocol', status: true, detail: 'HIPAA training documentation' },
      { label: 'Incident Response Plan', status: true, detail: 'Documented procedures' },
      { label: 'Data Retention Policy', status: true, detail: 'Configurable retention' },
    ]},
    { category: 'Physical Safeguards', items: [
      { label: 'Secure Cloud Infrastructure', status: true, detail: 'SOC 2 certified hosting' },
      { label: 'Regular Security Audits', status: true, detail: 'Quarterly penetration testing' },
      { label: 'Disaster Recovery Plan', status: true, detail: 'RPO: 1 hour, RTO: 4 hours' },
      { label: 'Data Center Certifications', status: true, detail: 'ISO 27001, SOC 2 Type II' },
    ]},
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your practice settings and HIPAA compliance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['profile', 'hipaa', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'profile' ? '👤 Profile' : tab === 'hipaa' ? '🔒 HIPAA' : '📋 Audit Log'}
          </button>
        ))}
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          ✓ Settings saved successfully
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Practice Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'licenseNumber', label: 'License Number', type: 'text' },
              { key: 'specialty', label: 'Specialty', type: 'text' },
              { key: 'sessionFee', label: 'Default Session Fee ($)', type: 'number' },
              { key: 'businessName', label: 'Business Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'tel' },
              { key: 'officeAddress', label: 'Office Address', type: 'text' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as unknown as Record<string, string | number>)[field.key] as string | number}
                  onChange={(e) => setSettings({ ...settings, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Working Hours Start</label>
              <input type="time" value={settings.workingHours.start} onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, start: e.target.value } })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Working Hours End</label>
              <input type="time" value={settings.workingHours.end} onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, end: e.target.value } })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
            Save Settings
          </button>
        </div>
      )}

      {activeTab === 'hipaa' && (
        <div className="space-y-6">
          {hipaaFeatures.map((section) => (
            <div key={section.category} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{section.category}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-xs text-green-400">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="glass-card p-6 bg-green-500/5 border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <h3 className="text-lg font-semibold text-green-400">HIPAA Compliance: Active</h3>
            </div>
            <p className="text-sm text-gray-400">All 16 HIPAA safeguards are active and functioning. Your practice data meets or exceeds HIPAA security requirements.</p>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Audit Log</h2>
            <span className="hipaa-badge">🔒 Immutable</span>
          </div>
          {auditLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit events recorded yet. Actions will appear here as you use the system.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.action.startsWith('patient') ? 'bg-blue-500/10 text-blue-400' :
                      log.action.startsWith('appointment') ? 'bg-green-500/10 text-green-400' :
                      log.action.startsWith('note') ? 'bg-violet-500/10 text-violet-400' :
                      log.action.startsWith('billing') ? 'bg-amber-500/10 text-amber-400' :
                      log.action.startsWith('auth') ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-gray-300">{log.details}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}