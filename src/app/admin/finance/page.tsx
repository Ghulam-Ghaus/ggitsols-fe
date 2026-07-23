'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  Calendar,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Filter,
  RefreshCw,
  Search,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  UserCheck
} from 'lucide-react';

interface Student {
  id: number;
  userId: string;
  registrationNo: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: {
    name: string;
  };
}

interface LedgerTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: string;
  date: string;
  description: string;
  referenceId: string | null;
  recordedByUserId: string | null;
}

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
  student: Student;
}

interface SalarySlip {
  id: number;
  userId: string;
  month: string;
  baseSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  status: 'SUBMITTED' | 'APPROVED' | 'PAID';
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'OTHER';
  submittedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  user: User;
}

interface Expense {
  id: number;
  category: string;
  amount: string;
  date: string;
  description: string;
  receiptUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  recordedByUserId: string | null;
  recordedByUser?: User;
}

interface FounderSummary {
  founderId: string;
  name: string;
  totalInvested: number;
  totalWithdrawn: number;
  netBalance: number;
}

interface FounderReport {
  ratioMessage: string;
  parityDiscrepancy: number;
  founders: FounderSummary[];
  rawTransactions: any[];
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'salaries' | 'expenses' | 'founders'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Date filters for P&L
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  // Data states
  const [pandl, setPandl] = useState<any>(null);
  const [fees, setFees] = useState<FeeCollection[]>([]);
  const [salaries, setSalaries] = useState<SalarySlip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [founderReport, setFounderReport] = useState<FounderReport | null>(null);
  
  // Selection sources for dropdowns
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Search/Filters in UI
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);

  // Form submission states
  const [selectedInvoice, setSelectedInvoice] = useState<FeeCollection | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    academicTerm: 'Fall 2026',
    totalAmount: '',
    originalAmount: '',
    discountAmount: '0',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: 'Tuition'
  });

  const [salaryForm, setSalaryForm] = useState({
    userId: '',
    month: today.toISOString().slice(0, 7),
    baseSalary: '',
    allowances: '0',
    deductions: '0',
    paymentMethod: 'BANK_TRANSFER' as const
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'UTILITIES',
    amount: '',
    date: today.toISOString().split('T')[0],
    description: '',
    receiptUrl: ''
  });

  const [founderForm, setFounderForm] = useState({
    founderId: '',
    type: 'INVESTMENT' as const,
    amount: '',
    date: today.toISOString().split('T')[0],
    description: ''
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview report
      const pandlRes = await api.get(`/finance/reports/p-and-l?startDate=${startDate}&endDate=${endDate}`);
      setPandl(pandlRes.data.data || pandlRes.data);

      // Fetch fees
      const feesRes = await api.get('/finance/fees');
      setFees(feesRes.data.data || feesRes.data);

      // Fetch salaries
      const salariesRes = await api.get('/finance/salaries');
      setSalaries(salariesRes.data.data || salariesRes.data);

      // Fetch expenses
      const expensesRes = await api.get('/finance/expenses');
      setExpenses(expensesRes.data.data || expensesRes.data);

      // Fetch founder reports
      const founderRes = await api.get('/finance/reports/founders');
      setFounderReport(founderRes.data.data || founderRes.data);

      // Fetch lists for modals
      const studentsRes = await api.get('/academic/students');
      setStudents(studentsRes.data.data || studentsRes.data);

      const usersRes = await api.get('/users');
      setUsers(usersRes.data.data || usersRes.data);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch financial records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, startDate, endDate]);

  // Pre-populate student invoice values based on default discount and billing plan
  useEffect(() => {
    if (!invoiceForm.studentId) return;
    const student = (students as any[]).find(s => String(s.id) === String(invoiceForm.studentId));
    if (student) {
      const isInstallment = student.paymentOption !== 'FULL_PAYMENT';
      const baseFee = student.batch?.course 
        ? (isInstallment ? Number(student.batch.course.monthlyFee || 0) : Number(student.batch.course.fee || 0))
        : 35000;
      
      const pct = Number(student.discountPercentage || 0);
      const flat = Number(student.discountFlat || 0);

      let discAmount = 0;
      if (pct > 0) {
        discAmount = baseFee * (pct / 100);
      } else if (flat > 0) {
        discAmount = Math.min(flat, baseFee);
      }

      const payAmount = baseFee - discAmount;

      setInvoiceForm(prev => ({
        ...prev,
        originalAmount: String(baseFee),
        discountAmount: String(discAmount),
        totalAmount: String(payAmount)
      }));
    }
  }, [invoiceForm.studentId, students]);

  // Handle invoice generation
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/finance/fees', {
        studentId: Number(invoiceForm.studentId),
        academicTerm: invoiceForm.academicTerm,
        totalAmount: Number(invoiceForm.totalAmount),
        originalAmount: Number(invoiceForm.originalAmount),
        discountAmount: Number(invoiceForm.discountAmount),
        dueDate: invoiceForm.dueDate,
        tags: invoiceForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setSuccess('Invoice created successfully');
      setShowInvoiceModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle record payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setActionLoading(true);
    setError(null);
    try {
      await api.post(`/finance/fees/${selectedInvoice.id}/pay`, {
        amount: Number(paymentAmount)
      });
      setSuccess('Payment recorded successfully');
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setPaymentAmount('');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle manual overdue trigger
  const handleTriggerOverdue = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await api.post('/finance/fees/trigger-overdue');
      setSuccess(`Completed overdue checks. Updated ${res.data.data?.updatedCount || res.data.updatedCount || 0} invoice(s).`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle draft salary slip
  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/finance/salaries', {
        userId: salaryForm.userId,
        month: salaryForm.month,
        baseSalary: Number(salaryForm.baseSalary),
        allowances: Number(salaryForm.allowances),
        deductions: Number(salaryForm.deductions),
        paymentMethod: salaryForm.paymentMethod
      });
      setSuccess('Salary slip created/submitted successfully');
      setShowSalaryModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update salary status (approve or pay)
  const handleUpdateSalaryStatus = async (id: number, status: 'APPROVED' | 'PAID') => {
    setActionLoading(true);
    setError(null);
    try {
      await api.patch(`/finance/salaries/${id}/status`, { status });
      setSuccess(`Salary status updated to ${status}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle log expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/finance/expenses', {
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        description: expenseForm.description,
        receiptUrl: expenseForm.receiptUrl
      });
      setSuccess('Expense logged successfully');
      setShowExpenseModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update expense status (pay)
  const handlePayExpense = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await api.patch(`/finance/expenses/${id}/status`, { status: 'PAID' });
      setSuccess('Expense status updated to PAID');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle founder transaction
  const handleCreateFounderTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/finance/founder-transactions', {
        founderId: founderForm.founderId,
        type: founderForm.type,
        amount: Number(founderForm.amount),
        date: founderForm.date,
        description: founderForm.description
      });
      setSuccess('Founder transaction recorded successfully');
      setShowFounderModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper formatting values
  const formatMoney = (val: number | string) => {
    return 'Rs. ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(val));
  };

  // Filter items based on query
  const filteredFees = fees.filter(f => {
    const studentName = `${f.student?.user?.firstName || ''} ${f.student?.user?.lastName || ''}`.toLowerCase();
    const invNo = f.invoiceNumber.toLowerCase();
    const query = searchQuery.toLowerCase();
    return studentName.includes(query) || invNo.includes(query) || f.status.toLowerCase().includes(query);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finance Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track student fee collections, salary slips, general ledger entries, operational expenses, and co-founder distributions.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={async () => {
              if (window.confirm('This will clear existing transaction logs and seed the simulation scenario. Proceed?')) {
                try {
                  setLoading(true);
                  const res = await api.post('/finance/seed-test-data');
                  setSuccess(res.data.data?.message || res.data.message || 'Simulation data seeded!');
                  fetchData();
                } catch (err: any) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="px-3.5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            disabled={loading}
          >
            Seed Simulation
          </button>
          <button
            onClick={() => {
              fetchData();
              setSuccess('Data refreshed');
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-650 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/50 shadow-sm transition-all hover:bg-slate-100 cursor-pointer"
            title="Refresh Data"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 flex items-start gap-3 text-sm animate-in fade-in-50 duration-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 text-sm animate-in fade-in-50 duration-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{success}</div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">X</button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-white/5 pb-px shrink-0">
        {[
          { id: 'overview', label: 'Overview & P&L', icon: DollarSign },
          { id: 'fees', label: 'Fee Invoicing', icon: FileText },
          { id: 'salaries', label: 'Teacher Salaries', icon: Briefcase },
          { id: 'expenses', label: 'Operational Expenses', icon: Building },
          { id: 'founders', label: 'Co-Founders (50/50)', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-purple-650 text-purple-600 dark:text-purple-400 font-bold'
                  : 'border-transparent text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading records from ledger...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* TAB 1: OVERVIEW & P&L */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Date Filters & Summary Cards */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Filter className="w-4 h-4" />
                  <span>Ledger Date Filter:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs shadow-inner"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs shadow-inner"
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-605"><TrendingUp className="w-4 h-4" /></span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-455 mt-2">
                      {formatMoney(pandl?.totalIncome || 0)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Student fees & investments</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
                    <span className="p-2 rounded-xl bg-red-500/10 text-red-605"><TrendingDown className="w-4 h-4" /></span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-red-650 dark:text-red-405 mt-2">
                      {formatMoney(pandl?.totalExpense || 0)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Salaries, utilities, dividends</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</span>
                    <span className={`p-2 rounded-xl ${Number(pandl?.netProfit || 0) >= 0 ? 'bg-purple-500/10 text-purple-650' : 'bg-amber-500/10 text-amber-655'}`}>
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-2 ${
                      Number(pandl?.netProfit || 0) >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-amber-500 dark:text-amber-400'
                    }`}>
                      {formatMoney(pandl?.netProfit || 0)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Retained institutional earnings</p>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <h2 className="font-bold text-base">General Ledger Entries</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold uppercase">
                    {pandl?.transactions?.length || 0} Txns
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
                        <th className="p-4">Type</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250 dark:divide-white/5">
                      {pandl?.transactions?.map((t: LedgerTransaction) => (
                        <tr key={t.id} className="hover:bg-slate-550/5 dark:hover:bg-slate-900/20">
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                              t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                              {t.type === 'INCOME' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {t.type}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs font-semibold">{t.category}</td>
                          <td className="p-4 whitespace-nowrap text-xs text-slate-400">{t.date}</td>
                          <td className="p-4 text-xs max-w-xs truncate">{t.description}</td>
                          <td className={`p-4 text-right font-bold whitespace-nowrap ${
                            t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {t.type === 'INCOME' ? '+' : '-'}{formatMoney(t.amount)}
                          </td>
                        </tr>
                      ))}
                      {(!pandl?.transactions || pandl.transactions.length === 0) && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No ledger transactions recorded in this date range.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FEE COLLECTIONS */}
          {activeTab === 'fees' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Controls bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:max-w-md bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-white/10 px-3 py-2 rounded-xl">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, invoice no, status..."
                    className="w-full bg-transparent border-0 outline-none text-sm placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTriggerOverdue}
                    className="px-4 py-2 border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    disabled={actionLoading}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Overdue Scan
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New Invoice
                  </button>
                </div>
              </div>

              {/* Invoices table */}
              <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
                        <th className="p-4">Invoice No</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Invoiced</th>
                        <th className="p-4 text-right">Collected</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250 dark:divide-white/5">
                      {filteredFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-slate-550/5 dark:hover:bg-slate-900/20">
                          <td className="p-4 whitespace-nowrap font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                            {fee.invoiceNumber}
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-bold">
                              {fee.student?.user?.firstName} {fee.student?.user?.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400">Reg: {fee.student?.registrationNo || 'N/A'}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs text-slate-400">{fee.dueDate}</td>
                          <td className="p-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              fee.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : fee.status === 'PARTIALLY_PAID'
                                ? 'bg-amber-500/10 text-amber-600'
                                : fee.status === 'OVERDUE'
                                ? 'bg-red-500/10 text-red-550 animate-pulse'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-semibold whitespace-nowrap">{formatMoney(fee.totalAmount)}</td>
                          <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">{formatMoney(fee.paidAmount)}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            {fee.status !== 'PAID' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(fee);
                                  setPaymentAmount(String(Number(fee.totalAmount) - Number(fee.paidAmount)));
                                  setShowPaymentModal(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold border border-emerald-555 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all cursor-pointer"
                              >
                                Record Pay
                              </button>
                            )}
                            {fee.status === 'PAID' && (
                              <span className="text-emerald-500 text-xs flex items-center justify-center gap-0.5"><CheckCircle className="w-3.5 h-3.5" /> Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredFees.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No student invoices found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SALARIES */}
          {activeTab === 'salaries' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Controls bar */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base">Teacher & Staff Payroll Logs</h2>
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Draft Payroll
                </button>
              </div>

              {/* Salaries slips table */}
              <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
                        <th className="p-4">Employee</th>
                        <th className="p-4">Pay Month</th>
                        <th className="p-4">Salary Splits</th>
                        <th className="p-4 text-right">Net Salary</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250 dark:divide-white/5">
                      {salaries.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-550/5 dark:hover:bg-slate-900/20">
                          <td className="p-4">
                            <div className="text-xs font-bold">{s.user?.firstName} {s.user?.lastName}</div>
                            <div className="text-[10px] text-slate-400">{s.user?.email}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs font-semibold">{s.month}</td>
                          <td className="p-4 text-xs text-slate-400">
                            <div>Base: {formatMoney(s.baseSalary)}</div>
                            <div>Bonus: +{formatMoney(s.allowances)} | Ded: -{formatMoney(s.deductions)}</div>
                          </td>
                          <td className="p-4 text-right font-extrabold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {formatMoney(s.netSalary)}
                          </td>
                          <td className="p-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              s.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : s.status === 'APPROVED'
                                ? 'bg-purple-500/10 text-purple-650'
                                : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {s.status === 'SUBMITTED' && (
                                <button
                                  onClick={() => handleUpdateSalaryStatus(s.id, 'APPROVED')}
                                  className="px-2.5 py-1 text-[11px] font-bold border border-purple-555 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg transition-all cursor-pointer"
                                  disabled={actionLoading}
                                >
                                  Approve
                                </button>
                              )}
                              {s.status !== 'PAID' && (
                                <button
                                  onClick={() => handleUpdateSalaryStatus(s.id, 'PAID')}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer"
                                  disabled={actionLoading}
                                >
                                  Disburse / Pay
                                </button>
                              )}
                              {s.status === 'PAID' && (
                                <span className="text-emerald-500 text-xs flex items-center justify-center gap-0.5"><CheckCircle className="w-3.5 h-3.5" /> Disbursed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {salaries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No payroll logs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GENERAL OPERATIONAL EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Controls bar */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base">Institutional Operational Expenses</h2>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Log Expense
                </button>
              </div>

              {/* Expenses table */}
              <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
                        <th className="p-4">Category</th>
                        <th className="p-4">Logged Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250 dark:divide-white/5">
                      {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-550/5 dark:hover:bg-slate-900/20">
                          <td className="p-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                              <Tag className="w-3.5 h-3.5 text-slate-455" />
                              {e.category}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs text-slate-400">{e.date}</td>
                          <td className="p-4 text-xs max-w-xs truncate">{e.description}</td>
                          <td className="p-4 text-right font-bold text-red-600 dark:text-red-405 whitespace-nowrap">
                            {formatMoney(e.amount)}
                          </td>
                          <td className="p-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              e.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-400'
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            {e.status !== 'PAID' && (
                              <button
                                onClick={() => handlePayExpense(e.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer"
                                disabled={actionLoading}
                              >
                                Mark Paid
                              </button>
                            )}
                            {e.status === 'PAID' && (
                              <span className="text-emerald-500 text-xs flex items-center justify-center gap-0.5"><CheckCircle className="w-3.5 h-3.5" /> Disbursed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {expenses.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No logged expenses found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: CO-FOUNDERS (50/50) */}
          {activeTab === 'founders' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Sync Warning Card */}
              {founderReport && (
                <div className={`p-5 rounded-2xl border flex items-start gap-3.5 ${
                  founderReport.parityDiscrepancy > 0.01
                    ? 'border-amber-500/25 bg-amber-500/5 text-amber-900 dark:text-amber-300'
                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-350'
                }`}>
                  {founderReport.parityDiscrepancy > 0.01 ? (
                    <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500 animate-bounce" />
                  ) : (
                    <CheckCircle className="w-6 h-6 shrink-0 text-emerald-500" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">Co-founder Partnership Status</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{founderReport.ratioMessage}</p>
                  </div>
                </div>
              )}

              {/* Founders Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {founderReport?.founders?.map((f, i) => (
                  <div key={f.founderId} className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[220px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-bl-[100px] pointer-events-none"></div>
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-650 uppercase tracking-widest block mb-1">Co-Founder #{i + 1}</span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{f.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400">{f.founderId}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                        <span className="text-[10px] text-slate-500 block uppercase">Invested</span>
                        <span className="text-sm font-extrabold text-slate-855 dark:text-slate-255">{formatMoney(f.totalInvested)}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                        <span className="text-[10px] text-slate-500 block uppercase">Returns</span>
                        <span className="text-sm font-extrabold text-red-500">{formatMoney(f.totalWithdrawn)}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                        <span className="text-[10px] text-slate-500 block uppercase">Net Equity</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{formatMoney(f.netBalance)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!founderReport?.founders || founderReport.founders.length === 0) && (
                  <div className="col-span-2 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 p-8 rounded-2xl text-center text-slate-400">
                    No co-founders have logged equity transactions.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Equity Audit Trail</h3>
                <button
                  onClick={() => setShowFounderModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Log Founder Txn
                </button>
              </div>

              {/* Equity Ledger Table */}
              <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
                        <th className="p-4">Founder</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Share %</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250 dark:divide-white/5">
                      {founderReport?.rawTransactions?.map((ft) => (
                        <tr key={ft.id} className="hover:bg-slate-550/5 dark:hover:bg-slate-900/20">
                          <td className="p-4 whitespace-nowrap">
                            <span className="text-xs font-bold">{ft.founder?.firstName} {ft.founder?.lastName}</span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              ft.type === 'INVESTMENT'
                                ? 'bg-emerald-500/10 text-emerald-650'
                                : 'bg-red-500/10 text-red-650'
                            }`}>
                              {ft.type}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap text-xs text-slate-400">{ft.date}</td>
                          <td className="p-4 text-xs max-w-xs truncate">{ft.description}</td>
                          <td className="p-4 text-right font-mono text-xs text-slate-400">{ft.sharePercentage}%</td>
                          <td className={`p-4 text-right font-bold whitespace-nowrap ${
                            ft.type === 'INVESTMENT' ? 'text-emerald-600 dark:text-emerald-455' : 'text-red-600 dark:text-red-405'
                          }`}>
                            {ft.type === 'INVESTMENT' ? '+' : '-'}{formatMoney(ft.amount)}
                          </td>
                        </tr>
                      ))}
                      {(!founderReport?.rawTransactions || founderReport.rawTransactions.length === 0) && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            No founder transactions reported yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODAL 1: NEW FEE INVOICE */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">Generate Student Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Select Student</label>
                <select
                  required
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.user?.firstName} {s.user?.lastName} ({s.registrationNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Term</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.academicTerm}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, academicTerm: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Original Fee (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 35000"
                    value={invoiceForm.originalAmount}
                    onChange={(e) => {
                      const orig = e.target.value;
                      const disc = invoiceForm.discountAmount;
                      const total = Number(orig) - Number(disc);
                      setInvoiceForm({ 
                        ...invoiceForm, 
                        originalAmount: orig, 
                        totalAmount: String(Math.max(0, total)) 
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Discount Applied (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 5000"
                    value={invoiceForm.discountAmount}
                    onChange={(e) => {
                      const disc = e.target.value;
                      const orig = invoiceForm.originalAmount;
                      const total = Number(orig) - Number(disc);
                      setInvoiceForm({ 
                        ...invoiceForm, 
                        discountAmount: disc, 
                        totalAmount: String(Math.max(0, total)) 
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-semibold text-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Payable Amount (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 30000"
                    value={invoiceForm.totalAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, totalAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-bold text-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={invoiceForm.tags}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tags: e.target.value })}
                    placeholder="Tuition, Library"
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-sm shadow-2xl relative">
            <h3 className="text-lg font-bold mb-2">Record Fee Payment</h3>
            <p className="text-xs text-slate-400 mb-4">
              Invoice: {selectedInvoice.invoiceNumber} for {selectedInvoice.student?.user?.firstName} {selectedInvoice.student?.user?.lastName}
            </p>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Amount to pay (Rs.)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Remaining balance: {formatMoney(Number(selectedInvoice.totalAmount) - Number(selectedInvoice.paidAmount))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DRAFT SALARY SLIP */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">Draft Teacher/Staff Payroll Slip</h3>
            <form onSubmit={handleCreateSalary} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Select Employee</label>
                <select
                  required
                  value={salaryForm.userId}
                  onChange={(e) => setSalaryForm({ ...salaryForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                >
                  <option value="">-- Choose Employee --</option>
                  {users.filter(u => u.role?.name === 'TEACHER' || u.role?.name === 'ADMIN').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.role?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Pay Month</label>
                  <input
                    type="month"
                    required
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Base Salary (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 4000"
                    value={salaryForm.baseSalary}
                    onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Allowances/Bonus (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={salaryForm.allowances}
                    onChange={(e) => setSalaryForm({ ...salaryForm, allowances: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Deductions (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={salaryForm.deductions}
                    onChange={(e) => setSalaryForm({ ...salaryForm, deductions: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Payment Method</label>
                <select
                  value={salaryForm.paymentMethod}
                  onChange={(e) => setSalaryForm({ ...salaryForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LOG GENERAL EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">Log Operational Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                  >
                    <option value="UTILITIES">Utilities</option>
                    <option value="RENT">Office Rent</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="SUPPLIES">Supplies</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 240.50"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Expense Date</label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
                <textarea
                  required
                  placeholder="Describe institutional utility details..."
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Receipt Document URL</label>
                <input
                  type="text"
                  placeholder="https://receipts.com/file.jpg"
                  value={expenseForm.receiptUrl}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receiptUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LOG FOUNDER TRANSACTION */}
      {showFounderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">Record Partner Equity Flow</h3>
            <form onSubmit={handleCreateFounderTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Select Co-Founder</label>
                <select
                  required
                  value={founderForm.founderId}
                  onChange={(e) => setFounderForm({ ...founderForm, founderId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                >
                  <option value="">-- Choose Founder --</option>
                  {users.filter(u => u.role?.name === 'ADMIN').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Flow Type</label>
                  <select
                    value={founderForm.type}
                    onChange={(e) => setFounderForm({ ...founderForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-bold"
                  >
                    <option value="INVESTMENT">Investment (+ Capital)</option>
                    <option value="RETURN">Return (- Withdrawal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={founderForm.amount}
                    onChange={(e) => setFounderForm({ ...founderForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Flow Date</label>
                <input
                  type="date"
                  required
                  value={founderForm.date}
                  onChange={(e) => setFounderForm({ ...founderForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Description</label>
                <textarea
                  required
                  placeholder="Describe investment capital details or returns share split..."
                  value={founderForm.description}
                  onChange={(e) => setFounderForm({ ...founderForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm outline-none h-20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowFounderModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
