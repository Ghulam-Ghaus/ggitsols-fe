'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

export default function LoginPage() {
  const { login, isAuthenticated, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Reset password states
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Signup verification states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

  // Redirect to dashboard/profile if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role?.name === 'ADMIN') {
        router.push('/admin');
      } else if (user.role?.name === 'STUDENT') {
        router.push('/profile/academic');
      } else {
        router.push('/profile');
      }
    }
  }, [isAuthenticated, user, router]);

  // Parse query parameters for direct verification flow
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verify = params.get('verify');
      const emailParam = params.get('email');
      if (verify === 'true') {
        setShowVerification(true);
        if (emailParam) {
          setVerificationEmail(emailParam);
        }
      }
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      if (err.message && err.message.includes('EMAIL_NOT_VERIFIED')) {
        setError(null);
        setVerificationEmail(email);
        setShowVerification(true);
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail || !verificationCode) {
      setError('Please enter the verification code.');
      return;
    }
    setVerificationLoading(true);
    setError(null);
    setVerificationSuccess(null);
    try {
      await api.post('/users/verify-email', {
        email: verificationEmail,
        code: verificationCode
      });
      setVerificationSuccess('Email verified successfully! You can now sign in.');
      setVerificationCode('');
      setTimeout(() => {
        setShowVerification(false);
        setVerificationSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    if (!verificationEmail) {
      setError('Email address is missing.');
      return;
    }
    setVerificationLoading(true);
    setError(null);
    setVerificationSuccess(null);
    try {
      await api.post('/users/resend-verification-code', { email: verificationEmail });
      setVerificationSuccess('A new verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setVerificationLoading(false);
    }
  };


  const handleSendCode = async () => {
    if (!resetEmail) {
      setError('Please enter your email address to receive a verification code.');
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetSuccess(null);
    try {
      await api.post('/users/forgot-password-code', { email: resetEmail });
      setCodeSent(true);
      setResetSuccess('Verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please check the email.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetCode || !newPassword) {
      setError('Please enter your email, verification code, and new password.');
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetSuccess(null);
    try {
      await api.post('/users/reset-password-with-code', {
        email: resetEmail,
        code: resetCode,
        newPassword
      });
      setResetSuccess('Your password has been successfully reset! You can now sign in.');
      setCodeSent(false);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setTimeout(() => {
        setShowReset(false);
        setResetSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setResetLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden font-sans">
      {/* Floating Back to Website Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          href="/"
          className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Website
        </Link>
      </div>

      {/* 3D Ambient Glowing Circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div 
        className="relative w-full max-w-md [perspective:1000px] pointer-events-auto"
      >
        {/* 3D Glassmorphic Card Container */}
        <div 
          className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(8,112,184,0.1)] 
                     [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateZ(10px)] 
                     hover:border-blue-500/30 hover:shadow-[0_25px_60px_rgba(59,130,246,0.18)]"
        >
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8 [transform:translateZ(20px)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {showVerification ? 'Verify Email' : showReset ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {showVerification ? 'Enter code to activate your account' : showReset ? 'Verify your identity to reset password' : 'GG IT Solutions ERP & LMS Portal'}
            </p>
          </div>

          {/* Success Alert */}
          {(resetSuccess || verificationSuccess) && (
            <div className="mb-6 flex items-start space-x-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-emerald-250 text-sm animate-in fade-in slide-in-from-top-1 duration-200 [transform:translateZ(15px)]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{verificationSuccess || resetSuccess}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200 [transform:translateZ(15px)]">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {showVerification ? (
            /* Email Verification Form */
            <form onSubmit={handleVerifyEmail} className="space-y-5 [transform:translateZ(15px)]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={verificationEmail}
                    onChange={(e) => setVerificationEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="name@ggitsols.com"
                    required
                  />
                </div>
              </div>

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
                  {verificationLoading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                <button
                  type="button"
                  onClick={handleResendVerificationCode}
                  disabled={verificationLoading}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                >
                  Resend Code
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setError(null);
                  setVerificationSuccess(null);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white font-semibold transition-colors mt-2 cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          ) : showReset ? (
            /* Reset Password Form */
            <form onSubmit={handleResetPassword} className="space-y-5 [transform:translateZ(15px)]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                      placeholder="name@ggitsols.com"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={resetLoading}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                  >
                    {resetLoading && !codeSent ? 'Sending...' : 'Send Code'}
                  </button>
                </div>
              </div>

              {codeSent && (
                <>
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
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      New Password
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Lock className="w-5 h-5" />
                      </span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
                  >
                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setError(null);
                  setResetSuccess(null);
                }}
                className="w-full text-center text-xs text-slate-450 hover:text-white font-semibold transition-colors mt-2 cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-5 [transform:translateZ(15px)]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="name@ggitsols.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVerification(true);
                        setError(null);
                        setVerificationSuccess(null);
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                    >
                      Verify Email?
                    </button>
                    <span className="text-slate-650 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReset(true);
                        setError(null);
                        setResetSuccess(null);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                <span className="flex items-center justify-center">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Sign In
                      <LogIn className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-slate-400 [transform:translateZ(10px)]">
            Want to enroll?{' '}
            <Link 
              href="/apply" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
