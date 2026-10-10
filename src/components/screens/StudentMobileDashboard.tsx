import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  MapPin, 
  ArrowRight, 
  Calendar,
  Sparkles,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStudents, mockSubjects } from '../../data/mockData';

export const StudentMobileDashboard: React.FC = () => {
  const { currentStudent, setActiveScreen } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 pb-20 max-w-md mx-auto sm:max-w-xl sm:p-4">
      {/* Mobile Top App Bar */}
      <div className="bg-[#121A2B] border-b border-[#1E2D4A] p-4 sticky top-0 z-30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={currentStudent.avatarUrl}
            alt={currentStudent.name}
            className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">{currentStudent.name}</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] font-mono text-cyan-400">{currentStudent.rollNumber} • Sem {currentStudent.semester}</p>
          </div>
        </div>

        <button 
          onClick={() => setActiveScreen('student-history')}
          className="p-2 rounded-lg bg-[#0B1020] border border-[#1E2D4A] text-slate-300 hover:text-white"
        >
          <Calendar className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-6">
        {/* Overall Attendance Radial Score Card */}
        <div className="bg-gradient-to-br from-[#121A2B] via-[#162238] to-[#0D1629] border border-[#1E2D4A] rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              OVERALL ATTENDANCE RATE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              GOOD STANDING
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {currentStudent.overallAttendancePct}%
              </div>
              <p className="text-xs text-slate-400 mt-1">34 of 36 required sessions completed</p>
            </div>

            {/* Circular Gauge visual */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#1E2D4A" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#14B8A6"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * currentStudent.overallAttendancePct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <ShieldCheck className="w-6 h-6 text-cyan-400 absolute" />
            </div>
          </div>
        </div>

        {/* Big Prominent "VERIFY ATTENDANCE" CTA Button */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveScreen('verification-experience')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            Verify Attendance Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[11px] text-center text-slate-400 font-mono">
            Active class session: <strong className="text-cyan-400">CS401 in Lab 302</strong>
          </p>
        </div>

        {/* Today's Schedule & Classes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-semibold text-white">Today's Class Schedule</h3>
            <span className="text-slate-400 font-mono">Sat, Oct 10</span>
          </div>

          {mockSubjects.map((subj, idx) => (
            <div
              key={subj.id}
              className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-4 rounded-xl space-y-2 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">{subj.code}</span>
                {idx === 0 ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    ACTIVE NOW
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono text-[11px]">2:00 PM</span>
                )}
              </div>

              <h4 className="text-xs font-semibold text-white">{subj.name}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" /> Lab 302 • {subj.facultyName}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Attendance Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white">Recent Check-In Activity</h3>
          <div className="space-y-2 text-xs">
            <div className="bg-[#121A2B] border border-[#1E2D4A] p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-white font-medium">CS401: Advanced AI Security</p>
                  <p className="text-[10px] text-slate-400 font-mono">Oct 08 • 10:04 AM</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
            </div>

            <div className="bg-[#121A2B] border border-amber-500/30 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-white font-medium">CS408: Distributed Systems</p>
                  <p className="text-[10px] text-slate-400 font-mono">Oct 06 • 02:12 PM (Late 12m)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-amber-400">LATE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#121A2B]/95 backdrop-blur-md border-t border-[#1E2D4A] p-2 flex items-center justify-around z-40 max-w-md mx-auto sm:max-w-xl">
        <button
          onClick={() => setActiveScreen('student-dashboard')}
          className="flex flex-col items-center gap-1 text-cyan-400 text-[10px] font-mono"
        >
          <User className="w-4 h-4" /> Home
        </button>
        <button
          onClick={() => setActiveScreen('verification-experience')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white text-[10px] font-mono"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Verify
        </button>
        <button
          onClick={() => setActiveScreen('student-history')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white text-[10px] font-mono"
        >
          <BarChart3 className="w-4 h-4" /> History
        </button>
      </nav>
    </div>
  );
};
