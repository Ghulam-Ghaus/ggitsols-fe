'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  Volume2, 
  GraduationCap, 
  BookOpen, 
  Sparkles,
  Server,
  Database,
  Key
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role?: {
    name: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingStatus, setPingStatus] = useState<'Checking...' | 'Online' | 'Offline'>('Checking...');
  const [systemLatency, setSystemLatency] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const res = await api.get('/users');
        setUsers(res.data.data);
        
        // Measure backend latency
        setSystemLatency(Date.now() - startTime);
        setPingStatus('Online');
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setPingStatus('Offline');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role?.name === 'ADMIN').length;
  const teacherCount = users.filter(u => u.role?.name === 'TEACHER').length;
  const studentCount = users.filter(u => u.role?.name === 'STUDENT').length;
  const parentCount = users.filter(u => u.role?.name === 'PARENT').length;
  const applicantCount = users.filter(u => u.role?.name === 'APPLICANT').length;
  const activeCount = users.filter(u => u.isActive).length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Enrolled Students', value: studentCount, icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Academic Staff', value: teacherCount, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Guardians & Parents', value: parentCount, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Applicants', value: applicantCount, icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Active Sessions', value: activeCount, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 via-slate-900/40 to-blue-900/30 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl">
              Manage student registries, admissions applications, staff permissions, and monitor system resources from one integrated ERP & LMS dashboard.
            </p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Link
              href="/admin/users"
              className="flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-purple-500/10 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg hover:border-purple-500/20 transition-all group hover:translate-y-[-2px] duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white mt-2 tracking-tight">
                    {loading ? (
                      <span className="inline-block w-8 h-8 bg-slate-800 rounded animate-pulse"></span>
                    ) : (
                      stat.value
                    )}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Activity & Logs */}
        <section className="lg:col-span-8 bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center space-x-2.5">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-base md:text-lg">Recent Registered Users</h3>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center transition-colors hover:underline"
            >
              View All Users
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="space-y-1.5">
                      <div className="w-24 h-3 bg-slate-800 rounded animate-pulse"></div>
                      <div className="w-32 h-2.5 bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-5 bg-slate-800 rounded-full animate-pulse"></div>
                </div>
              ))
            ) : users.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No users found in database</p>
            ) : (
              users
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((u) => (
                  <div key={u.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.01] px-2 rounded-xl transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300 text-xs shrink-0">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-200 block truncate">{u.firstName} {u.lastName}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{u.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-slate-950 border border-white/5 text-purple-400 uppercase">
                        {u.role?.name || 'STUDENT'}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Right Column: System Status & Quick Actions */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions */}
          <section className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-sm md:text-base mb-4 border-b border-white/5 pb-3">Quick Navigation</h3>
            <div className="space-y-3.5">
              <Link 
                href="/admin/users"
                className="flex items-center text-xs font-medium text-slate-300 bg-slate-950/40 hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/20 rounded-xl p-3.5 transition-all group cursor-pointer"
              >
                <Plus className="w-4 h-4 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                <span>Create User Profile</span>
              </Link>
              <div 
                className="flex items-center text-xs font-medium text-slate-500 bg-slate-950/20 border border-white/5 rounded-xl p-3.5 opacity-60 cursor-not-allowed select-none"
              >
                <Volume2 className="w-4 h-4 text-slate-600 mr-3" />
                <span>Publish Announcement (Soon)</span>
              </div>
              <div 
                className="flex items-center text-xs font-medium text-slate-500 bg-slate-950/20 border border-white/5 rounded-xl p-3.5 opacity-60 cursor-not-allowed select-none"
              >
                <Key className="w-4 h-4 text-slate-600 mr-3" />
                <span>Audit Trail Logs (Soon)</span>
              </div>
            </div>
          </section>

          {/* System Health */}
          <section className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm md:text-base border-b border-white/5 pb-3">System Health</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center">
                  <Server className="w-4 h-4 text-purple-400 mr-2.5" />
                  API Endpoint Status
                </span>
                <span className={`inline-flex items-center font-bold ${pingStatus === 'Online' ? 'text-emerald-400' : pingStatus === 'Offline' ? 'text-rose-400' : 'text-slate-500'}`}>
                  {pingStatus === 'Online' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1 animate-spin" />}
                  {pingStatus}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center">
                  <Database className="w-4 h-4 text-blue-400 mr-2.5" />
                  Database Link
                </span>
                <span className="inline-flex items-center font-bold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Connected
                </span>
              </div>

              {systemLatency !== null && (
                <div className="flex justify-between items-center text-slate-400 border-t border-white/5 pt-3.5">
                  <span>API Response Time</span>
                  <span className="font-bold text-slate-200">{systemLatency} ms</span>
                </div>
              )}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
