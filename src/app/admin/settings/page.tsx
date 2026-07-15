'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, Mail, Phone, Edit2, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, token, loading, refreshUser } = useAuth();
  const router = useRouter();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading settings...</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const updateData = {
      firstName,
      lastName,
      email,
      phone: phone || null,
    };

    try {
      await api.patch(`/users/${user.id}`, updateData);
      await refreshUser();
      setSuccessMsg('Admin profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile details.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 md:p-6">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Control Panel</span>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          System Settings
        </h1>
      </div>

      <div 
        className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl 
                   hover:border-purple-500/20 hover:shadow-purple-500/5 transition-all duration-300"
      >
        <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
          <Edit2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-slate-100">Edit Administrator Profile</h3>
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
    </div>
  );
}
