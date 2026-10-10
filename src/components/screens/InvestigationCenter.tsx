import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  MapPin, 
  Clock, 
  Lock, 
  Activity,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockVerificationAttempts, mockAuditLogs } from '../../data/mockData';
import { ConfidenceTimeline } from '../common/ConfidenceTimeline';

export const InvestigationCenter: React.FC = () => {
  const { selectedAttemptId, setSelectedAttemptId, currentFaculty } = useAuth();
  const [selectedAttempt, setSelectedAttempt] = useState(
    mockVerificationAttempts.find(a => a.id === selectedAttemptId) || mockVerificationAttempts[0]
  );
  const [facultyReason, setFacultyReason] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const handleOverride = (action: 'approved' | 'rejected') => {
    if (!facultyReason || facultyReason.length < 5) {
      alert('Mandatory faculty override reason required (minimum 5 characters).');
      return;
    }

    setActionSuccessMessage(`Attempt ${selectedAttempt.id} has been manually ${action.toUpperCase()} by ${currentFaculty.name}. Audit log entry logged.`);
    
    // Update local attempt status
    setSelectedAttempt(prev => ({
      ...prev,
      overallStatus: action === 'approved' ? 'verified' : 'rejected',
      facultyReview: {
        reviewedBy: currentFaculty.name,
        reviewedAt: new Date().toLocaleTimeString(),
        action,
        mandatoryReason: facultyReason
      }
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verification Investigation Center
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SECURITY OPERATIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Forensic analysis, explainable risk breakdown, and faculty override audit controls
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Active Investigation ID:</span>
          <span className="text-cyan-400 font-bold bg-[#121A2B] px-3 py-1 rounded border border-[#1E2D4A]">
            {selectedAttempt.id}
          </span>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-4 rounded-xl flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Grid: Attempt Details + Confidence Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attempt Metadata & Faculty Override Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Attempt Summary Card */}
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white text-base">Attempt Case Overview</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedAttempt.overallStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                selectedAttempt.overallStatus === 'pending_review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {selectedAttempt.overallStatus.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1E2D4A]/50">
                <span className="text-slate-400">Student Name:</span>
                <span className="text-white font-semibold">{selectedAttempt.studentName} ({selectedAttempt.studentRoll})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E2D4A]/50">
                <span className="text-slate-400">Course & Session:</span>
                <span className="text-cyan-400 font-mono">{selectedAttempt.sessionTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E2D4A]/50">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300 font-mono">{selectedAttempt.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E2D4A]/50">
                <span className="text-slate-400">Device Fingerprint:</span>
                <span className="text-slate-300 font-mono">{selectedAttempt.deviceInfo.deviceId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">IP Address:</span>
                <span className="text-slate-300 font-mono">{selectedAttempt.deviceInfo.ipAddress}</span>
              </div>
            </div>
          </div>

          {/* Faculty Override Controls */}
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" /> Faculty Adjudication Control
            </h3>
            <p className="text-xs text-slate-400">
              Review flagged evidence and issue an official attendance decision. All actions are logged into immutable audit history.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mandatory Reason for Override <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={facultyReason}
                onChange={(e) => setFacultyReason(e.target.value)}
                placeholder="e.g. Student present in adjacent Lab 301 due to seating overflow. Identity and liveness verified."
                className="w-full bg-[#0B1020] border border-[#1E2D4A] focus:border-cyan-400 p-2.5 rounded-lg text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleOverride('approved')}
                className="py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Attendance
              </button>
              <button
                onClick={() => handleOverride('rejected')}
                className="py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Layer-by-Layer Confidence Timeline & Audit Trail */}
        <div className="lg:col-span-7 space-y-6">
          <ConfidenceTimeline
            stages={selectedAttempt.stages}
            overallStatus={selectedAttempt.overallStatus}
            riskScore={selectedAttempt.riskScore}
            explainableRiskFactors={selectedAttempt.explainableRiskFactors}
          />

          {/* Audit History Log */}
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" /> SYSTEM AUDIT LOG TRAIL
            </h4>
            <div className="space-y-2 text-xs">
              {mockAuditLogs.map((log) => (
                <div key={log.id} className="bg-[#0B1020] p-2.5 rounded border border-[#1E2D4A] font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>{log.actor} ({log.role})</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-200 mt-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
