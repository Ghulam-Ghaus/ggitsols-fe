'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Shield, 
  Save, 
  Info, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  Lock,
  FileKey,
  ShieldCheck,
  Eye,
  PlusSquare,
  Edit,
  Trash2
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }>;
}

const MODULE_LABELS: Record<string, string> = {
  users: 'User Management (RBAC)',
  admissions: 'Student Admissions',
  courses: 'Courses & Batches',
  attendance: 'Attendance Registers',
  finance: 'Finance & Ledger',
  exams: 'Exams & Results',
  settings: 'System Configuration'
};

const ACTION_COLS = [
  { key: 'view', label: 'View / Read', icon: Eye, color: 'text-blue-400' },
  { key: 'create', label: 'Create / Add', icon: PlusSquare, color: 'text-emerald-400' },
  { key: 'update', label: 'Update / Edit', icon: Edit, color: 'text-purple-400' },
  { key: 'delete', label: 'Delete / Remove', icon: Trash2, color: 'text-rose-400' }
];

export default function RolePermissionsManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoleId, setActiveRoleId] = useState<number>(2); // Default to TEACHER
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form states
  const [rolePermissions, setRolePermissions] = useState<Role['permissions']>({});
  const [roleDescription, setRoleDescription] = useState('');
  
  // Status Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/roles');
      const fetchedRoles = res.data.data;
      setRoles(fetchedRoles);
      
      // Set the active role details
      const activeRole = fetchedRoles.find((r: Role) => r.id === activeRoleId) || fetchedRoles[0];
      if (activeRole) {
        setSelectedRole(activeRole);
        setActiveRoleId(activeRole.id);
        setRolePermissions(activeRole.permissions || {});
        setRoleDescription(activeRole.description || '');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to fetch roles mapping');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Alert Auto-Dismiss
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Handle switching roles
  const handleSelectRole = (role: Role) => {
    setActiveRoleId(role.id);
    setSelectedRole(role);
    setRolePermissions(role.permissions || {});
    setRoleDescription(role.description || '');
  };

  // Toggle permission value for a module/action
  const handleTogglePermission = (moduleKey: string, actionKey: 'view' | 'create' | 'update' | 'delete') => {
    if (activeRoleId === 1) {
      // Alert/block editing Admin permissions to prevent lockouts
      setErrorMsg('Self-modifying Super Admin permissions is locked to prevent accidental system access lockout.');
      return;
    }

    setRolePermissions(prev => {
      const modulePermissions = prev[moduleKey] || { view: false, create: false, update: false, delete: false };
      return {
        ...prev,
        [moduleKey]: {
          ...modulePermissions,
          [actionKey]: !modulePermissions[actionKey]
        }
      };
    });
  };

  // Save changes
  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setSaveLoading(true);
    setErrorMsg(null);

    try {
      await api.patch(`/users/roles/${selectedRole.id}`, {
        permissions: rolePermissions,
        description: roleDescription
      });
      setSuccessMsg(`Permissions updated for role ${selectedRole.name}!`);
      fetchRoles();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save role permissions');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading && roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm">Fetching role matrix configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
          <Shield className="w-8 h-8 text-purple-400 mr-3 animate-pulse" />
          Roles & Access Control (RBAC)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Super Admin permissions board. Assign granular read/write/edit/delete access rights across modules.
        </p>
      </div>

      {/* Floating Success/Error Alerts */}
      {(successMsg || errorMsg) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          {successMsg && (
            <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/35 rounded-xl p-4 text-emerald-200 text-sm shadow-2xl flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-950/90 backdrop-blur-md border border-red-500/35 rounded-xl p-4 text-red-200 text-sm shadow-2xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Roles Selector & Matrix layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Roles list */}
        <section className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/10 border border-white/5 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">System Roles</h3>
            <div className="space-y-1.5">
              {roles.map((r) => {
                const isActive = r.id === activeRoleId;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={`w-full flex flex-col items-start px-4 py-3 rounded-xl text-left transition-all ${
                      isActive 
                        ? 'bg-purple-600/15 border border-purple-500/30 text-purple-200 shadow-md' 
                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    <span className="text-xs font-extrabold flex items-center">
                      <ShieldCheck className={`w-3.5 h-3.5 mr-2 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                      {r.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 truncate max-w-full">
                      {r.description || 'No description set'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Permission Matrix Grid */}
        {selectedRole && (
          <section className="lg:col-span-9 space-y-6">
            <form onSubmit={handleSavePermissions} className="space-y-6">
              
              {/* Role Info Box */}
              <div className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center">
                      Permissions for role: <span className="text-purple-400 ml-2 font-black tracking-wide">{selectedRole.name}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                      {selectedRole.name === 'ADMIN' ? 'System Super Admin Control Profile' : 'System Staff & User Profile'}
                    </p>
                  </div>
                  {selectedRole.name === 'ADMIN' && (
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                      <Lock className="w-3.5 h-3.5 mr-2" />
                      Locked Profile
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Role Description</label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    disabled={selectedRole.name === 'ADMIN'}
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-3 px-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter short description of what users under this role do..."
                  />
                </div>
              </div>

              {/* Matrix Table */}
              <div className="bg-slate-900/20 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 w-1/3">Module / Resource</th>
                        {ACTION_COLS.map(col => {
                          const Icon = col.icon;
                          return (
                            <th key={col.key} className="py-4 px-4 text-center">
                              <span className="inline-flex items-center justify-center">
                                <Icon className={`w-3.5 h-3.5 mr-1.5 ${col.color}`} />
                                {col.label}
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {Object.keys(MODULE_LABELS).map((moduleKey) => {
                        const modulePerms = rolePermissions[moduleKey] || { view: false, create: false, update: false, delete: false };
                        return (
                          <tr key={moduleKey} className="hover:bg-white/[0.01] transition-colors">
                            
                            {/* Module Name */}
                            <td className="py-4 px-6 font-semibold text-slate-200">
                              {MODULE_LABELS[moduleKey]}
                              <span className="block text-[10px] text-slate-500 font-normal">Key: {moduleKey}</span>
                            </td>

                            {/* Checkbox columns */}
                            {ACTION_COLS.map(col => {
                              const isChecked = !!modulePerms[col.key as 'view' | 'create' | 'update' | 'delete'];
                              return (
                                <td key={col.key} className="py-4 px-4 text-center">
                                  <div className="flex justify-center">
                                    <button
                                      type="button"
                                      disabled={selectedRole.name === 'ADMIN'}
                                      onClick={() => handleTogglePermission(moduleKey, col.key as 'view' | 'create' | 'update' | 'delete')}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                        selectedRole.name === 'ADMIN' ? 'cursor-not-allowed opacity-60' : ''
                                      } ${
                                        isChecked 
                                          ? 'bg-purple-600 border-purple-500 text-white shadow-sm' 
                                          : 'border-white/10 hover:border-purple-500/50 bg-slate-950/80 text-transparent'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                  </div>
                                </td>
                              );
                            })}

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warning details */}
              {selectedRole.name !== 'ADMIN' && (
                <div className="bg-slate-900/10 border border-white/5 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-400">
                  <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    Users assigned to the <strong className="text-slate-200">{selectedRole.name}</strong> role will immediately have their access limits updated in real-time. Make sure to double check that you do not accidentally grant elevated write or delete access to student or guest groups.
                  </span>
                </div>
              )}

              {/* Save Controls */}
              {selectedRole.name !== 'ADMIN' && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-purple-500/10 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    {saveLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Permissions
                  </button>
                </div>
              )}

            </form>
          </section>
        )}

      </div>

    </div>
  );
}
