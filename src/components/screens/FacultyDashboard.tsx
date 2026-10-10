import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  QrCode, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Download, 
  MapPin, 
  Sliders, 
  RefreshCw,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockSessions, mockStudents } from '../../data/mockData';

export const FacultyDashboard: React.FC = () => {
  const { currentFaculty, setActiveScreen, setSelectedAttemptId } = useAuth();
  const [activeSession, setActiveSession] = useState(mockSessions[0]);
  const [showSessionWizard, setShowSessionWizard] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(14);
  const [qrToken, setQrToken] = useState('VERITY-SESS-9938-X7K');
  const [filterState, setFilterState] = useState<'all' | 'present' | 'late' | 'review'>('all');
  const [studentSearch, setStudentSearch] = useState('');

  // Geofence Wizard state
  const [wizardSubject, setWizardSubject] = useState('CS401');
  const [wizardGeofence, setWizardGeofence] = useState(25);
  const [wizardLateThreshold, setWizardLateThreshold] = useState(10);

  // Dynamic QR Code Countdown simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          // Regenerate dynamic HMAC QR token
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          setQrToken(`VERITY-SESS-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Faculty Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Faculty Class Console
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              FACULTY PORTAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentFaculty.name} • {currentFaculty.department} ({currentFaculty.employeeId})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSessionWizard(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Start New Verification Session
          </button>
          <button
            onClick={() => alert('Exporting attendance ledger to CSV format...')}
            className="px-3.5 py-2 rounded-xl bg-[#121A2B] hover:bg-[#19243C] text-slate-200 border border-[#1E2D4A] text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export Report
          </button>
        </div>
      </div>

      {/* Main Grid: Live QR Generator & Real-Time Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Rotating QR Panel */}
        <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-6 space-y-4 shadow-xl flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
            <span className="font-mono text-cyan-400 font-bold">{activeSession.subjectCode}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE SESSION
            </span>
          </div>

          <h3 className="text-base font-semibold text-white">{activeSession.subjectName}</h3>
          <p className="text-xs text-slate-400">{activeSession.classroomName} • Geofence Radius: {activeSession.geofenceRadiusMeters}m</p>

          {/* Visual QR Frame */}
          <div className="relative p-4 bg-white rounded-2xl shadow-2xl space-y-2 scanline max-w-[220px]">
            {/* SVG QR Code Simulation */}
            <svg viewBox="0 0 100 100" className="w-44 h-44 mx-auto fill-slate-900">
              <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
              <rect x="35" y="5" width="10" height="20" />
              <rect x="50" y="15" width="15" height="10" />
              <rect x="35" y="35" width="30" height="30" />
              <rect x="75" y="45" width="20" height="15" />
              <rect x="45" y="75" width="20" height="20" />
              <rect x="75" y="75" width="15" height="15" />
            </svg>
            <div className="bg-[#0B1020] text-cyan-300 font-mono text-[10px] py-1 px-2 rounded border border-cyan-500/40 truncate">
              {qrToken}
            </div>
          </div>

          {/* Expiry Countdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Rotates in:</span>
            <span className="text-cyan-400 font-bold text-sm bg-[#0B1020] px-2 py-0.5 rounded border border-[#1E2D4A]">
              {qrCountdown}s
            </span>
          </div>
        </div>

        {/* Real-time Attendance Statistics Counter */}
        <div className="lg:col-span-2 bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2D4A]">
            <div>
              <h3 className="font-semibold text-white text-base">Real-Time Class Telemetry</h3>
              <p className="text-xs text-slate-400">Live student check-ins for current active session</p>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-[#0B1020] px-3 py-1.5 rounded border border-[#1E2D4A]">
              Session ID: {activeSession.id}
            </div>
          </div>

          {/* 4 Counter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#0B1020] border border-emerald-500/30 p-3 rounded-lg">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Present
              </span>
              <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">
                {activeSession.stats.presentCount}
              </span>
            </div>

            <div className="bg-[#0B1020] border border-amber-500/30 p-3 rounded-lg">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Late Arrival
              </span>
              <span className="text-2xl font-mono font-bold text-amber-400 mt-1 block">
                {activeSession.stats.lateCount}
              </span>
            </div>

            <div className="bg-[#0B1020] border border-purple-500/30 p-3 rounded-lg">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400" /> Pending Review
              </span>
              <span className="text-2xl font-mono font-bold text-purple-400 mt-1 block">
                {activeSession.stats.pendingReviewCount}
              </span>
            </div>

            <div className="bg-[#0B1020] border border-rose-500/30 p-3 rounded-lg">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejected
              </span>
              <span className="text-2xl font-mono font-bold text-rose-400 mt-1 block">
                {activeSession.stats.rejectedCount}
              </span>
            </div>
          </div>

          {/* Student Roster Table Filter */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterState('all')}
                  className={`px-2.5 py-1 rounded font-mono ${filterState === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'}`}
                >
                  All ({mockStudents.length})
                </button>
                <button
                  onClick={() => setFilterState('present')}
                  className={`px-2.5 py-1 rounded font-mono ${filterState === 'present' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400'}`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilterState('review')}
                  className={`px-2.5 py-1 rounded font-mono ${filterState === 'review' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400'}`}
                >
                  Needs Review
                </button>
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Filter student..."
                  className="w-full bg-[#0B1020] border border-[#1E2D4A] text-xs text-white pl-8 pr-2 py-1.5 rounded outline-none"
                />
              </div>
            </div>

            {/* Roster List */}
            <div className="space-y-2">
              {mockStudents.map((std) => (
                <div key={std.id} className="bg-[#0B1020] border border-[#1E2D4A] p-3 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={std.avatarUrl} alt={std.name} className="w-8 h-8 rounded-full border border-cyan-500/30 object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{std.name}</span>
                        <span className="font-mono text-cyan-400 text-[11px]">{std.rollNumber}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{std.registeredDevice}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    {std.id === 'std_3' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                        REVIEW NEEDED (42m)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        VERIFIED 10:04 AM
                      </span>
                    )}

                    {std.id === 'std_3' && (
                      <button
                        onClick={() => {
                          setSelectedAttemptId('VATT-2026-981');
                          setActiveScreen('investigation-center');
                        }}
                        className="text-amber-400 hover:underline text-[11px]"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Creation Wizard Modal */}
      {showSessionWizard && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" /> Configure & Launch Class Session
              </h3>
              <button onClick={() => setShowSessionWizard(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Subject & Course Code</label>
                <select
                  value={wizardSubject}
                  onChange={(e) => setWizardSubject(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded-lg text-white outline-none"
                >
                  <option value="CS401">CS401: Advanced AI & Biometric Security</option>
                  <option value="CS408">CS408: Distributed Systems & Cryptography</option>
                  <option value="CS412">CS412: Network Threat Intelligence</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Classroom Location</label>
                <input
                  type="text"
                  value="Cyber Security Research Lab 302 (Building A)"
                  disabled
                  className="w-full bg-[#0B1020]/50 border border-[#1E2D4A] p-2.5 rounded-lg text-slate-400"
                />
              </div>

              {/* Geofence Radius Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Geofence Boundary Radius</label>
                  <span className="font-mono text-cyan-400 font-bold">{wizardGeofence} meters</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={wizardGeofence}
                  onChange={(e) => setWizardGeofence(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">Students outside {wizardGeofence}m radius will trigger Review Needed.</p>
              </div>

              {/* Late Threshold Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Late Arrival Cutoff Threshold</label>
                  <span className="font-mono text-amber-400 font-bold">{wizardLateThreshold} minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={wizardLateThreshold}
                  onChange={(e) => setWizardLateThreshold(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#1E2D4A]">
              <button onClick={() => setShowSessionWizard(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs">Cancel</button>
              <button
                onClick={() => {
                  setShowSessionWizard(false);
                  alert(`Session launched for ${wizardSubject} with ${wizardGeofence}m geofence!`);
                }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-md"
              >
                Launch Active QR Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
