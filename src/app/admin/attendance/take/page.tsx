'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  Clock,
  HelpCircle,
  Save
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: number;
  registrationNo: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Batch {
  id: number;
  name: string;
  course: {
    name: string;
  };
}

interface AttendanceRecordInput {
  studentId: number;
  studentName: string;
  registrationNo: string;
  status: string; // 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  remarks: string;
}

function MarkAttendanceForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const batchId = searchParams.get('batchId');
  const date = searchParams.get('date');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [batch, setBatch] = useState<Batch | null>(null);
  const [records, setRecords] = useState<AttendanceRecordInput[]>([]);

  useEffect(() => {
    if (!batchId || !date) {
      setError('Missing batchId or date query parameters');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch batch info
        const batchRes = await api.get(`/academic/batches/${batchId}`);
        setBatch(batchRes.data.data || batchRes.data);

        // 2. Fetch all students enrolled in this batch
        const studentsRes = await api.get(`/academic/batches/${batchId}/students`);
        const students: Student[] = studentsRes.data.data || studentsRes.data;

        // 3. Fetch historical logs to check if attendance was already taken for this date
        const logsRes = await api.get(`/academic/batches/${batchId}/attendance`);
        const logs = logsRes.data.data || logsRes.data;
        const existingSession = logs.find((l: any) => l.date === date);

        let preloadedRecords: Record<number, { status: string; remarks: string }> = {};
        if (existingSession) {
          // Fetch full details of the existing session
          const sessionDetailsRes = await api.get(`/academic/attendance/${existingSession.id}`);
          const sessionDetails = sessionDetailsRes.data.data || sessionDetailsRes.data;
          
          if (sessionDetails && sessionDetails.records) {
            sessionDetails.records.forEach((rec: any) => {
              preloadedRecords[Number(rec.studentId)] = {
                status: rec.status,
                remarks: rec.remarks || ''
              };
            });
          }
        }

        // Initialize records input list
        const initialRecords = students.map((s) => ({
          studentId: s.id,
          studentName: `${s.user.firstName} ${s.user.lastName}`,
          registrationNo: s.registrationNo || 'N/A',
          status: preloadedRecords[s.id]?.status || 'PRESENT', // default to PRESENT
          remarks: preloadedRecords[s.id]?.remarks || ''
        }));

        setRecords(initialRecords);
      } catch (err: any) {
        setError(err.message || 'Failed to load class students list');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [batchId, date]);

  // Bulk set status for all students at once
  const handleBulkStatusChange = (status: string) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleStatusChange = (studentId: number, status: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        batchId: Number(batchId),
        date,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks.trim() || undefined
        }))
      };

      await api.post('/academic/attendance', payload);
      setSuccess('Student attendance register updated successfully!');
      
      setTimeout(() => {
        router.push('/admin/attendance');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit attendance');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading batch registry list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header action */}
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/attendance"
          className="p-2 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-purple-500/20 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Attendance Register</span>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {batch?.name} ({batch?.course?.name})
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main card */}
      {!error && (
        <div className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Target Date</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {new Date(date!).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Bulk options */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Mark All As:</span>
              <button
                onClick={() => handleBulkStatusChange('PRESENT')}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Present
              </button>
              <button
                onClick={() => handleBulkStatusChange('ABSENT')}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Absent
              </button>
              <button
                onClick={() => handleBulkStatusChange('LATE')}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Late
              </button>
              <button
                onClick={() => handleBulkStatusChange('EXCUSED')}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Excused
              </button>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-white/5 rounded-xl">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No Students Found</p>
              <p className="text-xs text-slate-500 mt-1">There are no students enrolled in this batch yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-2">Student Name</th>
                      <th className="py-3 px-2">Reg No.</th>
                      <th className="py-3 px-2 text-center">Status Selection</th>
                      <th className="py-3 px-2">Remarks / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr key={row.studentId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors text-sm">
                        {/* Student Info */}
                        <td className="py-3.5 px-2 font-semibold text-slate-200">
                          {row.studentName}
                        </td>
                        
                        {/* Registration Number */}
                        <td className="py-3.5 px-2 text-slate-450 font-medium">
                          {row.registrationNo}
                        </td>

                        {/* Status Buttons */}
                        <td className="py-3.5 px-2">
                          <div className="flex justify-center items-center space-x-1">
                            <button
                              onClick={() => handleStatusChange(row.studentId, 'PRESENT')}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                row.status === 'PRESENT'
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(row.studentId, 'ABSENT')}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                row.status === 'ABSENT'
                                  ? 'bg-rose-500 border-rose-500 text-white'
                                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(row.studentId, 'LATE')}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                row.status === 'LATE'
                                  ? 'bg-amber-500 border-amber-500 text-white'
                                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleStatusChange(row.studentId, 'EXCUSED')}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                row.status === 'EXCUSED'
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Excused
                            </button>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="py-3.5 px-2">
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={(e) => handleRemarksChange(row.studentId, e.target.value)}
                            placeholder="Add remark..."
                            className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 border-t border-white/5 pt-6">
                <Link
                  href="/admin/attendance"
                  className="px-5 py-3 rounded-xl border border-white/10 text-slate-350 hover:bg-slate-950/60 hover:text-white transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-purple-500/10 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Register...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Attendance Register
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarkAttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Preparing attendance workspace...</p>
      </div>
    }>
      <MarkAttendanceForm />
    </Suspense>
  );
}
