import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TrustPulse } from '../common/TrustPulse';
import { mockRiskEvents, mockSessions } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { setActiveScreen, setSelectedAttemptId } = useAuth();
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Security Ops
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global attendance telemetry, anti-fraud risk queue, and node management
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#0B1020] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Enrol Student
          </button>
          <button
            onClick={() => setActiveScreen('investigation-center')}
            className="px-3.5 py-2 rounded-lg bg-[#121A2B] hover:bg-[#19243C] text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" /> Review Flagged ({mockRiskEvents.length})
          </button>
        </div>
      </div>

      {/* Signature Feature: Trust Pulse Bar */}
      <TrustPulse />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121A2B] border border-[#1E2D4A] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">1,842</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12 new this semester
          </div>
        </div>

        <div className="bg-[#121A2B] border border-[#1E2D4A] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Faculty</span>
            <GraduationCap className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">84</div>
          <div className="text-[11px] text-slate-400 font-mono">14 departments online</div>
        </div>

        <div className="bg-[#121A2B] border border-[#1E2D4A] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Live Sessions</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">18</div>
          <div className="text-[11px] text-cyan-400 font-mono">Dynamic QR active</div>
        </div>

        <div className="bg-[#121A2B] border border-[#1E2D4A] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Institutional Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">94.8%</div>
          <div className="text-[11px] text-emerald-400 font-mono">+1.2% benchmark</div>
        </div>
      </div>

      {/* Main Dashboard Section: Risk Queue + Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Events Needing Review */}
        <div className="lg:col-span-2 bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white text-base">Unresolved Risk Events Queue</h3>
            </div>
            <button
              onClick={() => setActiveScreen('investigation-center')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              Open Security Center <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockRiskEvents.map((risk) => (
              <div
                key={risk.id}
                className="bg-[#0B1020] border border-[#1E2D4A] hover:border-amber-500/40 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-cyan-400 font-semibold">{risk.studentRoll}</span>
                    <span className="text-white font-medium">{risk.studentName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      RISK SCORE: {risk.riskScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{risk.primaryFlag}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{risk.subjectName} • {risk.timestamp}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedAttemptId(risk.attemptId);
                    setActiveScreen('investigation-center');
                  }}
                  className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono font-medium self-start sm:self-center transition-all"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Sessions List */}
        <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white text-base">Active Class Sessions</h3>
            </div>
          </div>

          <div className="space-y-3">
            {mockSessions.map((sess) => (
              <div key={sess.id} className="bg-[#0B1020] border border-[#1E2D4A] p-3.5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">{sess.subjectCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{sess.subjectName}</h4>
                <p className="text-[11px] text-slate-400">{sess.classroomName} • {sess.facultyName}</p>
                
                {/* Stats Mini Bar */}
                <div className="pt-2 border-t border-[#1E2D4A]/50 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Present: <strong className="text-emerald-400">{sess.stats.presentCount}</strong>/{sess.stats.totalEnrolled}</span>
                  <span>Review: <strong className="text-amber-400">{sess.stats.pendingReviewCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Enrol Student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Enrol New Student Biometrics</h3>
            <p className="text-xs text-slate-400">Generate activation key for student facial vector registration</p>
            <div className="space-y-3 text-xs">
              <input type="text" placeholder="Full Student Name" className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded text-white" />
              <input type="text" placeholder="Roll Number (e.g. 2026-CS-201)" className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded text-white" />
              <input type="email" placeholder="Institutional Email" className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded text-white" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 rounded bg-cyan-500 text-black font-bold text-xs">Generate Enrolment Key</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
