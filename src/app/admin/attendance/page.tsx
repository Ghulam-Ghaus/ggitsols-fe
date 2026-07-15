'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
  ChevronRight,
  ClipboardList,
  Edit2,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  name: string;
}

interface Batch {
  id: number;
  name: string;
  courseId: number;
}

interface AttendanceLog {
  id: string;
  date: string;
  takenByUser: {
    firstName: string;
    lastName: string;
  } | null;
  stats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
}

interface TeacherRecord {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  attendance: {
    id: string | null;
    status: string; // 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | 'NOT_MARKED'
    checkInTime: string | null;
    checkOutTime: string | null;
    remarks: string | null;
  };
}

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Student Attendance States
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [selectedBatchId, setSelectedBatchId] = useState<number | ''>('');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'));

  // Teacher Attendance States
  const [teacherDate, setTeacherDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
  const [teachersDaily, setTeachersDaily] = useState<TeacherRecord[]>([]);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('PRESENT');
  const [editingRemarks, setEditingRemarks] = useState<string>('');
  const [submittingTeacher, setSubmittingTeacher] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [coursesRes, batchesRes] = await Promise.all([
          api.get('/academic/courses'),
          api.get('/academic/batches')
        ]);
        setCourses(coursesRes.data.data || coursesRes.data);
        setBatches(batchesRes.data.data || batchesRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch Student Attendance Logs when batch changes
  useEffect(() => {
    if (!selectedBatchId) {
      setAttendanceLogs([]);
      return;
    }
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/academic/batches/${selectedBatchId}/attendance`);
        setAttendanceLogs(res.data.data || res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [selectedBatchId]);

  // Fetch Teacher Daily Sheet when date changes
  useEffect(() => {
    if (activeTab !== 'teacher') return;
    const fetchTeacherSheet = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/academic/teacher-attendance/daily?date=${teacherDate}`);
        setTeachersDaily(res.data.data || res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load teacher attendance logs');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherSheet();
  }, [teacherDate, activeTab]);

  // Handle saving modified teacher attendance status
  const handleSaveTeacherAttendance = async (teacherId: string) => {
    try {
      setSubmittingTeacher(true);
      setError(null);
      await api.post('/academic/teacher-attendance/daily', {
        userId: teacherId,
        date: teacherDate,
        status: editingStatus,
        remarks: editingRemarks
      });
      setSuccess('Teacher attendance updated successfully');
      setEditingTeacherId(null);
      // Refresh teacher logs
      const res = await api.get(`/academic/teacher-attendance/daily?date=${teacherDate}`);
      setTeachersDaily(res.data.data || res.data);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update teacher attendance');
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const filteredBatches = selectedCourseId
    ? batches.filter((b) => Number(b.courseId) === Number(selectedCourseId))
    : batches;

  // Calculate Average Student Attendance Rate
  const calculateAverageRate = () => {
    if (attendanceLogs.length === 0) return 0;
    let totalPresent = 0;
    let totalRecords = 0;
    attendanceLogs.forEach((log) => {
      totalPresent += log.stats.present + log.stats.late + log.stats.excused;
      totalRecords += log.stats.total;
    });
    return totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 via-slate-900/40 to-blue-900/30 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-purple-400" />
              Attendance Module
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Mark student class attendance and track daily teacher check-in registers.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-4">
        <button
          onClick={() => setActiveTab('student')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 px-1 cursor-pointer ${
            activeTab === 'student'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Student Attendance
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 px-1 cursor-pointer ${
            activeTab === 'teacher'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Teacher Attendance
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* -------------------- STUDENT ATTENDANCE TAB -------------------- */}
      {activeTab === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: selection & action */}
          <div className="lg:col-span-1 bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg h-fit space-y-6">
            <h2 className="text-lg font-bold text-slate-200">Select Batch & Date</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value ? Number(e.target.value) : '');
                    setSelectedBatchId('');
                  }}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value ? Number(e.target.value) : '')}
                  disabled={!selectedCourseId}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  <option value="">Select Batch</option>
                  {filteredBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Attendance Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {selectedBatchId && (
                <Link
                  href={`/admin/attendance/take?batchId=${selectedBatchId}&date=${selectedDate}`}
                  className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/10 cursor-pointer text-center"
                >
                  Mark / Edit Attendance
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>

            {selectedBatchId && attendanceLogs.length > 0 && (
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Batch Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conducted</span>
                    <span className="text-2xl font-black text-white block mt-1">{attendanceLogs.length}</span>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Avg Rate</span>
                    <span className="text-2xl font-black text-emerald-450 block mt-1">{calculateAverageRate()}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: historic logs list */}
          <div className="lg:col-span-2 bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col min-h-[400px]">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Historical Attendance Register</h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-xs text-slate-500">Loading attendance data...</p>
              </div>
            ) : !selectedBatchId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl">
                <Calendar className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400 font-semibold">No Batch Selected</p>
                <p className="text-xs text-slate-500 mt-1">Please select a course and batch on the left panel to load records.</p>
              </div>
            ) : attendanceLogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl">
                <Users className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400 font-semibold">No Attendance Records Yet</p>
                <p className="text-xs text-slate-500 mt-1">No attendance sessions have been logged for this batch yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Taken By</th>
                      <th className="py-3 px-2 text-center">Present</th>
                      <th className="py-3 px-2 text-center">Absent</th>
                      <th className="py-3 px-2 text-center">Late/Excused</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors text-sm">
                        <td className="py-3.5 px-2 font-semibold text-slate-200">
                          {new Date(log.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-2 text-slate-400">
                          {log.takenByUser ? `${log.takenByUser.firstName} ${log.takenByUser.lastName}` : 'System'}
                        </td>
                        <td className="py-3.5 px-2 text-center text-emerald-400 font-bold">
                          {log.stats.present}
                        </td>
                        <td className="py-3.5 px-2 text-center text-rose-400 font-bold">
                          {log.stats.absent}
                        </td>
                        <td className="py-3.5 px-2 text-center text-amber-400 font-semibold">
                          {log.stats.late + log.stats.excused}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <Link
                            href={`/admin/attendance/take?batchId=${selectedBatchId}&date=${log.date}`}
                            className="inline-flex items-center text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- TEACHER ATTENDANCE TAB -------------------- */}
      {activeTab === 'teacher' && (
        <div className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-200">Teacher Daily Attendance Register</h2>
              <p className="text-xs text-slate-500 mt-1">Manage and track daily check-in lists of all academic staff.</p>
            </div>
            <div className="flex items-center space-x-3 bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={teacherDate}
                onChange={(e) => setTeacherDate(e.target.value)}
                className="bg-transparent border-0 text-slate-200 text-sm focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="min-h-[250px] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-xs text-slate-500">Loading daily teacher logs...</p>
            </div>
          ) : teachersDaily.length === 0 ? (
            <div className="min-h-[250px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl">
              <Users className="w-12 h-12 text-slate-650 mb-3" />
              <p className="text-sm text-slate-400 font-semibold">No Teachers Registered</p>
              <p className="text-xs text-slate-500 mt-1">No active users with the TEACHER role were found in the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Teacher Name</th>
                    <th className="py-3 px-2">Check In</th>
                    <th className="py-3 px-2">Check Out</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Remarks</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachersDaily.map((row) => {
                    const isEditing = editingTeacherId === row.teacher.id;
                    const statusColors: Record<string, string> = {
                      PRESENT: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                      ABSENT: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                      LATE: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                      LEAVE: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                      NOT_MARKED: 'bg-slate-500/10 border-white/5 text-slate-450'
                    };

                    return (
                      <tr key={row.teacher.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors text-sm">
                        {/* Name */}
                        <td className="py-4 px-2">
                          <div>
                            <span className="font-bold text-slate-200 block">{row.teacher.firstName} {row.teacher.lastName}</span>
                            <span className="text-[10px] text-slate-500 block">{row.teacher.email}</span>
                          </div>
                        </td>

                        {/* Check In */}
                        <td className="py-4 px-2 text-slate-350">
                          {row.attendance.checkInTime ? (
                            <span className="flex items-center font-medium">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                              {new Date(row.attendance.checkInTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* Check Out */}
                        <td className="py-4 px-2 text-slate-350">
                          {row.attendance.checkOutTime ? (
                            <span className="flex items-center font-medium">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-rose-450 shrink-0" />
                              {new Date(row.attendance.checkOutTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-2">
                          {isEditing ? (
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value)}
                              className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                            >
                              <option value="PRESENT">PRESENT</option>
                              <option value="LATE">LATE</option>
                              <option value="ABSENT">ABSENT</option>
                              <option value="LEAVE">LEAVE</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${statusColors[row.attendance.status]}`}>
                              {row.attendance.status}
                            </span>
                          )}
                        </td>

                        {/* Remarks */}
                        <td className="py-4 px-2 text-slate-400 max-w-[200px] truncate">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingRemarks}
                              onChange={(e) => setEditingRemarks(e.target.value)}
                              placeholder="Notes..."
                              className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-200 w-full focus:outline-none"
                            />
                          ) : (
                            row.attendance.remarks || <span className="text-slate-650 italic text-xs">No notes</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-2 text-right">
                          {isEditing ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleSaveTeacherAttendance(row.teacher.id)}
                                disabled={submittingTeacher}
                                className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors cursor-pointer"
                                title="Save"
                              >
                                {submittingTeacher ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingTeacherId(null)}
                                className="p-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingTeacherId(row.teacher.id);
                                setEditingStatus(row.attendance.status === 'NOT_MARKED' ? 'PRESENT' : row.attendance.status);
                                setEditingRemarks(row.attendance.remarks || '');
                              }}
                              className="inline-flex items-center text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1" />
                              Mark / Override
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
