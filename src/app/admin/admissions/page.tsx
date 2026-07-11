'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  ExternalLink,
  Loader2,
  Calendar,
  User,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  GitPullRequest
} from 'lucide-react';

interface ApplicationDoc {
  id: string;
  documentName: string;
  fileUrl: string;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardian2Name?: string;
  guardian2Relation?: string;
  guardian2Phone?: string;
  guardian2Email?: string;
  hasSibling?: boolean;
  siblingName?: string;
  siblingRegistrationNo?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  course?: {
    id: string;
    name: string;
  };
  documents?: ApplicationDoc[];
}

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Concurrency guard to prevent StrictMode double fetches in dev
  const isFetching = useRef(false);

  const fetchApplications = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    
    try {
      setLoading(true);
      const res = await api.get('/admissions/applications');
      const list = res.data?.data || res.data || [];
      setApplications(list);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admissions applications.');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await api.patch(`/admissions/applications/${id}/status`, { status });
      setSuccessMsg(
        status === 'APPROVED' 
          ? 'Application successfully approved! User profile and Student registration have been provisioned.' 
          : 'Application has been rejected.'
      );
      
      // Auto dismiss success banner
      setTimeout(() => setSuccessMsg(null), 6000);

      // Refresh applications list
      await fetchApplications();
      setSelectedApp(null);
    } catch (err: any) {
      setError(err.message || 'Failed to process application status change.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Course Admissions</h1>
          <p className="text-slate-400 text-xs mt-1">Review student admissions documents, qualifications, and approve user access.</p>
        </div>
        <button
          onClick={fetchApplications}
          className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-xl px-4 py-2.5 bg-white/5 transition-all cursor-pointer"
        >
          Refresh List
        </button>
      </div>

      {/* Message Banners */}
      {successMsg && (
        <div className="flex items-start space-x-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-250">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-950/40 border border-red-500/30 text-red-200 text-sm rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Applications List Table */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-slate-500 text-xs">Loading course applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-slate-300 font-semibold text-sm">No applications found</h3>
              <p className="text-slate-500 text-xs">Pending student applications will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/20">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                  {applications.map((app) => (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className={`hover:bg-slate-900/40 transition-colors cursor-pointer ${
                        selectedApp?.id === app.id ? 'bg-slate-900/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{app.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{app.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-200">
                          {app.course?.name || 'No course selected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {app.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                disabled={processingId !== null}
                                className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 transition-all cursor-pointer"
                                title="Approve Student Application"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                disabled={processingId !== null}
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                                title="Reject Student Application"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-600 font-semibold uppercase">Processed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Details Right Column */}
        <div className="lg:col-span-4">
          {selectedApp ? (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200 max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white">Application Details</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Reference ID: #{selectedApp.id}</p>
              </div>

              {/* General details */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <User className="w-4.5 h-4.5 text-slate-500 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Applicant Name</span>
                    <span className="text-slate-200 font-semibold text-sm">{selectedApp.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4.5 h-4.5 text-slate-500 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Email Address</span>
                    <span className="text-slate-200 font-semibold">{selectedApp.email}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4.5 h-4.5 text-slate-500 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Phone Number</span>
                    <span className="text-slate-200 font-semibold">{selectedApp.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-4.5 h-4.5 text-slate-500 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Desired Course</span>
                    <span className="text-purple-400 font-semibold">{selectedApp.course?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              {selectedApp.guardianName && (
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <UserCheck className="w-4 h-4 text-purple-400 mr-2" />
                    Primary Guardian
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p><span className="text-slate-500">Name:</span> <span className="text-slate-200 font-medium">{selectedApp.guardianName} ({selectedApp.guardianRelation || 'Guardian'})</span></p>
                    <p><span className="text-slate-500">Phone:</span> <span className="text-slate-200 font-medium">{selectedApp.guardianPhone || 'N/A'}</span></p>
                    <p><span className="text-slate-500">Email:</span> <span className="text-slate-200 font-medium">{selectedApp.guardianEmail || 'N/A'}</span></p>
                  </div>
                </div>
              )}

              {/* Secondary Guardian Info */}
              {selectedApp.guardian2Name && (
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <UserCheck className="w-4 h-4 text-purple-400 mr-2" />
                    Secondary Guardian
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p><span className="text-slate-500">Name:</span> <span className="text-slate-200 font-medium">{selectedApp.guardian2Name} ({selectedApp.guardian2Relation || 'Guardian'})</span></p>
                    <p><span className="text-slate-500">Phone:</span> <span className="text-slate-200 font-medium">{selectedApp.guardian2Phone || 'N/A'}</span></p>
                    <p><span className="text-slate-500">Email:</span> <span className="text-slate-200 font-medium">{selectedApp.guardian2Email || 'N/A'}</span></p>
                  </div>
                </div>
              )}

              {/* Sibling Info */}
              {selectedApp.hasSibling && (
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <GitPullRequest className="w-4 h-4 text-purple-400 mr-2" />
                    Sibling Enrolled
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p><span className="text-slate-500">Name:</span> <span className="text-slate-200 font-medium">{selectedApp.siblingName || 'N/A'}</span></p>
                    <p><span className="text-slate-500">Reg No:</span> <span className="text-slate-200 font-medium">{selectedApp.siblingRegistrationNo || 'N/A'}</span></p>
                  </div>
                </div>
              )}

              {/* Documents detail */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <FileText className="w-4 h-4 text-purple-400 mr-2" />
                  Attached Documents
                </h4>

                {!selectedApp.documents || selectedApp.documents.length === 0 ? (
                  <p className="text-xs text-slate-600">No documents attached to this application.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 rounded-xl text-xs text-slate-300 hover:text-white transition-all group"
                      >
                        <span className="truncate pr-4 font-medium">{doc.documentName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Status processing */}
              {selectedApp.status === 'PENDING' && (
                <div className="flex gap-3 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')}
                    disabled={processingId !== null}
                    className="flex-1 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-semibold rounded-xl py-3 shadow-md transition-all cursor-pointer"
                  >
                    {processingId === selectedApp.id ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                    disabled={processingId !== null}
                    className="flex-1 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:bg-slate-900 text-rose-400 text-xs font-semibold rounded-xl py-3 transition-all cursor-pointer"
                  >
                    {processingId === selectedApp.id ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-white/5 border-dashed rounded-3xl p-8 text-center text-slate-500 text-xs">
              Select an applicant from the table to view details, verify documents, and process credentials.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
