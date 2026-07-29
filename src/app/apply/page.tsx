'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Award,
  Users,
  Briefcase,
  BookOpen,
  UserCheck,
  GitPullRequest,
  Lock
} from 'lucide-react';

interface Course {
  id: number;
  name: string;
  duration?: string;
  fee: number;
}

export default function ApplyPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationLoading(true);
    setVerificationError(null);
    setResendSuccess(null);
    try {
      await api.post('/users/verify-email', {
        email: email.toLowerCase().trim(),
        code: verificationCode.trim()
      });
      setVerificationSuccess(true);
    } catch (err: any) {
      setVerificationError(err.message || 'Invalid or expired verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setVerificationLoading(true);
    setVerificationError(null);
    setResendSuccess(null);
    try {
      await api.post('/users/resend-code', {
        email: email.toLowerCase().trim()
      });
      setResendSuccess('A new 6-digit verification code has been sent!');
    } catch (err: any) {
      setVerificationError(err.message || 'Failed to resend verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('');
  const [paymentOption, setPaymentOption] = useState('FULL_PAYMENT');
  const [courses, setCourses] = useState<Course[]>([]);
  const [claimFreeFreelancing, setClaimFreeFreelancing] = useState(false);

  // Education Details state
  const [highestQualification, setHighestQualification] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [boardUniversity, setBoardUniversity] = useState('');
  const [completionYear, setCompletionYear] = useState('');
  const [obtainedGpa, setObtainedGpa] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/academic/courses');
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setCourses(list);
          return;
        }
      } catch (err) {
        console.error('Failed to load courses from API:', err);
      }
      // Fallback
      setCourses([
        { id: 1, name: 'Web Development', duration: '6 Months', fee: 35000 },
        { id: 2, name: 'Mobile Development', duration: '6 Months', fee: 35000 },
        { id: 3, name: 'JavaScript for Interactive Web', duration: '3 Months', fee: 25000 },
        { id: 4, name: 'Python Programming', duration: '3 Months', fee: 20000 },
        { id: 5, name: 'SQL Postgres / No SQL Mongo', duration: '3 Months', fee: 25000 },
        { id: 6, name: 'Generative & Agentic AI', duration: '', fee: 40000 },
        { id: 7, name: 'Freelancing & Career Guidance', duration: '', fee: 15000 }
      ]);
    };
    fetchCourses();
  }, []);

  const selectedCourse = courses.find(c => c.id === Number(courseId));
  const is6MonthCourse = selectedCourse?.duration?.toLowerCase().includes('6 month');

  // Parent/Guardian 1 details
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardian1Mode, setGuardian1Mode] = useState<'add' | 'search'>('add');
  const [guardian1SearchEmail, setGuardian1SearchEmail] = useState('');
  const [guardian1SearchLoading, setGuardian1SearchLoading] = useState(false);
  const [guardian1SearchError, setGuardian1SearchError] = useState<string | null>(null);
  const [guardian1SearchSuccess, setGuardian1SearchSuccess] = useState<string | null>(null);

  // Parent/Guardian 2 details
  const [showGuardian2, setShowGuardian2] = useState(false);
  const [guardian2Name, setGuardian2Name] = useState('');
  const [guardian2Relation, setGuardian2Relation] = useState('');
  const [guardian2Phone, setGuardian2Phone] = useState('');
  const [guardian2Email, setGuardian2Email] = useState('');
  const [guardian2Mode, setGuardian2Mode] = useState<'add' | 'search'>('add');
  const [guardian2SearchEmail, setGuardian2SearchEmail] = useState('');
  const [guardian2SearchLoading, setGuardian2SearchLoading] = useState(false);
  const [guardian2SearchError, setGuardian2SearchError] = useState<string | null>(null);
  const [guardian2SearchSuccess, setGuardian2SearchSuccess] = useState<string | null>(null);

  // Sibling details
  const [hasSibling, setHasSibling] = useState(false);
  const [siblingName, setSiblingName] = useState('');
  const [siblingRegistrationNo, setSiblingRegistrationNo] = useState('');

  const [documents, setDocuments] = useState<{ documentName: string; fileUrl: string }[]>([
    { documentName: 'CNIC or Identification', fileUrl: '' }
  ]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);


  const handleAddDocument = () => {
    setDocuments([...documents, { documentName: '', fileUrl: '' }]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (index: number, field: 'documentName' | 'fileUrl', value: string) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  const [uploadingIndices, setUploadingIndices] = useState<Record<number, boolean>>({});

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert('File size exceeds 500KB limit');
      e.target.value = '';
      return;
    }

    setUploadingIndices(prev => ({ ...prev, [index]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admissions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = res.data;
      if (data && data.fileUrl) {
        handleDocumentChange(index, 'fileUrl', data.fileUrl);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to upload file');
    } finally {
      setUploadingIndices(prev => ({ ...prev, [index]: false }));
    }
  };


  const handleSearchGuardian1 = async () => {
    if (!guardian1SearchEmail.trim()) {
      setGuardian1SearchError('Please enter a guardian email or phone to search');
      return;
    }
    setGuardian1SearchLoading(true);
    setGuardian1SearchError(null);
    setGuardian1SearchSuccess(null);

    try {
      const res = await api.get(`/admissions/guardian/${encodeURIComponent(guardian1SearchEmail.trim())}`);
      const data = res.data;
      if (data && data.exists) {
        setGuardianName(data.fullName);
        setGuardianPhone(data.phone || '');
        setGuardianEmail(data.email || '');
        setGuardian1SearchSuccess('Guardian found! Details auto-populated.');
      } else {
        setGuardian1SearchError('No registered guardian found. Fill details manually below.');
      }
    } catch (err: any) {
      setGuardian1SearchError(err.message || 'Failed to search for guardian');
    } finally {
      setGuardian1SearchLoading(false);
    }
  };

  const handleSearchGuardian2 = async () => {
    if (!guardian2SearchEmail.trim()) {
      setGuardian2SearchError('Please enter a guardian email or phone to search');
      return;
    }
    setGuardian2SearchLoading(true);
    setGuardian2SearchError(null);
    setGuardian2SearchSuccess(null);

    try {
      const res = await api.get(`/admissions/guardian/${encodeURIComponent(guardian2SearchEmail.trim())}`);
      const data = res.data;
      if (data && data.exists) {
        setGuardian2Name(data.fullName);
        setGuardian2Phone(data.phone || '');
        setGuardian2Email(data.email || '');
        setGuardian2SearchSuccess('Guardian found! Details auto-populated.');
      } else {
        setGuardian2SearchError('No registered guardian found. Fill details manually below.');
      }
    } catch (err: any) {
      setGuardian2SearchError(err.message || 'Failed to search for guardian');
    } finally {
      setGuardian2SearchLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (guardianEmail && email && guardianEmail.toLowerCase().trim() === email.toLowerCase().trim()) {
      setError('Guardian email and student email cannot be the same.');
      setLoading(false);
      return;
    }

    if (showGuardian2 && guardian2Email && email && guardian2Email.toLowerCase().trim() === email.toLowerCase().trim()) {
      setError('Guardian 2 email and student email cannot be the same.');
      setLoading(false);
      return;
    }

    if (showGuardian2 && guardian2Email && guardianEmail && guardian2Email.toLowerCase().trim() === guardianEmail.toLowerCase().trim()) {
      setError('Guardian 1 and Guardian 2 emails cannot be the same.');
      setLoading(false);
      return;
    }

    // Clean up empty document fields
    const validDocuments = documents.filter(doc => doc.documentName.trim() && doc.fileUrl.trim());

    try {
      await api.post('/admissions/apply', {
        fullName,
        email,
        phone,
        courseId: courseId ? Number(courseId) : null,
        paymentOption,
        claimFreeFreelancing: is6MonthCourse ? claimFreeFreelancing : false,
        guardianName: guardianName.trim() || null,
        guardianRelation: guardianRelation || null,
        guardianPhone: guardianPhone.trim() || null,
        guardianEmail: guardianEmail.trim() || null,
        guardian2Name: showGuardian2 ? (guardian2Name.trim() || null) : null,
        guardian2Relation: showGuardian2 ? (guardian2Relation || null) : null,
        guardian2Phone: showGuardian2 ? (guardian2Phone.trim() || null) : null,
        guardian2Email: showGuardian2 ? (guardian2Email.trim() || null) : null,
        hasSibling,
        siblingName: hasSibling ? siblingName.trim() : null,
        siblingRegistrationNo: hasSibling ? siblingRegistrationNo.trim() : null,
        highestQualification: highestQualification.trim() || null,
        institutionName: institutionName.trim() || null,
        boardUniversity: boardUniversity.trim() || null,
        completionYear: completionYear ? Number(completionYear) : null,
        obtainedGpa: obtainedGpa.trim() || null,
        password: password.trim() || null,
        documents: validDocuments
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && verificationSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-[0_30px_60px_rgba(59,130,246,0.12)]">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-4">Email Verified!</h2>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Thank you! Your email address has been verified successfully and your student portal account is active.
          </p>
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 mb-8 text-left text-sm text-slate-400 space-y-2">
            <p className="text-slate-300 font-medium">🔍 Next Step:</p>
            <p>Our administrative founders (Ghulam Ghaus and Saqib Javed) will review your academic qualifications. You can log in to your dashboard to monitor status and upload any remaining documents.</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            Go to Login Portal
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_30px_60px_rgba(59,130,246,0.12)]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">Verify Your Email</h2>
            <p className="text-slate-400 text-sm mt-1">Enter the 6-digit code sent to <span className="text-blue-400 font-semibold">{email}</span></p>
          </div>

          {verificationError && (
            <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium">
              {verificationError}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium">
              {resendSuccess}
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                6-Digit Verification Code
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-red-400 text-xs mt-1.5 font-semibold">Do not share this OTP/Verification Code with anyone.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={verificationLoading}
                className="flex-1 relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {verificationLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={verificationLoading}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans pb-16">
      {/* Glow Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/logo.jpg"
            alt="GG IT Solutions Logo"
            width={34}
            height={34}
            className="rounded-lg bg-white p-0.5"
          />
          <span className="font-bold tracking-wide text-sm md:text-base text-slate-300 group-hover:text-white transition-colors">GG IT SOLUTIONS</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white flex items-center border border-white/10 hover:border-white/30 rounded-xl px-4 py-2 bg-white/5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Cancel
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* Info Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
              Admissions Open 2026
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Start Your Technical <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Career Journey</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Submit your documents for evaluation. Approved applicants get access to our online portal, live batch scheduling, and hands-on developer training.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start space-x-4 bg-slate-900/30 border border-white/5 rounded-2xl p-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              {/* <div>
                <h4 className="text-sm font-semibold text-slate-200">Verified Certifications   ---Soon----</h4>
                <p className="text-xs text-slate-500 mt-1">Acquire professional diplomas recognized by industry hiring managers.</p>
              </div> */}
            </div>

            <div className="flex items-start space-x-4 bg-slate-900/30 border border-white/5 rounded-2xl p-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Bilingual Faculty</h4>
                <p className="text-xs text-slate-500 mt-1">Access lecture streams and 1-on-1 mentorship delivered in both English and Urdu.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-slate-900/30 border border-white/5 rounded-2xl p-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Corporate Placements</h4>
                <p className="text-xs text-slate-500 mt-1">Get fast-tracked into junior roles through our localized software house hiring programs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Right Column */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(8,112,184,0.05)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-5 h-5 text-blue-400 mr-2.5" />
              Application Form
            </h3>

            {error && (
              <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* SECTION 1: APPLICANT INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-white/5 pb-2">
                  Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <User className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                        placeholder="Ghulam Ghaus"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Mail className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Phone className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                        placeholder="+92 300 1234567"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Select Course
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <GraduationCap className="w-4.5 h-4.5" />
                      </span>
                      <select
                        value={courseId}
                        onChange={(e) => {
                          setCourseId(e.target.value);
                          setClaimFreeFreelancing(false); // Reset on change
                        }}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-slate-950">Select course of interest...</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id} className="bg-slate-950">
                            {c.name} {c.duration ? `(${c.duration})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Create Portal Password * (For student login after approval)
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Lock className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* 6-Month Special Offer Banner & Checkbox */}
                {is6MonthCourse && (
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4 mt-4 animate-in fade-in duration-200 flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="claimFreeFreelancing"
                      checked={claimFreeFreelancing}
                      onChange={(e) => setClaimFreeFreelancing(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-purple-500/30 bg-slate-950/50 text-purple-500 focus:ring-0 cursor-pointer mt-0.5"
                    />
                    <label htmlFor="claimFreeFreelancing" className="text-xs font-semibold text-slate-350 cursor-pointer select-none">
                      <span className="text-purple-400 font-bold block mb-0.5">🎁 GG IT Solutions Student Benefit</span>
                      Claim the <strong>Freelancing & Career Guidance</strong> course for <strong>FREE</strong> alongside this 6-month program! (Recommended)
                    </label>
                  </div>
                )}

                {/* Last Education Section */}
                <div className="border-t border-white/5 pt-6 mt-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                    <GraduationCap className="w-4 h-4 text-purple-400 mr-2" />
                    Last Academic Education Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Highest Qualification / Degree *
                      </label>
                      <select
                        value={highestQualification}
                        onChange={(e) => setHighestQualification(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none cursor-pointer text-slate-200"
                        required
                      >
                        <option value="" className="bg-slate-950 text-slate-400">Select qualification...</option>
                        <option value="Matriculation / O-Level" className="bg-slate-950">Matriculation / O-Level</option>
                        <option value="Intermediate (FSc / ICS / FA / ICom) / A-Level" className="bg-slate-950">Intermediate (FSc / ICS / FA / ICom) / A-Level</option>
                        <option value="Bachelor's Degree (BS / BSc / BCom)" className="bg-slate-950">Bachelor's Degree (BS / BSc / BCom)</option>
                        <option value="Master's Degree (MS / MSc / MPhil)" className="bg-slate-950">Master's Degree (MS / MSc / MPhil)</option>
                        <option value="Doctorate / PhD" className="bg-slate-950">Doctorate / PhD</option>
                        <option value="Other" className="bg-slate-950">Other</option>
                      </select>
                    </div>


                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Obtained Grade / Percentage / GPA *
                      </label>
                      <input
                        type="text"
                        value={obtainedGpa}
                        onChange={(e) => setObtainedGpa(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                        placeholder="e.g. A+ / 85% / 3.7"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        School / College / University *
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                        placeholder="e.g. Punjab Group of Colleges"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Board / University *
                      </label>
                      <input
                        type="text"
                        value={boardUniversity}
                        onChange={(e) => setBoardUniversity(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                        placeholder="e.g. BISE Lahore / HEC"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Year of Completion *
                      </label>
                      <select
                        value={completionYear}
                        onChange={(e) => setCompletionYear(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none cursor-pointer text-slate-200"
                        required
                      >
                        <option value="" className="bg-slate-950 text-slate-400">Select year...</option>
                        {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year} className="bg-slate-950">{year}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Preferred Payment Plan
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Briefcase className="w-4.5 h-4.5" />
                      </span>
                      <select
                        value={paymentOption}
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="FULL_PAYMENT" className="bg-slate-950">Full One-time Payment (5% to 10% Discount)</option>
                        <option value="INSTALLMENT" className="bg-slate-950">Monthly Installment Plan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-4 text-xs text-slate-400 flex items-start space-x-3 w-full mt-4 md:mt-0">
                      <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Flexible Payment & Discount Terms</span>
                        <span className="mt-0.5 block leading-relaxed">
                          Selecting <strong>Full One-time Payment</strong> triggers a flexible <strong>5% to 10% discount</strong> on overall tuition. Installment plans are billed and paid monthly.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* SECTION 2: PARENT / GUARDIAN INFORMATION */}
              <div className="space-y-6 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Parent / Guardian Information (Guardian 1)
                  </h4>
                  <div className="flex items-center space-x-2 bg-slate-950/40 p-1 border border-white/5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setGuardian1Mode('add');
                        setGuardianName('');
                        setGuardianPhone('');
                        setGuardianEmail('');
                        setGuardian1SearchSuccess(null);
                        setGuardian1SearchError(null);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${guardian1Mode === 'add' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      ADD NEW
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuardian1Mode('search')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${guardian1Mode === 'search' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      SEARCH EXISTING
                    </button>
                  </div>
                </div>

                {/* Guardian 1 Search Field */}
                {guardian1Mode === 'search' && (
                  <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl space-y-3 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Search Guardian by Registered Email or Phone
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={guardian1SearchEmail}
                        onChange={(e) => setGuardian1SearchEmail(e.target.value)}
                        className="flex-1 bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-2 px-4 text-sm outline-none transition-all text-slate-200"
                        placeholder="guardian.registered@example.com or phone number"
                      />
                      <button
                        type="button"
                        onClick={handleSearchGuardian1}
                        disabled={guardian1SearchLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-4 rounded-xl transition-all flex items-center justify-center min-w-[80px] cursor-pointer"
                      >
                        {guardian1SearchLoading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                    {guardian1SearchError && (
                      <p className="text-rose-400 text-xs">{guardian1SearchError}</p>
                    )}
                    {guardian1SearchSuccess && (
                      <p className="text-emerald-400 text-xs">{guardian1SearchSuccess}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Guardian Name
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <UserCheck className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        readOnly={guardian1Mode === 'search' && !!guardianName}
                        className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian1Mode === 'search' && !!guardianName ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                        placeholder="Guardian Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Relationship
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <GitPullRequest className="w-4.5 h-4.5" />
                      </span>
                      <select
                        value={guardianRelation}
                        onChange={(e) => setGuardianRelation(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-slate-950">Select relationship...</option>
                        <option value="Father" className="bg-slate-950">Father</option>
                        <option value="Mother" className="bg-slate-950">Mother</option>
                        <option value="Brother" className="bg-slate-950">Brother</option>
                        <option value="Sister" className="bg-slate-950">Sister</option>
                        <option value="Uncle" className="bg-slate-950">Uncle</option>
                        <option value="Aunt" className="bg-slate-950">Aunt</option>
                        <option value="Other" className="bg-slate-950">Other Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Guardian Phone
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Phone className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="tel"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        readOnly={guardian1Mode === 'search' && !!guardianPhone}
                        className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian1Mode === 'search' && !!guardianPhone ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                        placeholder="+92 300 9876543"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Guardian Email
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Mail className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="email"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        readOnly={guardian1Mode === 'search' && !!guardianEmail}
                        className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian1Mode === 'search' && !!guardianEmail ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                        placeholder="guardian@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Guardian Toggle */}
                <div className="pt-2">
                  {!showGuardian2 ? (
                    <button
                      type="button"
                      onClick={() => setShowGuardian2(true)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 rounded-xl px-4 py-2 bg-blue-500/5 transition-all cursor-pointer"
                    >
                      + Add Secondary Guardian (Optional)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowGuardian2(false);
                        setGuardian2Name('');
                        setGuardian2Relation('');
                        setGuardian2Phone('');
                        setGuardian2Email('');
                        setGuardian2SearchSuccess(null);
                        setGuardian2SearchError(null);
                      }}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-xl px-4 py-2 bg-rose-500/5 transition-all cursor-pointer"
                    >
                      - Remove Secondary Guardian
                    </button>
                  )}
                </div>

                {/* GUARDIAN 2 SECTION */}
                {showGuardian2 && (
                  <div className="space-y-6 border-t border-white/5 pt-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Secondary Guardian Information (Guardian 2)
                      </h4>
                      <div className="flex items-center space-x-2 bg-slate-950/40 p-1 border border-white/5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setGuardian2Mode('add');
                            setGuardian2Name('');
                            setGuardian2Phone('');
                            setGuardian2Email('');
                            setGuardian2SearchSuccess(null);
                            setGuardian2SearchError(null);
                          }}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${guardian2Mode === 'add' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          ADD NEW
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuardian2Mode('search')}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${guardian2Mode === 'search' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          SEARCH EXISTING
                        </button>
                      </div>
                    </div>

                    {/* Guardian 2 Search Field */}
                    {guardian2Mode === 'search' && (
                      <div className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl space-y-3 animate-in fade-in duration-200">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Search Secondary Guardian by Registered Email or Phone
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={guardian2SearchEmail}
                            onChange={(e) => setGuardian2SearchEmail(e.target.value)}
                            className="flex-1 bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-2 px-4 text-sm outline-none transition-all text-slate-200"
                            placeholder="guardian2.registered@example.com or phone number"
                          />
                          <button
                            type="button"
                            onClick={handleSearchGuardian2}
                            disabled={guardian2SearchLoading}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-4 rounded-xl transition-all flex items-center justify-center min-w-[80px] cursor-pointer"
                          >
                            {guardian2SearchLoading ? 'Searching...' : 'Search'}
                          </button>
                        </div>
                        {guardian2SearchError && (
                          <p className="text-rose-400 text-xs">{guardian2SearchError}</p>
                        )}
                        {guardian2SearchSuccess && (
                          <p className="text-emerald-400 text-xs">{guardian2SearchSuccess}</p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Guardian Name
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <UserCheck className="w-4.5 h-4.5" />
                          </span>
                          <input
                            type="text"
                            value={guardian2Name}
                            onChange={(e) => setGuardian2Name(e.target.value)}
                            readOnly={guardian2Mode === 'search' && !!guardian2Name}
                            className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian2Mode === 'search' && !!guardian2Name ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                            placeholder="Guardian Full Name"
                            required={showGuardian2}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Relationship
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <GitPullRequest className="w-4.5 h-4.5" />
                          </span>
                          <select
                            value={guardian2Relation}
                            onChange={(e) => setGuardian2Relation(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                            required={showGuardian2}
                          >
                            <option value="" className="bg-slate-950">Select relationship...</option>
                            <option value="Father" className="bg-slate-950">Father</option>
                            <option value="Mother" className="bg-slate-950">Mother</option>
                            <option value="Brother" className="bg-slate-950">Brother</option>
                            <option value="Sister" className="bg-slate-950">Sister</option>
                            <option value="Uncle" className="bg-slate-950">Uncle</option>
                            <option value="Aunt" className="bg-slate-950">Aunt</option>
                            <option value="Other" className="bg-slate-950">Other Guardian</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Guardian Phone
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Phone className="w-4.5 h-4.5" />
                          </span>
                          <input
                            type="tel"
                            value={guardian2Phone}
                            onChange={(e) => setGuardian2Phone(e.target.value)}
                            readOnly={guardian2Mode === 'search' && !!guardian2Phone}
                            className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian2Mode === 'search' && !!guardian2Phone ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                            placeholder="+92 300 9876543"
                            required={showGuardian2}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Guardian Email
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Mail className="w-4.5 h-4.5" />
                          </span>
                          <input
                            type="email"
                            value={guardian2Email}
                            onChange={(e) => setGuardian2Email(e.target.value)}
                            readOnly={guardian2Mode === 'search' && !!guardian2Email}
                            className={`w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all ${guardian2Mode === 'search' && !!guardian2Email ? 'opacity-70 cursor-not-allowed bg-slate-900/10' : ''}`}
                            placeholder="guardian2@example.com"
                            required={showGuardian2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: SIBLING INFORMATION */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasSibling"
                    checked={hasSibling}
                    onChange={(e) => setHasSibling(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="hasSibling" className="text-xs font-semibold text-slate-300 cursor-pointer selection:bg-transparent">
                    A sibling is already enrolled at GG IT Solutions
                  </label>
                </div>

                {hasSibling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Sibling Full Name
                      </label>
                      <input
                        type="text"
                        value={siblingName}
                        onChange={(e) => setSiblingName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                        placeholder="Sibling Name"
                        required={hasSibling}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Sibling Roll Number / Reg No.
                      </label>
                      <input
                        type="text"
                        value={siblingRegistrationNo}
                        onChange={(e) => setSiblingRegistrationNo(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-sm outline-none transition-all"
                        placeholder="GGIT-2025-XXXX"
                        required={hasSibling}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: DOCUMENTS SECTION */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center">
                    <FileText className="w-4.5 h-4.5 text-purple-400 mr-2" />
                    Supporting Documents
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Upload copies of your matric, intermediate certificates, or CNIC card scans (Max size: 500KB per file).</p>

                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-white/5 animate-in fade-in duration-200">
                      <input
                        type="text"
                        value={doc.documentName}
                        onChange={(e) => handleDocumentChange(idx, 'documentName', e.target.value)}
                        placeholder="Document Name (e.g. Matric Transcript)"
                        className="w-1/3 bg-slate-900 border border-white/5 focus:border-blue-500/50 rounded-lg py-2 px-3 text-xs outline-none text-slate-205 transition-all text-slate-200"
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="file"
                          id={`file-upload-${idx}`}
                          onChange={(e) => handleFileChange(idx, e)}
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                        />
                        <label
                          htmlFor={`file-upload-${idx}`}
                          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 text-xs font-semibold text-slate-350 cursor-pointer select-none transition-all flex items-center gap-1.5 shrink-0"
                        >
                          {uploadingIndices[idx] ? 'Uploading...' : doc.fileUrl ? 'Change File' : 'Choose File'}
                        </label>
                        {doc.fileUrl && (
                          <span className="text-xs text-emerald-400 font-medium truncate max-w-[200px]" title={doc.fileUrl}>
                            ✓ Uploaded
                          </span>
                        )}
                      </div>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold rounded-xl py-3.5 shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 transition-all cursor-pointer mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
