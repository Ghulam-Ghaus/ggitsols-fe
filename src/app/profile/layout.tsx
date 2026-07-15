'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Mail, Phone, Shield, Power, CheckCircle, Globe, BookOpen, Calendar, DollarSign, Award 
} from 'lucide-react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Auth Guard
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    ...(user.role?.name === 'STUDENT' ? [
      { label: 'My Profile', href: '/profile/academic', icon: User },
      { label: 'My AI Quizzes', href: '/profile/quizzes', icon: BookOpen },
      { label: 'My Attendance', href: '/profile/attendance', icon: Calendar },
      { label: 'Fees & Invoices', href: '/profile/finance', icon: DollarSign }
    ] : [
      { label: 'My Profile', href: '/profile', icon: User }
    ])
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-white/5 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
            GG
          </div>
          <span className="font-bold tracking-wide text-sm md:text-base">GG IT SOLUTIONS STUDENT PORTAL</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 rounded-xl px-4 py-2.5 transition-all"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Link>
          {user.role?.name === 'ADMIN' && (
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

      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Sidebar Card */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            {/* User Avatar */}
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
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="space-y-1.5 mb-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-bold'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Contact Details */}
            <div className="space-y-4 text-xs border-t border-white/5 pt-6">
              <div className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 text-purple-400 mr-3 shrink-0" />
                <span>{user.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-white/5 mt-4">
                <span>Portal Access:</span>
                <span className="inline-flex items-center text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Portal Views */}
        <section className="lg:col-span-3">
          {children}
        </section>

      </div>
    </div>
  );
}
