'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Users, 
  Search, 
  BookOpen, 
  Edit2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  X,
  Save,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: number;
  registrationNo: string | null;
  admissionDate: string | null;
  userId: string;
  batchId: number | null;
  paymentOption?: 'FULL_PAYMENT' | 'INSTALLMENT';
  discountPercentage?: number;
  discountFlat?: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  batch: {
    id: number;
    name: string;
    course: {
      name: string;
    };
  } | null;
  parents: Array<{
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    };
  }>;
}

interface Batch {
  id: number;
  name: string;
  course: {
    name: string;
  };
}

export default function AdminStudentManagementRegistry() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatchId, setFilterBatchId] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBatchId]);

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [regNo, setRegNo] = useState('');
  const [batchIdVal, setBatchIdVal] = useState<string>('');
  const [paymentOptionVal, setPaymentOptionVal] = useState<'FULL_PAYMENT' | 'INSTALLMENT'>('INSTALLMENT');
  const [discountPercentageVal, setDiscountPercentageVal] = useState<string>('0');
  const [discountFlatVal, setDiscountFlatVal] = useState<string>('0');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentRes = await api.get('/academic/students');
      setStudents(studentRes.data.data || studentRes.data);

      const batchRes = await api.get('/academic/batches');
      setBatches(batchRes.data.data || batchRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to query student cohort database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setRegNo(student.registrationNo || '');
    setBatchIdVal(student.batchId ? String(student.batchId) : 'unassigned');
    setPaymentOptionVal(student.paymentOption || 'INSTALLMENT');
    setDiscountPercentageVal(String(student.discountPercentage ?? 0));
    setDiscountFlatVal(String(student.discountFlat ?? 0));
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        registrationNo: regNo || null,
        batchId: batchIdVal === 'unassigned' ? null : Number(batchIdVal),
        paymentOption: paymentOptionVal,
        discountPercentage: Number(discountPercentageVal) || 0,
        discountFlat: Number(discountFlatVal) || 0
      };

      await api.patch(`/academic/students/${selectedStudent.id}`, payload);
      setSuccess('Student registration metrics updated successfully!');
      setEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to commit student profile changes.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logic
  const filteredStudents = students.filter(student => {
    const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
    const reg = (student.registrationNo || '').toLowerCase();
    const email = student.user.email.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) || 
                        reg.includes(searchTerm.toLowerCase()) || 
                        email.includes(searchTerm.toLowerCase());

    if (filterBatchId === 'all') return matchSearch;
    if (filterBatchId === 'unassigned') return matchSearch && !student.batchId;
    return matchSearch && student.batchId === Number(filterBatchId);
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Loading Student Registries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Management</h1>
          <p className="text-slate-400 text-xs mt-1">Manage registration numbers, assign batch cohorts, and view student academic dossiers.</p>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="flex items-start space-x-2 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-emerald-200 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/20 border border-white/5 p-4 rounded-2xl shadow-md">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/5 focus:border-purple-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none"
            placeholder="Search by name, reg no, or email..."
          />
        </div>

        {/* Batch Filter dropdown */}
        <div className="w-full md:w-56">
          <select
            value={filterBatchId}
            onChange={(e) => setFilterBatchId(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/5 focus:border-purple-500/50 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Cohorts / Batches</option>
            <option value="unassigned">Unassigned / No Batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.name} ({batch.course?.name})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Grid Table */}
      <div className="bg-slate-900/10 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Student Details</th>
                <th className="py-4 px-4">Registration No</th>
                <th className="py-4 px-4">Current Cohort / Batch</th>
                <th className="py-4 px-4">Parent / Guardian Contacts</th>
                <th className="py-4 px-4">Admission Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 text-xs">
                    No student records match the filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300 shrink-0">
                          {student.user.firstName[0]}{student.user.lastName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{student.user.firstName} {student.user.lastName}</span>
                          <span className="text-[10px] text-slate-500 block">{student.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-200">
                      {student.registrationNo || (
                        <span className="text-rose-500/70 text-[10px] italic">Not Set</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {student.batch ? (
                        <div>
                          <span className="font-bold text-slate-200 block">{student.batch.name}</span>
                          <span className="text-[10px] text-slate-500 block">{student.batch.course?.name}</span>
                        </div>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wide">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {student.parents.length === 0 ? (
                        <span className="text-slate-600 text-[10px]">None linked</span>
                      ) : (
                        student.parents.map(p => (
                          <div key={p.id} className="text-[11px] mb-0.5">
                            <span className="font-semibold text-slate-300">{p.user.firstName} {p.user.lastName}</span>
                            {p.user.phone && <span className="text-slate-500 text-[10px] ml-1">({p.user.phone})</span>}
                          </div>
                        ))
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {student.admissionDate || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/students/${student.user.id}`}
                          className="p-1.5 bg-slate-950/80 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 text-slate-400 hover:text-purple-300 rounded-lg transition-all cursor-pointer flex items-center"
                          title="View Student Performance"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1">Dossier</span>
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 bg-slate-950/80 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-300 rounded-lg transition-all cursor-pointer flex items-center"
                          title="Configure Batch & Registration"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1">Config</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/20 border-t border-slate-200 dark:border-white/5 gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span>records per page</span>
            </div>

            <div className="font-medium text-slate-600 dark:text-slate-400">
              Showing {Math.min(filteredStudents.length, (currentPage - 1) * pageSize + 1)} to {Math.min(filteredStudents.length, currentPage * pageSize)} of {filteredStudents.length} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold font-mono">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredStudents.length / pageSize), prev + 1))}
                disabled={currentPage >= Math.ceil(filteredStudents.length / pageSize)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
         EDIT STUDENT DETAILS MODAL OVERLAY
         ========================================== */}
      {editModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-1">Configure Student Profile</h2>
            <p className="text-xs text-purple-400 mb-6 font-semibold">
              Student: <span className="text-slate-300">{selectedStudent.user.firstName} {selectedStudent.user.lastName}</span>
            </p>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Registration No</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. GGIT-2026-0045"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Cohort / Class Batch</label>
                <select
                  value={batchIdVal}
                  onChange={(e) => setBatchIdVal(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none cursor-pointer"
                >
                  <option value="unassigned">Unassigned / Remove from Batch</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.name} ({batch.course?.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Billing / Fee Plan</label>
                <select
                  value={paymentOptionVal}
                  onChange={(e) => setPaymentOptionVal(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none cursor-pointer"
                >
                  <option value="INSTALLMENT">Monthly Installment Billed</option>
                  <option value="FULL_PAYMENT">One-Time Full Tuition Payment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentageVal}
                    onChange={(e) => setDiscountPercentageVal(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                    placeholder="e.g. 15"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Flat Discount (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountFlatVal}
                    onChange={(e) => setDiscountFlatVal(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start space-x-2 bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 text-rose-200 text-xs">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center font-bold"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <Save className="w-4 h-4 mr-1.5" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
