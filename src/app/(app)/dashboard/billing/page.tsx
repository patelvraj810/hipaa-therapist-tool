'use client';

import { useEffect, useState } from 'react';
import { getInvoices, saveInvoice, getPatients } from '@/lib/store';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import type { Invoice, Patient } from '@/lib/types';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newInv, setNewInv] = useState({ patientId: '', amount: 150, dueDate: '', type: 'session' as 'session' | 'insurance' });

  useEffect(() => {
    setInvoices(getInvoices());
    setPatients(getPatients());
  }, []);

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const handleAdd = () => {
    const patient = patients.find(p => p.id === newInv.patientId);
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      patientId: newInv.patientId,
      patientName: patient?.fullName || 'Unknown',
      amount: newInv.amount,
      status: 'pending',
      dueDate: newInv.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    saveInvoice(invoice);
    logAuditEvent({ action: AUDIT_ACTIONS.BILLING_CREATE, resource_type: 'billing', resource_id: invoice.id, details: `Created invoice for ${invoice.patientName} - $${invoice.amount}` });
    setInvoices(getInvoices());
    setShowAdd(false);
  };

  const handleMarkPaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      saveInvoice({ ...inv, status: 'paid', paidAt: new Date().toISOString() });
      logAuditEvent({ action: AUDIT_ACTIONS.BILLING_VIEW, resource_type: 'billing', resource_id: id, details: `Invoice marked as paid - $${inv.amount}` });
      setInvoices(getInvoices());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing</h1>
          <p className="text-gray-400 mt-1">Manage invoices, payments, and insurance claims</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="text-sm text-gray-400 mb-2">Collected</div>
          <div className="text-3xl font-bold text-green-400">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-gray-400 mb-2">Pending</div>
          <div className="text-3xl font-bold text-amber-400">${totalPending.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-gray-400 mb-2">Overdue</div>
          <div className="text-3xl font-bold text-red-400">${totalOverdue.toLocaleString()}</div>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">New Invoice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                <select value={newInv.patientId} onChange={(e) => setNewInv({ ...newInv, patientId: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                <input type="number" value={newInv.amount} onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input type="date" value={newInv.dueDate} onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })} className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Create Invoice</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-xl font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800/50">
          <h2 className="font-semibold text-white">All Invoices</h2>
        </div>
        <div className="divide-y divide-gray-800/50">
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No invoices yet. Create your first invoice.</div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-white">{inv.patientName}</div>
                  <div className="text-sm text-gray-400">Due: {inv.dueDate} · Created: {new Date(inv.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                    inv.status === 'overdue' ? 'bg-red-500/10 text-red-400' :
                    inv.status === 'cancelled' ? 'bg-gray-500/10 text-gray-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-white">${inv.amount}</span>
                  {inv.status === 'pending' && (
                    <button onClick={() => handleMarkPaid(inv.id)} className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-600/30 transition-colors">
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}