'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { 
  BookOpen, 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Calendar, 
  DollarSign, 
  X, 
  Check, 
  Loader2, 
  UserPlus, 
  UserMinus,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface Course {
  id: number;
  name: string;
  fee: number;
  monthlyFee: number;
  fullPaymentDiscount: number;
  duration?: string;
  sortNo?: number;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Student {
  id: number;
  registrationNo: string;
  user: User;
}

interface Batch {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  courseId: number;
  course: Course;
  students?: Student[];
}

export default function AdminCoursesAndBatchesPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'batches'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Courses pagination state
  const [coursePage, setCoursePage] = useState(1);
  const [coursePageSize, setCoursePageSize] = useState(10);

  // Batches pagination state
  const [batchPage, setBatchPage] = useState(1);
  const [batchPageSize, setBatchPageSize] = useState(10);

  // Reset page on length changes
  useEffect(() => {
    setCoursePage(1);
    setBatchPage(1);
  }, [courses.length, batches.length]);

  const paginatedCourses = courses.slice(
    (coursePage - 1) * coursePageSize,
    coursePage * coursePageSize
  );

  const paginatedBatches = batches.slice(
    (batchPage - 1) * batchPageSize,
    batchPage * batchPageSize
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals / Forms State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseName, setCourseName] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [courseMonthlyFee, setCourseMonthlyFee] = useState('');
  const [courseFullPaymentDiscount, setCourseFullPaymentDiscount] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseSortNo, setCourseSortNo] = useState('');

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchName, setBatchName] = useState('');
  const [batchCourseId, setBatchCourseId] = useState('');
  const [batchStartDate, setBatchStartDate] = useState('');
  const [batchEndDate, setBatchEndDate] = useState('');
  const [batchIsActive, setBatchIsActive] = useState(true);

  // Student Assignment Modal State
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [selectedBatchForEnrollment, setSelectedBatchForEnrollment] = useState<Batch | null>(null);
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  // AI Quiz Configuration States
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedBatchForQuiz, setSelectedBatchForQuiz] = useState<Batch | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('moderate');
  const [quizNumQuestions, setQuizNumQuestions] = useState(20);
  const [quizDurationDays, setQuizDurationDays] = useState(3);
  const [quizTimeLimitMins, setQuizTimeLimitMins] = useState(30);
  const [quizAllowedAttempts, setQuizAllowedAttempts] = useState(1);
  const [quizSubmitLoading, setQuizSubmitLoading] = useState(false);

  const isFetching = useRef(false);

  const fetchData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      setLoading(true);
      setError(null);
      
      const coursesRes = await api.get('/academic/courses');
      const coursesList = coursesRes.data?.data || coursesRes.data || [];
      setCourses(Array.isArray(coursesList) ? coursesList : []);

      const batchesRes = await api.get('/academic/batches');
      const batchesList = batchesRes.data?.data || batchesRes.data || [];
      setBatches(Array.isArray(batchesList) ? batchesList : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch academic details');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  // ==========================================
  // COURSE HANDLERS
  // ==========================================
  const handleOpenCourseCreate = () => {
    setEditingCourse(null);
    setCourseName('');
    setCourseFee('');
    setCourseMonthlyFee('');
    setCourseFullPaymentDiscount('');
    setCourseDuration('');
    setCourseSortNo('0');
    setCourseModalOpen(true);
  };

  const handleOpenCourseEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseFee(course.fee.toString());
    setCourseMonthlyFee(course.monthlyFee ? course.monthlyFee.toString() : '0');
    setCourseFullPaymentDiscount(course.fullPaymentDiscount ? course.fullPaymentDiscount.toString() : '0');
    setCourseDuration(course.duration || '');
    setCourseSortNo(course.sortNo ? course.sortNo.toString() : '0');
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { 
        name: courseName, 
        fee: Number(courseFee),
        monthlyFee: Number(courseMonthlyFee || 0),
        fullPaymentDiscount: Number(courseFullPaymentDiscount || 0),
        duration: courseDuration || null,
        sortNo: Number(courseSortNo || 0)
      };
      if (editingCourse) {
        await api.put(`/academic/courses/${editingCourse.id}`, payload);
        triggerSuccess('Course updated successfully.');
      } else {
        await api.post('/academic/courses', payload);
        triggerSuccess('Course created successfully.');
      }
      setCourseModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this course? All associated batches will be deleted!')) return;
    setError(null);
    try {
      await api.delete(`/academic/courses/${id}`);
      triggerSuccess('Course deleted successfully.');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    }
  };

  // ==========================================
  // BATCH HANDLERS
  // ==========================================
  const handleOpenBatchCreate = () => {
    setEditingBatch(null);
    setBatchName('');
    setBatchCourseId(courses[0]?.id.toString() || '');
    setBatchStartDate('');
    setBatchEndDate('');
    setBatchIsActive(true);
    setBatchModalOpen(true);
  };

  const handleOpenBatchEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchName(batch.name);
    setBatchCourseId(batch.courseId.toString());
    setBatchStartDate(batch.startDate);
    setBatchEndDate(batch.endDate);
    setBatchIsActive(batch.isActive);
    setBatchModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        name: batchName,
        courseId: Number(batchCourseId),
        startDate: batchStartDate,
        endDate: batchEndDate,
        isActive: batchIsActive
      };
      if (editingBatch) {
        await api.put(`/academic/batches/${editingBatch.id}`, payload);
        triggerSuccess('Batch updated successfully.');
      } else {
        await api.post('/academic/batches', payload);
        triggerSuccess('Batch created successfully.');
      }
      setBatchModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save batch');
    }
  };

  const handleDeleteBatch = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;
    setError(null);
    try {
      await api.delete(`/academic/batches/${id}`);
      triggerSuccess('Batch deleted successfully.');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete batch');
    }
  };

  // ==========================================
  // STUDENT ENROLLMENT HANDLERS
  // ==========================================
  const handleOpenEnrollment = async (batch: Batch) => {
    setSelectedBatchForEnrollment(batch);
    setEnrollmentModalOpen(true);
    setEnrollmentLoading(true);
    try {
      // Fetch currently enrolled
      const studentsRes = await api.get(`/academic/batches/${batch.id}/students`);
      const studentsList = studentsRes.data?.data || studentsRes.data || [];
      setBatchStudents(Array.isArray(studentsList) ? studentsList : []);

      // Fetch unassigned
      const unassignedRes = await api.get('/academic/unassigned-students');
      const unassignedList = unassignedRes.data?.data || unassignedRes.data || [];
      setUnassignedStudents(Array.isArray(unassignedList) ? unassignedList : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load enrollment students');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleAssignStudent = async (studentId: number) => {
    if (!selectedBatchForEnrollment) return;
    try {
      await api.post(`/academic/batches/${selectedBatchForEnrollment.id}/students`, {
        studentIds: [studentId]
      });
      // Refresh modal records
      handleOpenEnrollment(selectedBatchForEnrollment);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to assign student');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedBatchForEnrollment) return;
    try {
      await api.delete(`/academic/batches/${selectedBatchForEnrollment.id}/students`, {
        data: { studentIds: [studentId] }
      });
      // Refresh modal records
      handleOpenEnrollment(selectedBatchForEnrollment);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove student');
    }
  };

  const handleOpenQuizCreate = (batch: Batch) => {
    setSelectedBatchForQuiz(batch);
    setQuizTitle('');
    setQuizTopic('');
    setQuizDifficulty('moderate');
    setQuizNumQuestions(20);
    setQuizDurationDays(3);
    setQuizTimeLimitMins(30);
    setQuizAllowedAttempts(1);
    setQuizModalOpen(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForQuiz) return;
    setQuizSubmitLoading(true);
    setError(null);
    try {
      const payload = {
        title: quizTitle,
        topic: quizTopic,
        difficulty: quizDifficulty,
        numQuestions: Number(quizNumQuestions),
        durationDays: Number(quizDurationDays),
        timeLimitMins: Number(quizTimeLimitMins),
        allowedAttempts: Number(quizAllowedAttempts),
        batchId: selectedBatchForQuiz.id
      };
      await api.post('/academic/quizzes', payload);
      setQuizModalOpen(false);
      alert('AI Quiz Configured Successfully! Students in this batch can now attempt it.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to configure AI quiz');
    } finally {
      setQuizSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Courses & Batches</h1>
          <p className="text-slate-400 text-xs mt-1">Configure professional IT programs, manage academic student cohorts, and enroll student profiles.</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'courses' ? (
            <button
              onClick={handleOpenCourseCreate}
              className="text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl px-5 py-3 shadow-md shadow-blue-500/10 cursor-pointer flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </button>
          ) : (
            <button
              onClick={handleOpenBatchCreate}
              className="text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl px-5 py-3 shadow-md shadow-blue-500/10 cursor-pointer flex items-center"
              disabled={courses.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 bg-slate-900/60 border border-white/5 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'courses' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5 mr-2" />
          Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'batches' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4.5 h-4.5 mr-2" />
          Batches ({batches.length})
        </button>
      </div>

      {/* Banners */}
      {successMsg && (
        <div className="flex items-start space-x-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-250">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-950/40 border border-red-500/30 text-red-200 text-sm rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-slate-500 text-xs">Loading course modules & batches...</p>
        </div>
      ) : activeTab === 'courses' ? (
        /* ==========================================
           COURSES VIEW
           ========================================== */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-slate-900/20 border border-white/5 rounded-3xl space-y-2">
                <p className="text-slate-400 text-sm">No courses defined yet.</p>
                <button 
                  onClick={handleOpenCourseCreate} 
                  className="text-xs text-blue-400 hover:underline font-semibold"
                >
                  Create your first course now
                </button>
              </div>
            ) : (
              paginatedCourses.map(course => (
              <div 
                key={course.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-all">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/30 text-purple-400">
                        Sort #{course.sortNo || 0}
                      </span>
                      {course.duration && (
                        <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border bg-slate-950/60 border-white/5 text-slate-400">
                          {course.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.name}</h3>
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center text-slate-450">
                        <DollarSign className="w-4 h-4 text-emerald-400 mr-1 shrink-0" />
                        <span>One-Time Fee:</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-200 block">{Number(course.fee).toLocaleString()} PKR</span>
                        {course.fullPaymentDiscount > 0 && (
                          <span className="text-[10px] text-emerald-400 font-semibold block">
                            {Number(course.fee * (1 - course.fullPaymentDiscount / 100)).toLocaleString()} PKR ({course.fullPaymentDiscount}% Off)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center text-slate-450">
                        <DollarSign className="w-4 h-4 text-purple-400 mr-1 shrink-0" />
                        <span>Monthly Installment:</span>
                      </div>
                      <span className="font-bold text-slate-200">{Number(course.monthlyFee || 0).toLocaleString()} PKR / mo</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-2">
                  <button
                    onClick={() => handleOpenCourseEdit(course)}
                    className="flex-1 flex items-center justify-center text-xs font-semibold py-2.5 rounded-xl border border-white/5 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-rose-500/10 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Courses Pagination Controls */}
          {courses.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl gap-4 text-xs text-slate-500 dark:text-slate-400 shadow-md">
              <div className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  value={coursePageSize}
                  onChange={(e) => setCoursePageSize(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
                <span>courses per page</span>
              </div>

              <div className="font-medium text-slate-600 dark:text-slate-400">
                Showing {Math.min(courses.length, (coursePage - 1) * coursePageSize + 1)} to {Math.min(courses.length, coursePage * coursePageSize)} of {courses.length} courses
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCoursePage(prev => Math.max(1, prev - 1))}
                  disabled={coursePage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold font-mono">
                  {coursePage}
                </span>
                <button
                  onClick={() => setCoursePage(prev => Math.min(Math.ceil(courses.length / coursePageSize), prev + 1))}
                  disabled={coursePage >= Math.ceil(courses.length / coursePageSize)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ==========================================
           BATCHES VIEW
           ========================================== */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {batches.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-slate-900/20 border border-white/5 rounded-3xl space-y-2">
                <p className="text-slate-400 text-sm">No batches created yet.</p>
                <button 
                  onClick={handleOpenBatchCreate} 
                  className="text-xs text-blue-400 hover:underline font-semibold"
                  disabled={courses.length === 0}
                >
                  Create your first batch cohort now
                </button>
              </div>
            ) : (
              paginatedBatches.map(batch => (
              <div 
                key={batch.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-all">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      batch.isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-950/60 border-white/5 text-slate-500'
                    }`}>
                      {batch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{batch.name}</h3>
                  <p className="text-xs text-purple-400 font-semibold mb-4">{batch.course?.name}</p>

                  <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-white/5 p-4 rounded-2xl text-xs text-slate-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-600 block uppercase font-bold">Start Date</span>
                        <span className="font-medium text-slate-300">{batch.startDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-600 block uppercase font-bold">End Date</span>
                        <span className="font-medium text-slate-300">{batch.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/5 pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEnrollment(batch)}
                      className="flex items-center text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-1.5" />
                      Manage Students ({batch.students?.length || 0})
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    
                    <button
                      onClick={() => handleOpenQuizCreate(batch)}
                      className="flex items-center text-xs text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 mr-1.5" />
                      Add AI Quiz
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">Batch ID: #{batch.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenBatchEdit(batch)}
                        className="w-9 h-9 flex items-center justify-center text-xs rounded-xl border border-white/5 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-rose-500/10 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Batches Pagination Controls */}
          {batches.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl gap-4 text-xs text-slate-500 dark:text-slate-400 shadow-md">
              <div className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  value={batchPageSize}
                  onChange={(e) => setBatchPageSize(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
                <span>batches per page</span>
              </div>

              <div className="font-medium text-slate-600 dark:text-slate-400">
                Showing {Math.min(batches.length, (batchPage - 1) * batchPageSize + 1)} to {Math.min(batches.length, batchPage * batchPageSize)} of {batches.length} batches
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBatchPage(prev => Math.max(1, prev - 1))}
                  disabled={batchPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold font-mono">
                  {batchPage}
                </span>
                <button
                  onClick={() => setBatchPage(prev => Math.min(Math.ceil(batches.length / batchPageSize), prev + 1))}
                  disabled={batchPage >= Math.ceil(batches.length / batchPageSize)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==========================================
         COURSE CREATE/EDIT MODAL OVERLAY
         ========================================== */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setCourseModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingCourse ? 'Edit Course Details' : 'Create Professional Course'}
            </h2>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. AI Engineering & Agentic Systems"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">One-Time Tuition Fee (PKR)</label>
                <input
                  type="number"
                  value={courseFee}
                  onChange={(e) => setCourseFee(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. 25000"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Monthly Installment Fee (PKR)</label>
                <input
                  type="number"
                  value={courseMonthlyFee}
                  onChange={(e) => setCourseMonthlyFee(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. 5000"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Full Payment Discount (%)</label>
                <input
                  type="number"
                  value={courseFullPaymentDiscount}
                  onChange={(e) => setCourseFullPaymentDiscount(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. 10"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Duration (e.g. 6 Months, 3 Months)</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="Leave empty if none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sort Order Number</label>
                <input
                  type="number"
                  value={courseSortNo}
                  onChange={(e) => setCourseSortNo(e.target.value)}
                  min="0"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         BATCH CREATE/EDIT MODAL OVERLAY
         ========================================== */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setBatchModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingBatch ? 'Edit Batch Cohort' : 'Create Student Cohort Batch'}
            </h2>
            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Batch Name</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. Batch 1"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Select Course</label>
                <select
                  value={batchCourseId}
                  onChange={(e) => setBatchCourseId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none appearance-none cursor-pointer"
                  required
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id} className="bg-slate-900">
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={batchStartDate}
                    onChange={(e) => setBatchStartDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">End Date</label>
                  <input
                    type="date"
                    value={batchEndDate}
                    onChange={(e) => setBatchEndDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none cursor-pointer"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-slate-950/30 border border-white/5 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="batchIsActive"
                  checked={batchIsActive}
                  onChange={(e) => setBatchIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="batchIsActive" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Batch cohort is active and accepting admissions
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
                >
                  {editingBatch ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         STUDENT ENROLLMENT MANAGER MODAL (FULL OVERLAY)
         ========================================== */}
      {enrollmentModalOpen && selectedBatchForEnrollment && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Cohort Enrollment Manager</h2>
                <p className="text-xs text-purple-400 mt-0.5">
                  Batch: <span className="font-semibold text-slate-200">{selectedBatchForEnrollment.name}</span> • Program: <span className="font-semibold text-slate-200">{selectedBatchForEnrollment.course?.name}</span>
                </p>
              </div>
              <button 
                onClick={() => setEnrollmentModalOpen(false)}
                className="text-slate-400 hover:text-white border border-white/10 rounded-xl p-2 bg-slate-950/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {enrollmentLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-slate-500 text-xs">Loading batch enrollment lists...</p>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-hidden">
                
                {/* Left Panel: Currently Enrolled */}
                <div className="p-6 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <Users className="w-4 h-4 text-emerald-400 mr-2" />
                      Enrolled Students ({batchStudents.length})
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {batchStudents.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl text-xs text-slate-500">
                        No students enrolled in this batch yet.
                      </div>
                    ) : (
                      batchStudents.map(student => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-white/5 rounded-2xl"
                        >
                          <div className="truncate pr-4">
                            <span className="text-sm font-semibold text-slate-200 block truncate">{student.user.firstName} {student.user.lastName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{student.registrationNo || 'N/A'}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            className="flex items-center justify-center p-2 rounded-lg bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                            title="Unenroll from batch"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Panel: Unassigned Students */}
                <div className="p-6 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <UserPlus className="w-4 h-4 text-blue-400 mr-2" />
                      Unassigned Students ({unassignedStudents.length})
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {unassignedStudents.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl text-xs text-slate-500">
                        No unassigned student records found. All students are currently enrolled in batches.
                      </div>
                    ) : (
                      unassignedStudents.map(student => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-white/5 rounded-2xl"
                        >
                          <div className="truncate pr-4">
                            <span className="text-sm font-semibold text-slate-200 block truncate">{student.user.firstName} {student.user.lastName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{student.registrationNo || 'N/A'}</span>
                          </div>
                          <button
                            onClick={() => handleAssignStudent(student.id)}
                            className="flex items-center justify-center p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                            title="Enroll in batch"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/40 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setEnrollmentModalOpen(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ==========================================================
         AI QUIZ CREATE MODAL OVERLAY
         ========================================== */}
      {quizModalOpen && selectedBatchForQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQuizModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-1">Configure AI Quiz</h2>
            <p className="text-xs text-purple-400 mb-6 font-semibold">
              Batch: <span className="text-slate-300">{selectedBatchForQuiz.name}</span>
            </p>
            
            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. React Hook Fundamentals"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Quiz Topic (For AI Generation)</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl py-3 px-4 text-sm text-white outline-none"
                  placeholder="e.g. React useState and useEffect"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Difficulty</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="advance">Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">No. of Questions</label>
                  <select
                    value={quizNumQuestions}
                    onChange={(e) => setQuizNumQuestions(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Open For</label>
                  <select
                    value={quizDurationDays}
                    onChange={(e) => setQuizDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-3 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value={1}>1 Day</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Time Limit</label>
                  <select
                    value={quizTimeLimitMins}
                    onChange={(e) => setQuizTimeLimitMins(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-3 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value={15}>15 Mins</option>
                    <option value={30}>30 Mins</option>
                    <option value={45}>45 Mins</option>
                    <option value={60}>60 Mins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Attempts</label>
                  <select
                    value={quizAllowedAttempts}
                    onChange={(e) => setQuizAllowedAttempts(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-purple-500/50 rounded-xl py-3 px-3 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value={1}>1 Attempt</option>
                    <option value={2}>2 Attempts</option>
                    <option value={3}>3 Attempts</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quizSubmitLoading}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center font-bold"
                >
                  {quizSubmitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Configure Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
