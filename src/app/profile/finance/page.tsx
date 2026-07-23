'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import {
  DollarSign,
  Globe,
  Power,
  Shield,
  ArrowLeft,
  Loader2,
  FileText,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';

interface FeeCollection {
  id: number;
  invoiceNumber: string;
  studentId: number;
  academicTerm: string;
  totalAmount: string;
  paidAmount: string;
  dueDate: string;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  tags: string[] | null;
  invoicedAt: string;
  paidAt: string | null;
}

export default function StudentFinancePage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();

  const [invoices, setInvoices] = useState<FeeCollection[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Simulated Checkout Modal States
  const [selectedInvoice, setSelectedInvoice] = useState<FeeCollection | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Card Mock Info
  const [cardForm, setCardForm] = useState({
    name: '',
    number: '4111 2222 3333 4444',
    expiry: '12/28',
    cvc: '123'
  });

  const fetchInvoices = async () => {
    try {
      setPageLoading(true);
      setErrorMsg(null);
      const res = await api.get('/finance/my-fees');
      setInvoices(res.data.data || res.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch student invoices');
    } finally {
      setPageLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    } else if (user) {
      fetchInvoices();
    }
  }, [loading, token, user, router]);

  // Handle Pay Submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setSubmittingPayment(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.post(`/finance/my-fees/${selectedInvoice.id}/pay`, {
        amount: Number(payAmount)
      });
      setSuccessMsg(`Simulated Payment of Rs. ${Number(payAmount).toFixed(2)} completed successfully!`);
      setShowCheckoutModal(false);
      setSelectedInvoice(null);
      setPayAmount('');
      fetchInvoices();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment transaction failed');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const formatMoney = (val: number | string) => {
    return 'Rs. ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(val));
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading fee portal...</p>
      </div>
    );
  }

  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Finance portal</span>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            My Fees & Invoices
          </h1>
        </div>
        <span className="text-xs text-slate-500">Academic Year: 2026</span>
      </div>

      {/* Banner Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 flex items-start gap-3 text-sm animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-start gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{successMsg}</div>
        </div>
      )}

        {/* Dashboard Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Total Invoiced Fees</span>
            <h3 className="text-xl font-bold mt-1 text-slate-100">{formatMoney(totalInvoiced)}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Cumulative institutional billing</p>
          </div>
          
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Fees Settled / Paid</span>
            <h3 className="text-xl font-bold mt-1 text-emerald-400">{formatMoney(totalPaid)}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Cleared through online payments</p>
          </div>

          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-3xl pointer-events-none"></div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Outstanding Balance</span>
            <h3 className={`text-xl font-bold mt-1 ${totalOutstanding > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
              {formatMoney(totalOutstanding)}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Currently due or pending payment</p>
          </div>
        </div>

        {/* Invoice Audit Ledger */}
        <div className="bg-slate-900/30 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-sm tracking-wide">Institutional Fee Statements</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
              {invoices.length} Invoice(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Academic Term</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Invoiced</th>
                  <th className="p-4 text-right">Balance Due</th>
                  <th className="p-4 text-center">Checkout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => {
                  const balance = Number(inv.totalAmount) - Number(inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-blue-400 whitespace-nowrap">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs font-medium">{inv.academicTerm}</td>
                      <td className="p-4 whitespace-nowrap text-xs text-slate-450">{inv.dueDate}</td>
                      <td className="p-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : inv.status === 'OVERDUE'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium whitespace-nowrap">{formatMoney(inv.totalAmount)}</td>
                      <td className={`p-4 text-right font-bold whitespace-nowrap ${balance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {formatMoney(balance)}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {balance > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPayAmount(String(balance));
                              setShowCheckoutModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer mx-auto"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Online
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-xs font-bold inline-flex items-center gap-0.5"><CheckCircle className="w-3.5 h-3.5" /> Cleared</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No invoices issued for your cohort registry yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>



      {/* CHECKOUT MODAL */}
      {showCheckoutModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Lock className="w-4 h-4" /></div>
              <div>
                <h3 className="text-sm font-bold">Secure Card Checkout</h3>
                <p className="text-[10px] text-slate-400">Invoice: {selectedInvoice.invoiceNumber}</p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Payable Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-xl bg-slate-950 text-sm font-bold outline-none text-emerald-400 shadow-inner"
                />
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Simulated Visa Details</span>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={cardForm.number}
                    className="w-full px-3 py-1.5 border border-white/5 rounded-lg bg-slate-950/60 text-xs outline-none text-slate-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Expiration</label>
                    <input
                      type="text"
                      required
                      readOnly
                      value={cardForm.expiry}
                      className="w-full px-3 py-1.5 border border-white/5 rounded-lg bg-slate-950/60 text-xs outline-none text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">CVC</label>
                    <input
                      type="password"
                      required
                      readOnly
                      value={cardForm.cvc}
                      className="w-full px-3 py-1.5 border border-white/5 rounded-lg bg-slate-950/60 text-xs outline-none text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setSelectedInvoice(null);
                    setPayAmount('');
                  }}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/20 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingPayment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
