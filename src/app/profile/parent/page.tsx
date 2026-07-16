'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Loader2, Users, AlertCircle, Calendar, DollarSign, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: string;
  registrationNo: string;
  admissionDate: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  batch: {
    name: string;
    course: {
      name: string;
    };
  } | null;
}

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/parents/my-students');
      const kids: Student[] = res.data.data || res.data;
      setChildren(kids);

      // Default selection to first child or localStorage
      const cached = localStorage.getItem('selectedStudentId');
      if (cached && kids.some(k => String(k.id) === cached)) {
        setSelectedStudentId(cached);
      } else if (kids.length > 0) {
        setSelectedStudentId(String(kids[0].id));
        localStorage.setItem('selectedStudentId', String(kids[0].id));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your linked children registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleSelectChild = (id: string) => {
    setSelectedStudentId(id);
    localStorage.setItem('selectedStudentId', id);
    // Trigger custom storage event for sync
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Retrieving child profiles...</p>
      </div>
    );
  }

  const selectedChild = children.find(k => String(k.id) === selectedStudentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Guardian Portal</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Parent & Guardian Dashboard
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {children.length === 0 ? (
        <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-8 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">No Child Profiles Linked</p>
          <p className="text-xs text-slate-500 mt-1">
            There are no student accounts linked to your guardian email. Please contact the administration to associate your profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Child Selector List */}
          <div className="lg:col-span-1 bg-slate-900/30 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">My Children</h2>
            <div className="space-y-2">
              {children.map((kid) => {
                const isSelected = String(kid.id) === selectedStudentId;
                return (
                  <button
                    key={kid.id}
                    onClick={() => handleSelectChild(String(kid.id))}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/35 text-white'
                        : 'border-white/5 hover:border-white/10 text-slate-400 hover:text-white bg-slate-950/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{kid.user.firstName} {kid.user.lastName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{kid.registrationNo}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-purple-400 translate-x-0.5' : 'text-slate-650'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child Overview Details */}
          {selectedChild && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Overview Card */}
              <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-blue-500/10">
                    {selectedChild.user.firstName[0]}
                    {selectedChild.user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedChild.user.firstName} {selectedChild.user.lastName}</h3>
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mt-0.5">
                      Batch: {selectedChild.batch?.name || 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-white/5 pt-5">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block">Registration No:</span>
                      <span className="font-mono text-slate-200 font-bold">{selectedChild.registrationNo || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Admission Date:</span>
                      <span className="text-slate-200 font-medium">{selectedChild.admissionDate || '—'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block">Cohort Course Registry:</span>
                      <span className="text-slate-200 font-medium">{selectedChild.batch?.course?.name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Student Email:</span>
                      <span className="text-slate-200 truncate block font-medium">{selectedChild.user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/profile/parent/attendance"
                  className="bg-slate-900/20 border border-white/5 hover:border-purple-500/25 p-4 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-900/40"
                >
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-bold text-slate-250">Check Attendance</span>
                  <p className="text-[10px] text-slate-500">Monitor present & late records</p>
                </Link>

                <Link
                  href="/profile/parent/academic"
                  className="bg-slate-900/20 border border-white/5 hover:border-purple-500/25 p-4 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-900/40"
                >
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-250">Academic Dossier</span>
                  <p className="text-[10px] text-slate-500">View marks & exam performance</p>
                </Link>

                <Link
                  href="/profile/parent/finance"
                  className="bg-slate-900/20 border border-white/5 hover:border-purple-500/25 p-4 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-900/40"
                >
                  <DollarSign className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-250">Outstanding Fees</span>
                  <p className="text-[10px] text-slate-500">View child billing & pay invoices</p>
                </Link>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
