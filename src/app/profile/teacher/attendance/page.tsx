'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Loader2, Calendar, CheckCircle2, AlertCircle, Users, Check, X, ShieldAlert } from 'lucide-react';

interface Batch {
  id: number;
  name: string;
  course: {
    name: string;
  };
}

interface Student {
  id: number;
  registrationNo: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function TeacherAttendancePage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | ''>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD
  
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Attendance form state
  const [records, setRecords] = useState<Record<number, { status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; remarks: string }>>({});

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const res = await api.get('/academic/batches');
        setBatches(res.data.data || res.data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to fetch batch registries');
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        const res = await api.get(`/academic/batches/${selectedBatchId}/students`);
        const fetchedStudents: Student[] = res.data.data || res.data;
        setStudents(fetchedStudents);

        // Initialize records
        const initialRecords: typeof records = {};
        fetchedStudents.forEach((student) => {
          initialRecords[student.id] = { status: 'PRESENT', remarks: '' };
        });
        setRecords(initialRecords);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to fetch students in this batch');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedBatchId]);

  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const submissionRecords = Object.entries(records).map(([studentId, data]) => ({
      studentId: Number(studentId),
      status: data.status,
      remarks: data.remarks || undefined
    }));

    try {
      await api.post('/academic/attendance', {
        batchId: Number(selectedBatchId),
        date,
        records: submissionRecords
      });
      setSuccessMsg(`Attendance for ${date} has been successfully submitted!`);
      // Scroll to top to show success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit attendance registry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBatches) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading course batches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Attendance Registry</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Mark Student Attendance
        </h1>
      </div>

      {/* Form Controls */}
      <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Cohort Batch</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-3 px-4 text-xs text-slate-350 outline-none transition-all cursor-pointer"
          >
            <option value="">-- Choose a Batch --</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name} ({batch.course?.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Registry Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-xs outline-none text-slate-100 transition-all"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-450 flex items-start gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 flex items-start gap-3 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Students sheet */}
      {selectedBatchId && (
        <div className="bg-slate-900/30 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-sm tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Cohort Roster
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
              {students.length} Student(s)
            </span>
          </div>

          {loadingStudents ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-slate-500 py-20 text-sm">No students assigned to this cohort yet.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                      <th className="p-4">Reg No</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4 text-center">Status Checks</th>
                      <th className="p-4">Remarks / Attendance Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map((student) => {
                      const currentRecord = records[student.id] || { status: 'PRESENT', remarks: '' };
                      return (
                        <tr key={student.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                            {student.registrationNo || 'UNASSIGNED'}
                          </td>
                          <td className="p-4 font-semibold whitespace-nowrap text-slate-200">
                            {student.user.firstName} {student.user.lastName}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {(['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as const).map((status) => {
                                const statusBtnColors = {
                                  PRESENT: 'hover:bg-emerald-600 hover:text-white border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
                                  LATE: 'hover:bg-amber-600 hover:text-white border-amber-500/20 text-amber-400 bg-amber-500/5',
                                  EXCUSED: 'hover:bg-blue-600 hover:text-white border-blue-500/20 text-blue-400 bg-blue-500/5',
                                  ABSENT: 'hover:bg-rose-600 hover:text-white border-rose-500/20 text-rose-400 bg-rose-500/5'
                                };
                                const activeColors = {
                                  PRESENT: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/10',
                                  LATE: 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/10',
                                  EXCUSED: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10',
                                  ABSENT: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/10'
                                };
                                const isSelected = currentRecord.status === status;

                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(student.id, status)}
                                    className={`px-3 py-1 border text-[9px] font-extrabold uppercase rounded-lg tracking-wide transition-all cursor-pointer ${
                                      isSelected ? activeColors[status] : statusBtnColors[status]
                                    }`}
                                  >
                                    {status}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={currentRecord.remarks}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              placeholder="e.g. excused due to fever"
                              className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-lg py-1.5 px-3 text-[11px] outline-none text-slate-350 placeholder-slate-650"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-t border-white/5 bg-slate-950/20 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-purple-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Attendance Logs
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
