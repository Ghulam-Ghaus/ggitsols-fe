'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Loader2, 
  Calendar, 
  CheckSquare, 
  Power, 
  Award,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  id: number;
  title: string;
  topic: string;
  difficulty: string;
  numQuestions: number;
  timeLimitMins: number;
  allowedAttempts: number;
  expiresAt: string;
}

interface QuizAttempt {
  id: number;
  quizId: number;
  questions: Array<{
    question: string;
    options: string[];
  }>;
  startedAt: string;
  timeLimitMins: number;
  status: string;
}

interface GradedQuiz {
  id: number;
  obtainedMarks: number;
  maxMarks: number;
  answers: Record<number, string>;
  gradedQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    studentAnswer: string | null;
    isCorrect: boolean;
  }>;
}

export default function StudentQuizPage() {
  const router = useRouter();
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Active quiz attempt states
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(0);
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Graded result screen
  const [gradedResult, setGradedResult] = useState<GradedQuiz | null>(null);

  // Fetch student info and quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        // Get student context
        const studentRes = await api.get('/academic/students/me');
        const student = studentRes.data.data || studentRes.data;
        setStudentProfile(student);

        if (student && student.batchId) {
          const quizRes = await api.get(`/academic/batches/${student.batchId}/quizzes`);
          setQuizzes(quizRes.data.data || quizRes.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to retrieve active batch quizzes.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Timer logic for active attempt
  useEffect(() => {
    if (activeAttempt) {
      const startedTime = new Date(activeAttempt.startedAt).getTime();
      const limitMs = activeAttempt.timeLimitMins * 60 * 1000;
      const endTime = startedTime + limitMs;

      const updateTimer = () => {
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        setTimeLeftSecs(remaining);

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
        }
      };

      updateTimer(); // run once immediately
      timerRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeAttempt]);

  const handleStartAttempt = async (quizId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/academic/quizzes/${quizId}/attempts`);
      const attempt = res.data.data || res.data;
      
      setActiveAttempt({
        id: attempt.id,
        quizId: attempt.quizId,
        questions: attempt.questions,
        startedAt: attempt.startedAt,
        timeLimitMins: attempt.quiz?.timeLimitMins || 30,
        status: attempt.status
      });
      setSelectedAnswers({});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start AI quiz attempt.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleAutoSubmit = () => {
    alert('Time limit reached! Submitting your answers automatically.');
    handleSubmitQuiz(true);
  };

  const handleSubmitQuiz = async (isAuto: boolean = false) => {
    if (!activeAttempt) return;
    if (!isAuto && !confirm('Are you sure you want to submit your quiz?')) return;

    setSubmittingAttempt(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await api.post(`/academic/quizzes/attempts/${activeAttempt.id}/submit`, {
        answers: selectedAnswers
      });
      setGradedResult(res.data.data || res.data);
      setActiveAttempt(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit quiz attempt.');
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Contacting Gemini AI Agent...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUIZ TAKING INTERACTIVE SCREEN
  // ==========================================
  if (activeAttempt) {
    const isTimerLow = timeLeftSecs < 120; // less than 2 mins
    const progressCount = Object.keys(selectedAnswers).length;
    const totalQuestions = activeAttempt.questions.length;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        
        {/* Active Quiz Sticky Header */}
        <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center">
              <BookOpen className="w-5 h-5 text-purple-400 mr-2" />
              Dynamic AI-Generated Assessment
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">Attempt ID: #{activeAttempt.id}</span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Progress counter */}
            <span className="text-xs text-slate-400 font-medium">
              Progress: <strong className="text-white">{progressCount}</strong> / {totalQuestions}
            </span>

            {/* Ticking countdown timer */}
            <div className={`flex items-center px-4 py-2 border rounded-xl font-mono text-sm font-black transition-all ${
              isTimerLow 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-slate-950 border-white/10 text-emerald-400'
            }`}>
              <Clock className="w-4 h-4 mr-2" />
              {formatTimer(timeLeftSecs)}
            </div>
          </div>
        </header>

        {/* Questions list */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-6 pb-28">
          <div className="bg-purple-600/5 border border-purple-500/10 rounded-2xl p-4 text-xs text-purple-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5" />
            <p>This assessment is dynamically generated in real-time by your AI instructor. Correct answers are evaluated on submission. Do not reload this page or close the tab.</p>
          </div>

          {activeAttempt.questions.map((q, qidx) => {
            const currentSelected = selectedAnswers[qidx];
            return (
              <div key={qidx} className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-start space-x-3">
                  <span className="text-xs font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                    {qidx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-200 mt-0.5 leading-relaxed">{q.question}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2 pl-10">
                  {q.options.map((opt, oidx) => {
                    const letter = String.fromCharCode(65 + oidx);
                    const isChecked = currentSelected === opt;

                    return (
                      <button
                        key={oidx}
                        onClick={() => handleOptionSelect(qidx, opt)}
                        className={`flex items-center text-left border rounded-2xl p-3.5 text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-purple-600/15 border-purple-500 text-purple-200 shadow-md font-bold'
                            : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.02] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold mr-3 shrink-0 ${
                          isChecked ? 'bg-purple-500 text-white' : 'bg-white/5'
                        }`}>
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>

        {/* Sticky footer action button bar */}
        <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-slate-900/60 backdrop-blur-lg p-5 flex items-center justify-center shadow-2xl">
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={submittingAttempt}
            className="w-full max-w-md py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-xs uppercase font-black tracking-widest text-white rounded-2xl shadow-xl shadow-purple-500/10 flex items-center justify-center cursor-pointer transition-all"
          >
            {submittingAttempt ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Grading and Saving Quiz...
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                Submit and Complete Attempt
              </>
            )}
          </button>
        </footer>
      </div>
    );
  }

  // ==========================================
  // GRADED RESULTS SCREEN
  // ==========================================
  if (gradedResult) {
    const scorePercentage = Math.round((gradedResult.obtainedMarks / gradedResult.maxMarks) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans animate-in fade-in duration-300">
        
        {/* Navbar */}
        <header className="border-b border-white/5 bg-slate-900/20 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setGradedResult(null)}
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900/40 border border-white/5 rounded-xl px-4 py-2.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </button>
          <span className="text-xs text-slate-500 font-mono">Attempt Graded Record ID: #{gradedResult.id}</span>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-8 pb-16">
          
          {/* Header Grade Card widget */}
          <section className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-white/10 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-600 to-blue-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">Quiz Attempt Graded successfully</h2>
              <p className="text-xs text-slate-400 mt-1">Your responses have been processed and locked inside your student records.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Raw Score</span>
                <span className="text-2xl font-black text-white block mt-1">{gradedResult.obtainedMarks} / {gradedResult.maxMarks}</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Grade Result</span>
                <span className={`text-2xl font-black block mt-1 ${scorePercentage >= 80 ? 'text-emerald-400' : scorePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {scorePercentage}%
                </span>
              </div>
            </div>
          </section>

          {/* Graded questions lists */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Review Questions</h3>

            {gradedResult.gradedQuestions.map((q, qidx) => {
              const isCorrect = q.isCorrect;
              return (
                <div key={qidx} className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-xs font-black bg-white/5 text-slate-300 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                        {qidx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-200 mt-0.5 leading-relaxed">{q.question}</h4>
                    </div>

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                      isCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 pl-10">
                    {q.options.map((opt, oidx) => {
                      const letter = String.fromCharCode(65 + oidx);
                      const isStudentChoice = q.studentAnswer === opt;
                      const isCorrectChoice = q.correctAnswer === opt;
                      
                      let optStyle = "bg-slate-950/40 border-white/5 text-slate-500";
                      if (isCorrectChoice) {
                        optStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold";
                      } else if (isStudentChoice && !isCorrectChoice) {
                        optStyle = "bg-rose-500/15 border-rose-500/40 text-rose-300 font-bold";
                      }

                      return (
                        <div
                          key={oidx}
                          className={`flex items-center border rounded-2xl p-3.5 text-xs ${optStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold mr-3 shrink-0 ${
                            isCorrectChoice ? 'bg-emerald-500 text-white' : isStudentChoice ? 'bg-rose-500 text-white' : 'bg-white/5'
                          }`}>
                            {letter}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] pt-2 pl-10 border-t border-white/5 flex items-center justify-between text-slate-500 font-mono">
                    <span>Selected response: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{q.studentAnswer || 'None'}</strong></span>
                    <span>Correct Answer: <strong className="text-emerald-400">{q.correctAnswer}</strong></span>
                  </div>
                </div>
              );
            })}
          </section>

          <button
            onClick={() => setGradedResult(null)}
            className="w-full py-3.5 bg-slate-900 border border-white/10 hover:bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white rounded-2xl transition-all cursor-pointer text-center block"
          >
            Return to Dashboard
          </button>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN QUIZZES DASHBOARD PORTAL SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/profile"
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900/40 border border-white/5 rounded-xl px-4 py-2.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Profile Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 rounded-xl px-4 py-2.5 transition-all"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8 pb-16">
        
        {/* Banner header widget */}
        <section className="bg-gradient-to-r from-purple-900/30 to-blue-900/10 border border-purple-500/10 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Active AI Quizzes</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">Assess your concepts with dynamically generated custom MCQs tailormade by AI based on course modules.</p>
          </div>
          <span className="text-[10px] text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl uppercase font-bold shrink-0">
            {studentProfile?.batch?.name || 'No Cohort'}
          </span>
        </section>

        {error && (
          <div className="flex items-start space-x-2 bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-rose-200 text-xs animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!studentProfile?.batchId ? (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl text-sm text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            You are not currently enrolled in an active student batch cohort. Please contact the administrator registry.
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl text-sm text-slate-500">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            No active AI quizzes configured for your batch cohort at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => {
              const expiryDate = new Date(quiz.expiresAt);
              const isExpired = new Date() > expiryDate;

              return (
                <div 
                  key={quiz.id} 
                  className={`bg-slate-900/30 backdrop-blur-xl border rounded-3xl p-6 flex flex-col justify-between shadow-xl group transition-all duration-300 ${
                    isExpired ? 'border-white/5 opacity-60' : 'border-white/5 hover:border-purple-500/25'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">{quiz.title}</h3>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase mt-0.5">Topic: {quiz.topic}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0 ${
                        quiz.difficulty === 'advance' 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : quiz.difficulty === 'moderate'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex items-center text-slate-400">
                        <HelpCircle className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                        <span>{quiz.numQuestions} Questions</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Clock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                        <span>{quiz.timeLimitMins} Mins Limit</span>
                      </div>
                      <div className="col-span-2 flex items-center text-slate-400">
                        <Calendar className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                        <span>Expires: {expiryDate.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    {isExpired ? (
                      <div className="w-full text-center text-[10px] uppercase font-bold text-rose-400 bg-rose-500/5 border border-rose-500/10 py-2.5 rounded-xl">
                        Expired / Closed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartAttempt(quiz.id)}
                        className="w-full flex items-center justify-center text-xs font-bold uppercase tracking-wider py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/5 group-hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        Start AI Quiz Attempt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
