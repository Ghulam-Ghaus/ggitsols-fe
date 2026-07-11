'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  User,
  GraduationCap
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!loading) {
      if (!token || !user) {
        router.push('/login');
      } else if (user.role?.name !== 'ADMIN') {
        router.push('/profile');
      }
    }
  }, [loading, token, user, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading || !user || user.role?.name !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Role Permissions', href: '/admin/roles', icon: Shield },
    { label: 'Admissions', href: '/admin/admissions', icon: GraduationCap, badge: 'Soon' },
    { label: 'Courses & Batches', href: '/admin/courses', icon: BookOpen, badge: 'Soon' },
    { label: 'Attendance', href: '/admin/attendance', icon: Calendar, badge: 'Soon' },
    { label: 'Finance', href: '/admin/finance', icon: DollarSign, badge: 'Soon' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, badge: 'Soon' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900/40 backdrop-blur-xl border-r border-white/5 p-6 shrink-0 relative z-30">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold tracking-wide text-sm block">GG IT SOLUTIONS</span>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">Admin Control</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-purple-600/15 border border-purple-500/30 text-purple-200 shadow-md shadow-purple-500/5' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <span className="flex items-center">
                  <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[9px] bg-slate-950/60 border border-white/5 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info */}
        <div className="border-t border-white/5 pt-4 mt-4 flex flex-col space-y-3 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-200 block truncate">{user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-slate-500 block truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl py-2.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wide text-xs">GG IT PORTAL</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm">
          <aside className="w-64 h-full bg-slate-900 p-6 border-r border-white/5 flex flex-col justify-between animate-in slide-in-from-left duration-250">
            <div>
              <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300 text-xs">
                  A
                </div>
                <div>
                  <span className="font-bold text-sm block">Admin Panel</span>
                  <span className="text-[9px] text-purple-400 uppercase tracking-widest block font-bold">GG IT SOLUTIONS</span>
                </div>
              </div>
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-purple-600/15 border border-purple-500/30 text-purple-200' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] bg-slate-950/60 border border-white/5 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="border-t border-white/5 pt-4 flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300">
                  {user.firstName[0]}
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-slate-200 block truncate">{user.firstName} {user.lastName}</span>
                  <span className="text-[9px] text-slate-500 block truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl py-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 relative">
        {/* Glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        
        {children}
      </main>

    </div>
  );
}
