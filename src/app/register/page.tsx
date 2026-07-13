'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState<number>(4); // Default to PARENT (id: 4)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect to profile if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        roleId,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-lg [perspective:1000px] pointer-events-auto">
        {/* 3D Glassmorphic Card Container */}
        <div 
          className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(138,58,232,0.1)] 
                     [transform-style:preserve-3d] transition-all duration-500 ease-out hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateZ(10px)] 
                     hover:border-purple-500/30 hover:shadow-[0_25px_60px_rgba(168,85,247,0.18)]"
        >
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8 [transform:translateZ(20px)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">Join the GG IT Solutions ERP & LMS Portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200 [transform:translateZ(15px)]">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4 [transform:translateZ(15px)]">
            {/* Grid for Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  First Name *
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Last Name *
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password * (min 6 characters)
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Portal Role *
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                >
                  <option value={4} className="bg-slate-950 text-slate-100">Parent</option>
                  <option value={5} className="bg-slate-950 text-slate-100">Applicant</option>
                </select>
              </div>
            </div>

            {/* Info notice about student registration restrictions */}
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs rounded-xl p-3.5 leading-relaxed">
              <strong className="text-blue-400 block mb-1">Student Signup Notice:</strong>
              Students cannot sign up directly. A student account is automatically provisioned only after submitting an official admission application. 
              <Link href="/apply" className="text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline">
                Apply for Admission here →
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-purple-500/10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign Up
                    <UserPlus className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-slate-400 [transform:translateZ(10px)]">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
