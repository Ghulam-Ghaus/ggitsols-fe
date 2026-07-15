'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import {
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string; // 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
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

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academic/students/me/attendance');
        setData(res.data.data || res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load attendance records');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Student Dashboard</span>
        <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
          My Attendance Record
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
            Your batch has no attendance logged on the system yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Percentage */}
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
              <span className={`text-3xl font-black block mt-2 ${
                data.stats.attendancePercentage >= 85 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {data.stats.attendancePercentage}%
              </span>
            </div>
            {/* Present */}
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Present</span>
              <span className="text-3xl font-black text-emerald-405 block mt-2">{data.stats.present}</span>
            </div>
            {/* Late / Excused */}
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Late / Excused</span>
              <span className="text-3xl font-black text-amber-450 block mt-2">
                {data.stats.late + data.stats.excused}
              </span>
            </div>
            {/* Absent */}
            <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Absent</span>
              <span className="text-3xl font-black text-rose-455 block mt-2">{data.stats.absent}</span>
            </div>
          </div>

          {/* Attendance History List */}
          <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-200">Attendance Log</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((row) => {
                    const statusColors: Record<string, string> = {
                      PRESENT: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                      ABSENT: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                      LATE: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                      EXCUSED: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    };

                    return (
                      <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors text-sm">
                        <td className="py-3.5 px-2 font-semibold text-slate-250">
                          {new Date(row.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex px-2 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${statusColors[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-455 italic">
                          {row.remarks || <span className="text-slate-650 not-italic text-xs">—</span>}
                        </td>
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
