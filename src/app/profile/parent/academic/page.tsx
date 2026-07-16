'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Clock,
  Shield,
  Loader2,
  AlertCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface StudentDetails {
  student: {
    id: number;
    registrationNo: string;
    admissionDate: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      createdAt: string;
    };
    batch: {
      id: number;
      name: string;
      course: {
        name: string;
        fee: number;
        duration: string;
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
  };
  quizzes: Array<{
    id: number;
    title: string;
    topic: string;
    maxMarks: number;
    obtainedMarks: number;
    attemptedAt: string;
    status: string;
    feedback: string;
    quiz: {
      topic: string;
      difficulty: string;
      timeLimitMins: number;
    };
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  }>;
  labs: Array<{
    id: number;
    title: string;
    status: string;
    submissionUrl: string | null;
    grade: string | null;
    obtainedMarks: number;
    maxMarks: number;
    submissionDate: string;
    remarks: string | null;
  }>;
  reviews: Array<{
    id: number;
    title: string;
    date: string;
    meetingType: string;
    attendees: string;
    discussion: string;
    feedback: string;
    status: string;
  }>;
}

export default function ParentChildAcademicDossierPage() {
  const router = useRouter();
  
  const [studentId, setStudentId] = useState<string | null>(null);
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'labs' | 'meetings' | 'profile'>('quizzes');
  const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('selectedStudentId');
    setStudentId(id);
  }, []);

  const fetchDetails = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/academic/parents/students/${studentId}/details`);
      setData(res.data.data || res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to retrieve child performance profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading academic dossier...</p>
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

  if (error || !data) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 p-4 rounded-xl flex items-center space-x-3 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error || 'Could not load child details'}</span>
      </div>
    );
  }

  const { student, quizzes, labs, reviews } = data;
  const fullName = `${student.user.firstName} ${student.user.lastName}`;
  const courseName = student.batch?.course?.name || 'Not Enrolled';
  const batchName = student.batch?.name || 'No Batch Assigned';

  const avgQuizScore = quizzes.length > 0
    ? Math.round((quizzes.reduce((acc, q) => acc + (q.obtainedMarks / q.maxMarks), 0) / quizzes.length) * 100)
    : 0;

  const completedLabsCount = labs.filter(l => l.status === 'COMPLETED' || l.status === 'GRADED').length;
  const labsCount = labs.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Guardian portal</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Child Academic Dossier
        </h1>
      </div>

      {/* Banner Card */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900/60 to-slate-900/30 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/25 flex items-center justify-center font-bold text-purple-300 text-2xl shrink-0">
              {student.user.firstName[0]}{student.user.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{fullName}</h3>
              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4">
                <span>{student.user.email}</span>
                <span className="font-mono bg-white/5 border border-white/5 rounded px-1.5 py-0.5">{student.registrationNo || 'UNREGISTERED'}</span>
              </p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Enrolled Program</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{courseName}</span>
            <span className="text-[11px] text-purple-450 font-semibold mt-0.5 block">{batchName}</span>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Quiz Score</span>
          <span className={`text-3xl font-black block mt-2 ${avgQuizScore >= 80 ? 'text-emerald-400' : avgQuizScore >= 50 ? 'text-amber-400' : 'text-rose-450'}`}>
            {avgQuizScore}%
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Calculated across {quizzes.length} attempts</p>
        </div>

        <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Completed Projects / Labs</span>
          <span className="text-3xl font-black text-blue-400 block mt-2">
            {completedLabsCount} <span className="text-xs font-normal text-slate-500">/ {labsCount} finished</span>
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Assignments tracking</p>
        </div>

        <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Parent-Teacher Reviews</span>
          <span className="text-3xl font-black text-purple-400 block mt-2">
            {reviews.length} <span className="text-xs font-normal text-slate-500">meeting logs</span>
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Feedback reviews</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-slate-900/30 border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex border-b border-white/5 pb-2 overflow-x-auto gap-4">
          {(['quizzes', 'labs', 'meetings', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-450 font-extrabold'
                  : 'border-transparent text-slate-450 hover:text-white'
              }`}
            >
              {tab.replace('meetings', 'reviews')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <p className="text-slate-500 text-center py-10 text-xs">No quiz records submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {quizzes.map((q) => {
                  const isExpanded = expandedQuizId === q.id;
                  const pct = Math.round((q.obtainedMarks / q.maxMarks) * 100);
                  return (
                    <div key={q.id} className="border border-white/5 rounded-2xl p-4 bg-slate-950/20 hover:border-white/10 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{q.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Topic: {q.topic} • Score: {q.obtainedMarks}/{q.maxMarks}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-455'}`}>{pct}%</span>
                          <button
                            onClick={() => setExpandedQuizId(isExpanded ? null : q.id)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-350 cursor-pointer"
                          >
                            {isExpanded ? 'Hide' : 'Review'}
                          </button>
                        </div>
                      </div>
                      {isExpanded && q.feedback && (
                        <div className="mt-4 border-t border-white/5 pt-3 text-[11px] text-slate-400 bg-purple-500/5 p-3 rounded-lg">
                          <strong>AI Evaluator Feedback:</strong> {q.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            {labs.length === 0 ? (
              <p className="text-slate-500 text-center py-10 text-xs">No project submissions recorded.</p>
            ) : (
              <div className="space-y-3">
                {labs.map((l) => (
                  <div key={l.id} className="border border-white/5 rounded-2xl p-4 bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{l.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Submitted: {l.submissionDate.split('T')[0]}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 border text-[9px] font-extrabold rounded-full uppercase tracking-wider ${
                      l.status === 'GRADED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-center py-10 text-xs">No feedback reviews logged.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="border border-white/5 rounded-2xl p-4 bg-slate-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">{r.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{r.date.split('T')[0]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">Discussion: {r.discussion}</p>
                    <p className="text-[11px] text-purple-400">Feedback: {r.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-400">
            <div className="space-y-3 bg-slate-950/30 p-5 rounded-2xl border border-white/5">
              <h4 className="font-bold text-slate-200 border-b border-white/5 pb-2">Academic Registration Details</h4>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Registration No</span>
                <span className="text-slate-200 font-bold font-mono">{student.registrationNo || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Admission Date</span>
                <span className="text-slate-200 font-semibold">{student.admissionDate || '—'}</span>
              </div>
            </div>
            <div className="space-y-3 bg-slate-950/30 p-5 rounded-2xl border border-white/5">
              <h4 className="font-bold text-slate-200 border-b border-white/5 pb-2">Institutional Directory Contacts</h4>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Email Address</span>
                <span className="text-slate-200 font-medium">{student.user.email}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Phone Number</span>
                <span className="text-slate-200 font-medium">{student.user.phone || 'No phone provided'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
