'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ChevronDown, 
  Mail, 
  Phone, 
  Calendar,
  X,
  AlertTriangle,
  Loader2,
  Check,
  UserX,
  UserCheck
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  roleId: number;
  role: Role;
  createdAt: string;
}

const ROLES = [
  { id: 2, name: 'TEACHER', description: 'Academic Teacher' },
  { id: 3, name: 'STUDENT', description: 'Enrolled Student' },
  { id: 4, name: 'PARENT', description: 'Student Parent/Guardian' },
  { id: 5, name: 'APPLICANT', description: 'Admission Applicant' },
  { id: 6, name: 'PUBLIC', description: 'Public Guest' }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState(3); // Default to STUDENT
  const [isActive, setIsActive] = useState(true);

  // Status Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to fetch users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Alert auto-clear
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Open creation modal
  const openCreateModal = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRoleId(3);
    setIsActive(true);
    setCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPassword(''); // Leave blank by default
    setPhone(user.phone || '');
    setRoleId(user.roleId);
    setIsActive(user.isActive);
    setEditModalOpen(true);
  };

  // Open delete confirmation
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle user creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg(null);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
      roleId
    };

    try {
      await api.post('/users', payload);
      setSuccessMsg('User profile created successfully!');
      setCreateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create user profile');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle user updates
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitLoading(true);
    setErrorMsg(null);

    const payload: any = {
      firstName,
      lastName,
      email,
      phone: phone || null,
      roleId,
      isActive
    };

    if (password) {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long');
        setSubmitLoading(false);
        return;
      }
      payload.password = password;
    }

    try {
      await api.patch(`/users/${selectedUser.id}`, payload);
      setSuccessMsg('User details updated successfully!');
      setEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update user profile');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle quick activation switch directly in table
  const handleToggleActive = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      setSuccessMsg(`User status updated to ${!user.isActive ? 'Active' : 'Inactive'}`);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setSubmitLoading(true);
    setErrorMsg(null);

    try {
      await api.delete(`/users/${selectedUser.id}`);
      setSuccessMsg('User profile deleted permanently.');
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to delete user profile');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filtering users logic
  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.phone && u.phone.includes(search));
    const roleMatch = !roleFilter || u.role?.name === roleFilter;
    const statusMatch = !statusFilter || (statusFilter === 'active' ? u.isActive : !u.isActive);
    return searchMatch && roleMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Users className="w-8 h-8 text-purple-400 mr-3" />
            User Management & RBAC
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            System control panel to audit, create, update credentials, and restrict portal roles.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/10 cursor-pointer hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </button>
      </div>

      {/* Floating Success/Error Alert */}
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
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-900/10 border border-white/5 rounded-2xl p-4">
        
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Role Filter */}
        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none transition-all cursor-pointer"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

      </div>

      {/* Users Table Card */}
      <div className="bg-slate-900/10 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
              <p className="text-sm">Fetching user records...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-medium">No user records match current filters</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Name / Details</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">System Role</th>
                  <th className="py-4 px-4">Portal Status</th>
                  <th className="py-4 px-4">Registered Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Name & ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/25 flex items-center justify-center font-bold text-purple-300 text-xs shrink-0 shadow-sm">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">
                            {u.firstName} {u.lastName}
                          </span>
                          <span className="text-[10px] text-slate-500 block">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Contact details */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-slate-400 truncate">
                          <Mail className="w-3.5 h-3.5 text-blue-500/60 mr-1.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-purple-500/60 mr-1.5 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300 uppercase tracking-wide">
                        {u.role?.name || 'STUDENT'}
                      </span>
                    </td>

                    {/* Status switch toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer ${
                          u.isActive 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                        }`}
                        title={u.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {u.isActive ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 text-rose-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Created at */}
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 text-slate-600 mr-1.5 shrink-0" />
                        <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {u.role?.name === 'STUDENT' && (
                          <Link
                            href={`/admin/students/${u.id}`}
                            className="p-1.5 bg-slate-950/80 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-300 rounded-lg transition-all cursor-pointer"
                            title="View Academic Record & Performance"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 bg-slate-950/80 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 text-slate-400 hover:text-purple-300 rounded-lg transition-all cursor-pointer"
                          title="Edit User Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          disabled={u.id === '1' || u.email === 'admin@ggitsols.com'} // Protect primary admin seeding
                          className="p-1.5 bg-slate-950/80 hover:bg-rose-600/20 border border-white/5 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <UserPlus className="w-5 h-5 text-purple-400 mr-2.5" />
                Register New User Profile
              </h3>
              <button 
                onClick={() => setCreateModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                    placeholder="Ghulam"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                    placeholder="Ghaus"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                    placeholder="user@ggitsols.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                    placeholder="+92 306..."
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  placeholder="•••••••• (Min 6 chars)"
                  minLength={6}
                />
              </div>

              {/* Role select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">System Role</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none transition-all cursor-pointer"
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name} — {role.description}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-white/5 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/10 transition-all cursor-pointer"
                >
                  {submitLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                  Register User
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Edit2 className="w-5 h-5 text-purple-400 mr-2.5" />
                Modify User Profile Details
              </h3>
              <button 
                onClick={() => setEditModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-5">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                    placeholder="No phone provided"
                  />
                </div>
              </div>

              {/* Password update (Optional) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Change Password <span className="text-[9px] text-slate-500 font-normal lowercase">(Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs outline-none transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {/* Role select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">System Role</label>
                <select
                  value={roleId}
                  disabled={selectedUser.id === '1' || selectedUser.email === 'admin@ggitsols.com'} // Prevent self-demoting main admin
                  className="w-full bg-slate-950 border border-white/5 focus:border-purple-500/60 rounded-xl py-2.5 px-3 text-xs text-slate-300 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  onChange={(e) => setRoleId(Number(e.target.value))}
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name} — {role.description}</option>
                  ))}
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-3 bg-slate-950/40 p-4 border border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  disabled={selectedUser.id === '1' || selectedUser.email === 'admin@ggitsols.com'} // Prevent deactivating main admin
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  {isActive ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                </button>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {isActive ? 'Account Active' : 'Account Suspended'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isActive 
                      ? 'User has full access permissions corresponding to their system role.' 
                      : 'User cannot login or authenticate into any system services.'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-white/5 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/10 transition-all cursor-pointer"
                >
                  {submitLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start space-x-3.5 mb-5 p-2">
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 shrink-0 shadow-md shadow-rose-500/5">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Delete User Profile Permanently</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Are you absolutely sure you want to delete <span className="font-semibold text-slate-200">{selectedUser.firstName} {selectedUser.lastName}</span>? This action is irreversible and deletes their profile, credentials, and relationship binds.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 bg-slate-950/40 p-4 -mx-6 -mb-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-white/5 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={submitLoading}
                className="flex items-center px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                {submitLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
