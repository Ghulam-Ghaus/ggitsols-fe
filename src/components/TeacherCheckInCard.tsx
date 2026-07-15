'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Clock, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AttendanceInfo {
  id: string | null;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  remarks: string | null;
}

export default function TeacherCheckInCard() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [info, setInfo] = useState<AttendanceInfo | null>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local format

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/academic/teacher-attendance/today?date=${todayStr}`);
      setInfo(res.data.data || res.data || null);
    } catch (err: any) {
      console.error('Failed to load check-in status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const now = new Date().toISOString();
      await api.post('/academic/teacher-attendance/check-in', {
        date: todayStr,
        checkInTime: now,
        remarks: remarks.trim() || undefined,
      });
      await fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const now = new Date().toISOString();
      await api.post('/academic/teacher-attendance/check-out', {
        date: todayStr,
        checkOutTime: now,
      });
      await fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-xs text-slate-500 ml-2 font-medium">Checking attendance log...</span>
      </div>
    );
  }

  const isCheckedIn = !!info?.checkInTime;
  const isCheckedOut = !!info?.checkOutTime;

  return (
    <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-blue-400" />
          Staff Daily Check-In
        </h3>
        <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {info?.status || 'NOT SIGNED'}
        </span>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Date Display */}
        <div className="text-xs text-slate-400">
          Date: <span className="font-bold text-slate-200">{new Date().toDateString()}</span>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Checked In</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              {info?.checkInTime ? (
                new Date(info.checkInTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              ) : (
                <span className="text-slate-650 italic text-xs font-normal">Pending</span>
              )}
            </span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Checked Out</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              {info?.checkOutTime ? (
                new Date(info.checkOutTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              ) : (
                <span className="text-slate-650 italic text-xs font-normal">Pending</span>
              )}
            </span>
          </div>
        </div>

        {/* Check-in remarks input */}
        {!isCheckedIn && (
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Remarks / Notes</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Work from home, late check-in reason..."
              className="w-full bg-slate-950/60 border border-white/5 focus:border-blue-500/60 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none transition-all"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2">
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                'Check In Today'
              )}
            </button>
          ) : !isCheckedOut ? (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-500/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                'Check Out Today'
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-3 rounded-xl text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Checked in and out for today. Great work!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
