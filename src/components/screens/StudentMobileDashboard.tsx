import React, { useState } from 'react';
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
  BarChart3,
  QrCode,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { FaceRegistrationModal } from '../common/FaceRegistrationModal';
import { QRScannerModal } from '../common/QRScannerModal';

export const StudentMobileDashboard: React.FC = () => {
  const { currentStudent, setActiveScreen } = useAuth();
  const [student, setStudent] = useState(db.getStudentById(currentStudent.id) || currentStudent);
  
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeToken, setActiveToken] = useState('VERITY-SESS-9938-X7K');

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 pb-20 max-w-md mx-auto sm:max-w-xl sm:p-4">
      {/* Mobile Top App Bar */}
      <div className="bg-[#121A2B] border-b border-[#1E2D4A] p-4 sticky top-0 z-30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={student.avatarUrl}
            alt={student.name}
            className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">{student.name}</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] font-mono text-cyan-400">{student.rollNumber} • Sem {student.semester}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowFaceModal(true)}
            className="p-2 rounded-lg bg-[#0B1020] border border-[#1E2D4A] text-teal-400 hover:border-teal-400"
            title="Register Face"
          >
            <UserPlus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveScreen('student-history')}
            className="p-2 rounded-lg bg-[#0B1020] border border-[#1E2D4A] text-slate-300 hover:text-white"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-6">
        {/* Enrolment Guard Banner (if not enrolled) */}
        {!student.enrolledFaceTemplate && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-amber-300">
            <span>Face Profile Not Enrolled! Register face before check-in.</span>
            <button onClick={() => setShowFaceModal(true)} className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold font-mono text-[11px]">
              Enrol Now
            </button>
          </div>
        )}

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
                {student.overallAttendancePct}%
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
                  strokeDashoffset={201 - (201 * student.overallAttendancePct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <ShieldCheck className="w-6 h-6 text-cyan-400 absolute" />
            </div>
          </div>
        </div>

        {/* Action Buttons: Scan QR & Verify Attendance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="py-3.5 px-4 rounded-xl bg-[#121A2B] border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 font-mono"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            Scan Session QR Code
          </button>

          <button
            onClick={() => setActiveScreen('verification-experience')}
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            Verify Attendance Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Schedule & Classes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-semibold text-white">Today's Class Schedule</h3>
            <span className="text-slate-400 font-mono">Sat, Oct 10</span>
          </div>

          <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-4 rounded-xl space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold">CS401</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                ACTIVE NOW
              </span>
            </div>

            <h4 className="text-xs font-semibold text-white">Advanced AI & Biometric Security</h4>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" /> Lab 302 • Dr. Rajesh Kumar
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFaceModal && (
        <FaceRegistrationModal
          student={student}
          onClose={() => setShowFaceModal(false)}
          onSuccess={(updated) => setStudent(updated)}
        />
      )}

      {showQrModal && (
        <QRScannerModal
          onClose={() => setShowQrModal(false)}
          onSessionSelected={(sess, token) => {
            setActiveToken(token);
            setActiveScreen('verification-experience');
          }}
        />
      )}

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
