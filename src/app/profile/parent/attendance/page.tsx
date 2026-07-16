'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Loader2, Calendar, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  remarks: string | null;
}

interface AttendanceSummary {
  studentId: number;
  batch: {
    name: string;
    course: {
      name: string;
    };
  } | null;
  stats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    attendancePercentage: number;
  };
  records: AttendanceRecord[];
}

export default function ParentAttendancePage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('selectedStudentId');
    setStudentId(id);
  }, []);

  const fetchAttendance = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/academic/parents/students/${studentId}/attendance`);
      setData(res.data.data || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading attendance registry...</p>
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-8 text-center animate-in fade-in duration-200">
        <Users className="w-12 h-12 text-slate-650 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-400">No Child Selected</p>
        <p className="text-xs text-slate-500 mt-1">
          Please select a child profile on the{' '}
          <Link href="/profile/parent" className="text-purple-400 hover:underline">
            Parent Dashboard
          </Link>{' '}
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Guardian portal</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Child Attendance Registry
        </h1>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : !data || data.records.length === 0 ? (
        <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <Calendar className="w-12 h-12 text-slate-650 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">No Attendance Logged</p>
          <p className="text-xs text-slate-500 mt-1">
            Your child has no attendance registered on the system yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
              <span className={`text-2xl font-black block mt-2 ${
                data.stats.attendancePercentage >= 85 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {data.stats.attendancePercentage}%
              </span>
            </div>
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Present</span>
              <span className="text-2xl font-black text-emerald-405 block mt-2">{data.stats.present}</span>
            </div>
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Late / Excused</span>
              <span className="text-2xl font-black text-amber-450 block mt-2">
                {data.stats.late + data.stats.excused}
              </span>
            </div>
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Absent</span>
              <span className="text-2xl font-black text-rose-455 block mt-2">{data.stats.absent}</span>
            </div>
          </div>

          {/* History */}
          <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-200">Attendance Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.records.map((row) => {
                    const statusColors: Record<string, string> = {
                      PRESENT: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                      ABSENT: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                      LATE: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                      EXCUSED: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    };
                    return (
                      <tr key={row.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 px-2 font-semibold text-slate-250">
                          {new Date(row.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex px-2 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-455 italic">{row.remarks || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
