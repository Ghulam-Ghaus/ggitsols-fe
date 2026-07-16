'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import TeacherCheckInCard from '@/components/TeacherCheckInCard';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  remarks: string | null;
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/teacher-attendance/me');
      setHistory(res.data.data || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Faculty Dashboard</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Check In Card */}
        <div className="md:col-span-1">
          <TeacherCheckInCard />
        </div>

        {/* Attendance History */}
        <div className="md:col-span-2 bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            My Attendance Registry
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 p-4 rounded-xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-slate-500 py-10 text-sm">No check-in logs recorded on your dashboard yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Check In</th>
                    <th className="py-2.5 px-2">Check Out</th>
                    <th className="py-2.5 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-2 font-medium">{rec.date}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex px-2 py-0.5 border text-[9px] font-bold rounded-full uppercase tracking-wider ${
                          rec.status === 'PRESENT'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-400 font-mono">
                        {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-3 px-2 text-slate-400 font-mono">
                        {rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-3 px-2 text-slate-550 italic">{rec.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
