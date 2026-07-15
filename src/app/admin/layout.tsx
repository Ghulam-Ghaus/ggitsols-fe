'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  GraduationCap,
  Globe,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  // Mobile / Collapse states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  // Auto-expand User Management submenu if active route is a child
  useEffect(() => {
    if (pathname === '/admin/users' || pathname === '/admin/students') {
      setUserMenuOpen(true);
    }
  }, [pathname]);

  if (loading || !user || user.role?.name !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  interface AdminMenuItem {
    label: string;
    href: string;
    icon: any;
    children?: { label: string; href: string }[];
    badge?: string;
  }

  const menuItems: AdminMenuItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { 
      label: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      children: [
        { label: 'All User Accounts', href: '/admin/users' },
        { label: 'Student Cohort Registry', href: '/admin/students' }
      ]
    },
    { label: 'Role Permissions', href: '/admin/roles', icon: Shield },
    { label: 'Admissions', href: '/admin/admissions', icon: GraduationCap },
    { label: 'Courses & Batches', href: '/admin/courses', icon: BookOpen },
    { label: 'Attendance', href: '/admin/attendance', icon: Calendar },
    { label: 'Finance', href: '/admin/finance', icon: DollarSign },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="h-screen max-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-hidden transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 shrink-0 sticky top-0 z-30 transition-all duration-300 ease-in-out h-screen overflow-hidden p-5 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Glow background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo and Collapse Toggle */}
        <div className="flex items-center justify-between mb-6 relative z-10 min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <Image 
              src="/logo.jpg" 
              alt="GG IT Solutions Logo" 
              width={36} 
              height={36} 
              className="w-9 h-9 rounded-xl object-cover shadow-md shadow-purple-500/10 shrink-0" 
            />
            <div className={`transition-all duration-300 origin-left truncate ${
              sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none' : 'opacity-100 scale-100 max-w-[140px]'
            }`}>
              <span className="font-bold tracking-wide text-xs block">GG IT SOLUTIONS</span>
              <span className="text-[9px] text-purple-400 font-semibold uppercase tracking-wider block">Admin Control</span>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer shrink-0"
            title={sidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Back to Website Button (On Top) */}
        <div className="mb-4 relative z-10 min-w-0">
          <Link
            href="/"
            className={`flex items-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl py-2.5 transition-all duration-300 min-w-0 ${
              sidebarCollapsed ? 'px-0 justify-center' : 'px-3'
            }`}
            title="Back to Website"
          >
            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
            <span className={`transition-all duration-300 text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 origin-left truncate ${
              sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none ml-0' : 'opacity-100 scale-100 max-w-[150px] ml-2'
            }`}>
              Back to Website
            </span>
          </Link>
        </div>

        {/* Navigation - Scrollbar removed */}
        <nav className="flex-1 space-y-1.5 relative z-10 min-w-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isParentActive = pathname === item.href || (item.children?.some(c => pathname === c.href));
            
            // Render subcategories inside a toggle block
            if (item.children) {
              return (
                <div key={item.label} className="space-y-1 min-w-0">
                  <button
                    onClick={() => {
                      if (sidebarCollapsed) {
                        setSidebarCollapsed(false);
                        setUserMenuOpen(true);
                      } else {
                        setUserMenuOpen(!userMenuOpen);
                      }
                    }}
                    className={`w-full flex items-center justify-between py-3 rounded-xl text-sm font-medium transition-all duration-300 group border border-transparent min-w-0 ${
                      sidebarCollapsed ? 'px-0 justify-center' : 'px-4'
                    } ${
                      isParentActive
                        ? 'bg-purple-600/5 text-purple-700 dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="flex items-center min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isParentActive ? 'text-purple-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
                      <span className={`transition-all duration-300 origin-left truncate ${
                        sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none ml-0' : 'opacity-100 scale-100 max-w-[150px] ml-3'
                      }`}>
                        {item.label}
                      </span>
                    </span>
                    <span className={`transition-all duration-350 shrink-0 ${sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none' : 'opacity-100'}`}>
                      {userMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  
                  {userMenuOpen && !sidebarCollapsed && (
                    <div className="pl-6 space-y-1 border-l border-slate-200 dark:border-white/5 ml-6 pt-1 pb-2 animate-in slide-in-from-top-1 duration-150">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isChildActive
                                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-200 border-l border-purple-500 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.01]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.label} className="min-w-0">
                <Link
                  href={item.href}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-300 group border border-transparent min-w-0 ${
                    sidebarCollapsed 
                      ? 'justify-center py-3 px-0' 
                      : 'justify-between px-4 py-3'
                  } ${
                    isParentActive
                      ? 'bg-purple-600/15 border-purple-500/30 text-purple-700 dark:text-purple-200 shadow-md shadow-purple-500/5' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="flex items-center min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isParentActive ? 'text-purple-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
                    <span className={`transition-all duration-300 origin-left truncate ${
                      sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none ml-0' : 'opacity-100 scale-100 max-w-[150px] ml-3'
                    }`}>
                      {item.label}
                    </span>
                  </span>
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-950/60 border border-slate-300 dark:border-white/5 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ml-2">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer Theme Toggle & Admin Profile */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-4 mt-4 relative z-10 min-w-0">
          
          {/* Admin User Profile card & Logout Side-By-Side (Left-Right) */}
          <div className="flex flex-row items-center justify-between w-full space-x-2 animate-in fade-in duration-200 min-w-0">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-600 dark:text-purple-300 shrink-0 text-xs font-sans">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className={`transition-all duration-300 origin-left truncate ${
                sidebarCollapsed ? 'opacity-0 scale-90 max-w-0 pointer-events-none ml-0' : 'opacity-100 scale-100 max-w-[120px]'
              }`}>
                <span className="text-xs font-semibold text-slate-850 dark:text-slate-200 block truncate">{user.firstName} {user.lastName}</span>
                <span className="text-[9px] text-slate-500 block truncate">{user.email}</span>
              </div>
            </div>
            
            <div className={`flex items-center shrink-0 border border-slate-200 dark:border-white/10 rounded-xl p-1 bg-slate-50 dark:bg-slate-950/20 transition-all duration-300 ${
              sidebarCollapsed ? 'space-x-0' : 'space-x-1'
            }`}>
              <button
                onClick={toggleTheme}
                className="p-1.5 text-slate-505 hover:text-slate-900 dark:hover:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-lg transition-all cursor-pointer shrink-0"
                title="Switch Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                )}
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-rose-500 hover:text-rose-455 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Image 
            src="/logo.jpg" 
            alt="GG IT Solutions Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-lg object-cover shrink-0" 
          />
          <span className="font-bold tracking-wide text-xs">GG IT PORTAL</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm">
          <aside className="w-64 h-full bg-white dark:bg-slate-900 p-6 border-r border-slate-200 dark:border-white/5 flex flex-col justify-between animate-in slide-in-from-left duration-250">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/logo.jpg" 
                    alt="GG IT Solutions Logo" 
                    width={32} 
                    height={32} 
                    className="w-8 h-8 rounded-lg object-cover shrink-0" 
                  />
                  <div>
                    <span className="font-bold text-sm block">Admin Panel</span>
                    <span className="text-[9px] text-purple-400 uppercase tracking-widest block font-bold">GG IT SOLUTIONS</span>
                  </div>
                </div>
                {/* Mobile Close Icon */}
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Back to Website Button (On Top Mobile) */}
              <div className="mb-4">
                <Link
                  href="/"
                  className="flex items-center justify-center text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl py-2 px-3 transition-all"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Back to Website
                </Link>
              </div>

              <nav className="space-y-1.5 overflow-y-auto max-h-[60vh] pr-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isParentActive = pathname === item.href || (item.children?.some(c => pathname === c.href));
                  return (
                    <div key={item.label} className="space-y-1">
                      {item.children ? (
                        <>
                          <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isParentActive
                                ? 'bg-purple-600/15 text-purple-700 dark:text-purple-200 font-bold' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                            }`}
                          >
                            <span className="flex items-center">
                              <Icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </span>
                            {userMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {userMenuOpen && (
                            <div className="pl-6 space-y-1 border-l border-slate-200 dark:border-white/5 ml-6 pt-1 pb-2">
                              {item.children.map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                      isChildActive
                                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-200 border-l border-purple-500'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.01]'
                                    }`}
                                  >
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isParentActive 
                              ? 'bg-purple-600/15 border border-purple-500/30 text-purple-700 dark:text-purple-200' 
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                          }`}
                        >
                          <span className="flex items-center">
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] bg-slate-200 dark:bg-slate-950/60 border border-slate-300 dark:border-white/5 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
            
            <div className="border-t border-slate-200 dark:border-white/5 pt-4 flex flex-col space-y-4">
              {/* Theme toggle in mobile view */}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-3 w-full rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 p-2.5 transition-all cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-600 dark:text-purple-300">
                  {user.firstName[0]}
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">{user.firstName} {user.lastName}</span>
                  <span className="text-[9px] text-slate-500 block truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-450 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl py-2 transition-all cursor-pointer"
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
