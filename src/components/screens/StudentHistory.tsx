import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Send, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockSubjects } from '../../data/mockData';

export const StudentHistory: React.FC = () => {
  const { currentStudent } = useAuth();
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason) return;
    setAppealSubmitted(true);
    setTimeout(() => {
      setShowAppealForm(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal Attendance History & Appeals
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              STUDENT RECORD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.rollNumber})
          </p>
        </div>

        <button
          onClick={() => setShowAppealForm(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" /> Submit Correction Appeal
        </button>
      </div>

      {/* Subject-Wise Percentage Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockSubjects.map((subj, idx) => (
          <div key={subj.id} className="bg-[#121A2B] border border-[#1E2D4A] p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold">{subj.code}</span>
              <span className="text-emerald-400 font-mono font-bold">{idx === 1 ? '92.5%' : '96.8%'}</span>
            </div>
            <h4 className="text-xs font-semibold text-white">{subj.name}</h4>
            <p className="text-[11px] text-slate-400">Faculty: {subj.facultyName}</p>
          </div>
        ))}
      </div>

      {/* Attendance Calendar & Logs */}
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-cyan-400" /> Attendance Check-In History
        </h3>

        <div className="space-y-3 text-xs">
          <div className="bg-[#0B1020] border border-[#1E2D4A] p-3.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-white font-medium">CS401: Advanced AI & Biometric Security</p>
                <p className="text-[11px] text-slate-400 font-mono">Sat, Oct 10 • 10:04 AM • Lab 302</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
              VERIFIED
            </span>
          </div>

          <div className="bg-[#0B1020] border border-amber-500/30 p-3.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-white font-medium">CS408: Distributed Systems & Cryptography</p>
                <p className="text-[11px] text-slate-400 font-mono">Thu, Oct 08 • 02:12 PM (Late 12 mins)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
              LATE ARRIVAL
            </span>
          </div>

          <div className="bg-[#0B1020] border border-[#1E2D4A] p-3.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-white font-medium">CS412: Network Threat Intelligence</p>
                <p className="text-[11px] text-slate-400 font-mono">Tue, Oct 06 • 11:30 AM • Auditorium 401</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Appeal Modal */}
      {showAppealForm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Submit Attendance Correction Appeal</h3>
            <p className="text-xs text-slate-400">If you encountered a sensor or GPS drift anomaly, submit an appeal for faculty review.</p>

            {appealSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-lg flex items-center gap-2 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Appeal submitted! Faculty notified.
              </div>
            ) : (
              <form onSubmit={handleAppealSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Select Session</label>
                  <select className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded text-white outline-none">
                    <option>CS408: Oct 08 - Late Arrival Appeal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder="Describe reason..."
                    className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded text-white outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAppealForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-cyan-500 text-black font-bold rounded">Submit Appeal</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
