'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { User, Mail, Phone, Shield, Power, Edit2, CheckCircle, AlertCircle, Save, Key, Globe, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { user, token, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  // Set form fields once user is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const updateData: any = {
      firstName,
      lastName,
      email,
      phone: phone || null,
    };

    if (password) {
      if (password.length < 6) {
        setErrorMsg('New password must be at least 6 characters long');
        setFormLoading(false);
        return;
      }
      updateData.password = password;
    }

    try {
      await api.patch(`/users/${user.id}`, updateData);
      await refreshUser();
      setSuccessMsg('Profile updated successfully!');
      setPassword(''); // Clear password field
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile details.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
            GG
          </div>
          <span className="font-bold tracking-wide text-sm md:text-base">IT SOLUTIONS ERP & LMS</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 rounded-xl px-4 py-2.5 transition-all"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Link>
          {user?.role?.name === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl px-4 py-2.5 transition-all"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Link>
          )}
          <button
            onClick={logout}
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl px-4 py-2.5 transition-all cursor-pointer"
          >
            <Power className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: User Profile details Card */}
        <section className="lg:col-span-1 [perspective:1000px]">
          <div 
            className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl 
                       hover:border-blue-500/20 hover:shadow-blue-500/5 transition-all duration-300"
          >
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center border-b border-white/5 pb-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg shadow-blue-500/20 mb-4">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <Shield className="w-3 h-3 mr-1.5" />
                {user.role?.name || 'STUDENT'}
              </div>
              {user.role?.name === 'STUDENT' && (
                <Link
                  href="/profile/quizzes"
                  className="mt-4 flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl px-4 py-2 transition-all w-full"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-2" />
                  My AI Quizzes
                </Link>
              )}
              {user?.role?.name === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="mt-4 flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl px-4 py-2 transition-all w-full"
                >
                  <Shield className="w-3.5 h-3.5 mr-2 animate-pulse" />
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Detailed Properties */}
            <div className="space-y-4 text-sm">
              <div className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 text-purple-400 mr-3 shrink-0" />
                <span>{user.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-t border-white/5 pt-4 mt-4">
                <span>Account Status:</span>
                <span className="inline-flex items-center text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Edit Profile Form */}
        <section className="lg:col-span-2 [perspective:1000px]">
          <div 
            className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl 
                       hover:border-purple-500/20 hover:shadow-purple-500/5 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
              <Edit2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold">Edit Profile Details</h3>
            </div>

            {/* Alert Messages */}
            {successMsg && (
              <div className="mb-6 flex items-start space-x-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-emerald-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 flex items-start space-x-2 bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Grid for Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Grid for Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="No phone number"
                  />
                </div>
              </div>

              {/* Change Password Block */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">Change Password (Optional)</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-purple-500/10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {formLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
