'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  ArrowLeft, 
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
  AlertCircle
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
    obtainedMarks: number;
    maxMarks: number;
    status: string;
    startedAt: string;
    submittedAt: string;
    answers: Record<number, string>;
    quiz: {
      title: string;
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

export default function StudentPerformanceDashboard() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId;
  
  const [data, setData] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'labs' | 'meetings' | 'profile'>('quizzes');
  const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/academic/students/user/${userId}/details`);
        setData(res.data.data || res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load student performance profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase">Loading Performance Profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-rose-400 text-sm font-bold">{error || 'Student not found'}</p>
        <button 
          onClick={() => router.push('/admin/users')}
          className="text-xs font-semibold uppercase bg-slate-900 border border-white/5 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          Back to User Registry
        </button>
      </div>
    );
  }

  const { student, quizzes, labs, reviews } = data;
  const fullName = `${student.user.firstName} ${student.user.lastName}`;
  const courseName = student.batch?.course?.name || 'Not Enrolled';
  const batchName = student.batch?.name || 'No Batch Assigned';

  // Math metrics
  const avgQuizScore = quizzes.length > 0
    ? Math.round((quizzes.reduce((acc, q) => acc + (q.obtainedMarks / q.maxMarks), 0) / quizzes.length) * 100)
    : 0;

  const completedLabsCount = labs.filter(l => l.status === 'COMPLETED' || l.status === 'GRADED').length;
  const labsCount = labs.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Navigation Back Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900/40 border border-white/5 rounded-xl px-4 py-2.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
        <span className="text-xs text-slate-500 font-mono">Academic Registry ID: #{student.id}</span>
      </div>

      {/* Header Profile Dashboard Widget */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-slate-900/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-purple-600/10 border border-purple-500/25 flex items-center justify-center font-bold text-purple-300 text-2xl md:text-3xl shrink-0 shadow-md">
              {student.user.firstName[0]}{student.user.lastName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest">
                  Student Profile
                </span>
              </div>
              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-y-1.5 gap-x-4">
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 text-blue-400 mr-1.5 shrink-0" /> {student.user.email}</span>
                {student.user.phone && <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-purple-400 mr-1.5 shrink-0" /> {student.user.phone}</span>}
                <span className="flex items-center font-mono bg-white/5 border border-white/5 rounded-md px-1.5 py-0.5">{student.registrationNo || 'UNREGISTERED'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/40 border border-white/5 rounded-2xl p-4 w-full md:w-auto shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Enrolled Program</span>
              <span className="text-sm font-bold text-white mt-0.5">{courseName}</span>
              <span className="text-[11px] text-purple-400 font-semibold mt-0.5">{batchName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Performance Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* GPA/Quiz Score Card */}
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-purple-500/20 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Quiz Average</span>
            <span className="text-3xl font-black text-white block mt-2 tracking-tight">
              {quizzes.length > 0 ? `${avgQuizScore}%` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{quizzes.length} Attempts recorded</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Lab Submission Card */}
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-blue-500/20 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Developer Labs</span>
            <span className="text-3xl font-black text-white block mt-2 tracking-tight">
              {completedLabsCount} / {labsCount}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block font-semibold">Labs completed & verified</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* PT Meetings Card */}
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-emerald-500/20 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Teacher Reviews</span>
            <span className="text-3xl font-black text-white block mt-2 tracking-tight">
              {reviews.length} Logs
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block font-semibold">Meetings & Vivas held</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-white/5 font-medium text-slate-400 text-sm space-x-6 pb-px overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-4 px-1 border-b-2 font-bold cursor-pointer transition-all uppercase tracking-wider text-xs ${
            activeTab === 'quizzes' 
              ? 'border-purple-500 text-white font-extrabold' 
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Academic Quizzes ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`pb-4 px-1 border-b-2 font-bold cursor-pointer transition-all uppercase tracking-wider text-xs ${
            activeTab === 'labs' 
              ? 'border-purple-500 text-white font-extrabold' 
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Dev Labs ({labs.length})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`pb-4 px-1 border-b-2 font-bold cursor-pointer transition-all uppercase tracking-wider text-xs ${
            activeTab === 'meetings' 
              ? 'border-purple-500 text-white font-extrabold' 
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          PT Meetings & Vivas ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-1 border-b-2 font-bold cursor-pointer transition-all uppercase tracking-wider text-xs ${
            activeTab === 'profile' 
              ? 'border-purple-500 text-white font-extrabold' 
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Profile Details
        </button>
      </div>

      {/* Tab Panels Content */}
      <div className="min-h-[300px]">

        {/* Tab 1: AI Quiz Attempts */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl text-sm text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                No quiz attempts logged for this student.
              </div>
            ) : (
              <div className="bg-slate-900/10 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Quiz Title / Topic</th>
                        <th className="py-4 px-4">Difficulty</th>
                        <th className="py-4 px-4">Score</th>
                        <th className="py-4 px-4">Time Elapsed</th>
                        <th className="py-4 px-4">Date Submitted</th>
                        <th className="py-4 px-6 text-right">Review MCQs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {quizzes.map((attempt) => {
                        const isExpanded = expandedQuizId === attempt.id;
                        const scorePercentage = Math.round((attempt.obtainedMarks / attempt.maxMarks) * 100);
                        const durationMins = Math.round(
                          (new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000
                        );
                        
                        return (
                          <React.Fragment key={attempt.id}>
                            <tr className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-4 px-6">
                                <div>
                                  <span className="font-bold text-slate-100 block">{attempt.quiz?.title}</span>
                                  <span className="text-[10px] text-slate-500 block">Topic: {attempt.quiz?.topic}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wide ${
                                  attempt.quiz?.difficulty === 'advance' 
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    : attempt.quiz?.difficulty === 'moderate'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}>
                                  {attempt.quiz?.difficulty}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div>
                                  <span className="font-bold text-white block">{attempt.obtainedMarks} / {attempt.maxMarks}</span>
                                  <span className={`text-[10px] block font-bold ${scorePercentage >= 80 ? 'text-emerald-400' : scorePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {scorePercentage}% Score
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-slate-400">
                                <span className="flex items-center">
                                  <Clock className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
                                  {durationMins} Mins / {attempt.quiz?.timeLimitMins} Limit
                                </span>
                              </td>
                              <td className="py-4 px-4 text-slate-400">
                                <span className="flex items-center">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
                                  {new Date(attempt.submittedAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setExpandedQuizId(isExpanded ? null : attempt.id)}
                                  className="inline-flex items-center bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:text-purple-300 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-1" />
                                      Hide
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4 mr-1" />
                                      Reveal MCQs
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded MCQ Listing Details */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={6} className="bg-slate-950/40 border-b border-white/5 p-6 animate-in slide-in-from-top-1 duration-200">
                                  <div className="space-y-5 max-w-3xl">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center">
                                      <Shield className="w-4.5 h-4.5 text-purple-400 mr-2" />
                                      Dynamic AI MCQ Grader Log (Stored Student Record)
                                    </h4>

                                    <div className="space-y-4">
                                      {attempt.questions.map((q, qidx) => {
                                        const studentAns = attempt.answers?.[qidx] || null;
                                        const isCorrect = studentAns === q.correctAnswer;
                                        
                                        return (
                                          <div key={qidx} className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                                            <p className="text-sm font-semibold text-slate-200">
                                              <span className="text-purple-400 mr-1">Q{qidx + 1}.</span> {q.question}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                              {q.options.map((opt, oidx) => {
                                                const letter = String.fromCharCode(65 + oidx);
                                                const isStudentChoice = studentAns === opt;
                                                const isCorrectChoice = q.correctAnswer === opt;
                                                
                                                let style = "bg-slate-950/30 border-white/5 text-slate-400";
                                                if (isCorrectChoice) {
                                                  style = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold";
                                                } else if (isStudentChoice && !isCorrectChoice) {
                                                  style = "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold";
                                                }

                                                return (
                                                  <div key={oidx} className={`flex items-center border rounded-xl p-2.5 text-[11px] ${style}`}>
                                                    <span className="font-bold w-5 h-5 rounded-md bg-white/5 flex items-center justify-center mr-2 shrink-0">{letter}</span>
                                                    <span>{opt}</span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            <div className="text-[10px] pt-1.5 flex items-center justify-between text-slate-500 font-mono">
                                              <span>Student response: <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>{studentAns || 'Skipped'}</strong></span>
                                              <span>Result: <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong></span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Dev Labs */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            {labs.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl text-sm text-slate-500">
                <Layers className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                No developer lab submissions recorded.
              </div>
            ) : (
              <div className="bg-slate-900/10 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Lab Project Title</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Verification Link</th>
                        <th className="py-4 px-4">Grade</th>
                        <th className="py-4 px-4">Score</th>
                        <th className="py-4 px-6">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {labs.map((lab) => (
                        <tr key={lab.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-100">{lab.title}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              lab.status === 'GRADED'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}>
                              {lab.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400">
                            {lab.submissionUrl ? (
                              <a
                                href={lab.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
                              >
                                Code Repository
                                <ExternalLink className="w-3.5 h-3.5 ml-1" />
                              </a>
                            ) : (
                              <span className="text-slate-600">No URL</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-purple-400 text-sm">{lab.grade || 'N/A'}</span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-200">
                            {lab.obtainedMarks} / {lab.maxMarks}
                          </td>
                          <td className="py-4 px-6 text-slate-400 italic max-w-xs truncate" title={lab.remarks || ''}>
                            {lab.remarks || 'No remarks recorded.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PT Meetings Timeline */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl text-sm text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                No meeting logs or reviews registered.
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl">
                {reviews.map((rev) => (
                  <div key={rev.id} className="relative pl-6 md:pl-8 border-l border-white/10 ml-4 pb-6">
                    {/* Circle timeline dot */}
                    <div className="absolute top-1 -left-3 w-6 h-6 rounded-full bg-slate-950 border-2 border-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                    </div>

                    {/* Review card */}
                    <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                          <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mt-0.5">{rev.meetingType.replace('_', ' ')}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono bg-white/5 border border-white/5 rounded-lg px-2.5 py-1">
                          {rev.date}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-600 block uppercase font-bold">Attendees</span>
                          <span className="text-slate-300 font-medium">{rev.attendees}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-600 block uppercase font-bold">Status</span>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wide">
                            {rev.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs pt-2">
                        <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1.5">
                          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Minutes of Discussion</span>
                          <p className="text-slate-300 leading-relaxed">{rev.discussion}</p>
                        </div>
                        <div className="bg-purple-900/5 p-4 border border-purple-500/10 rounded-xl space-y-1.5">
                          <span className="text-[9px] text-purple-400 uppercase font-bold tracking-wider">Performance Feedback & Actions</span>
                          <p className="text-purple-200/90 leading-relaxed">{rev.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Personal academic info */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center">
                <User className="w-5 h-5 text-purple-400 mr-2.5" />
                Student Enrollment Dossier
              </h3>

              <div className="grid grid-cols-1 gap-5 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Full Name</span>
                  <span className="text-sm font-semibold text-slate-200 block">{fullName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Student Reg No</span>
                  <span className="text-sm font-mono text-slate-200 block">{student.registrationNo || 'UNREGISTERED'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-semibold text-slate-200 block">{student.user.email}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-200 block">{student.user.phone || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Date of Admission</span>
                  <span className="text-sm font-semibold text-slate-200 block">{student.admissionDate || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Account Created At</span>
                  <span className="text-sm font-semibold text-slate-200 block">{new Date(student.user.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Parent/Guardian info */}
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center">
                <FileText className="w-5 h-5 text-purple-400 mr-2.5" />
                Associated Parent & Guardian Records
              </h3>

              <div className="space-y-6">
                {student.parents.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    No linked parent/guardian records found for this student.
                  </div>
                ) : (
                  student.parents.map((p, pidx) => (
                    <div key={p.id} className="bg-slate-950/40 border border-white/5 rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-slate-200">{p.user.firstName} {p.user.lastName}</span>
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full">
                          Guardian {pidx + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div className="flex items-center text-slate-400">
                          <Mail className="w-4 h-4 text-blue-500/60 mr-2 shrink-0" />
                          <span>{p.user.email}</span>
                        </div>
                        {p.user.phone && (
                          <div className="flex items-center text-slate-400">
                            <Phone className="w-4 h-4 text-purple-500/60 mr-2 shrink-0" />
                            <span>{p.user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
