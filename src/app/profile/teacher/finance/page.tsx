'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Loader2, DollarSign, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface SalarySlip {
  id: number;
  month: string;
  baseSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  status: 'SUBMITTED' | 'APPROVED' | 'PAID';
  paymentMethod: string;
  paidAt: string | null;
}

export default function TeacherFinancePage() {
  const [salaries, setSalaries] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/finance/my-salaries');
      setSalaries(res.data.data || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load salary statements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const formatMoney = (val: number | string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading payroll statement...</p>
      </div>
    );
  }

  // Calculate totals
  const totalPaid = salaries
    .filter(s => s.status === 'PAID')
    .reduce((sum, s) => sum + Number(s.netSalary), 0);
  const totalPending = salaries
    .filter(s => s.status !== 'PAID')
    .reduce((sum, s) => sum + Number(s.netSalary), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Payroll statement</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          My Salary Slips & Accounts
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Total Received (Paid)</span>
          <h3 className="text-xl font-bold mt-1 text-emerald-400">{formatMoney(totalPaid)}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Cleared through bank transfers/cash</p>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Outstanding (Submitted/Approved)</span>
          <h3 className="text-xl font-bold mt-1 text-amber-400">{formatMoney(totalPending)}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Currently pending administrative payout</p>
        </div>
      </div>

      {/* Salaries table */}
      <div className="bg-slate-900/30 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-wide">Monthly Salary Records</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
            {salaries.length} Slip(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                <th className="p-4">Pay Month</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Allowances</th>
                <th className="p-4">Deductions</th>
                <th className="p-4 text-right">Net Payout</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {salaries.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-purple-400 whitespace-nowrap">{s.month}</td>
                  <td className="p-4 whitespace-nowrap">{formatMoney(s.baseSalary)}</td>
                  <td className="p-4 text-emerald-400 whitespace-nowrap">+{formatMoney(s.allowances)}</td>
                  <td className="p-4 text-rose-450 whitespace-nowrap">-{formatMoney(s.deductions)}</td>
                  <td className="p-4 text-right font-extrabold whitespace-nowrap">{formatMoney(s.netSalary)}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                      s.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : s.status === 'APPROVED'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap uppercase tracking-wider text-[10px] font-semibold text-slate-400">
                    {s.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="p-4 whitespace-nowrap text-slate-450">{s.paidAt ? s.paidAt.split('T')[0] : '—'}</td>
                </tr>
              ))}
              {salaries.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No payroll summaries generated by admin yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
