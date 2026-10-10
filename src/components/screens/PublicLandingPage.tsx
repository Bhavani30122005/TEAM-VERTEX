import React from 'react';
import { 
  ShieldCheck, 
  Scan, 
  MapPin, 
  Clock, 
  Key, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Database, 
  Cpu, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TrustPulse } from '../common/TrustPulse';

export const PublicLandingPage: React.FC = () => {
  const { setActiveScreen, setRole } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#1E2D4A]/50">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A2B] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hackathon 2026 Innovation Flagship</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Presence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Proven.</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Trust every check-in. Verify every layer. Next-generation smart multi-layer attendance verification platform built for high-security academic environments.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveScreen('verification-experience')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Try Live Verification Check <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setRole('faculty'); setActiveScreen('faculty-dashboard'); }}
              className="px-6 py-3.5 rounded-xl bg-[#121A2B] hover:bg-[#19243C] text-slate-200 border border-[#1E2D4A] hover:border-cyan-500/50 font-semibold text-sm transition-all flex items-center gap-2"
            >
              Faculty Portal Demo
            </button>
          </div>

          {/* Trust Pulse Telemetry Summary */}
          <div className="mt-14 max-w-5xl mx-auto text-left">
            <TrustPulse />
          </div>
        </div>
      </section>

      {/* Product Dashboard Interactive Preview */}
      <section className="py-16 bg-[#0B1020] border-b border-[#1E2D4A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">
              6-LAYER ZERO-TRUST VERIFICATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              Multi-Layer Defense Architecture
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining 3D liveness detection, cryptographically signed dynamic QR challenges, precision GPS geofencing, and temporal anti-replay logic.
            </p>
          </div>

          {/* 6 Verification Layers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-cyan-400">LAYER 01</div>
              <h3 className="text-lg font-semibold text-white">Account & Biometric Enrolment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifies registered student ID against 128-dimensional facial vector embeddings stored securely in institutional enclave.
              </p>
            </div>

            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Key className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-teal-400">LAYER 02</div>
              <h3 className="text-lg font-semibold text-white">Dynamic Session QR Challenge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Short-lived HMAC-SHA256 signed QR codes rotating every 15 seconds to prevent static screenshot sharing.
              </p>
            </div>

            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-cyan-400">LAYER 03</div>
              <h3 className="text-lg font-semibold text-white">Real-Time Facial Identity Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                On-device neural inference comparing live camera frame against enrolled biometric signature with high precision threshold.
              </p>
            </div>

            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-purple-400">LAYER 04</div>
              <h3 className="text-lg font-semibold text-white">3D Passive Liveness Challenge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Randomized micro-gesture requests (blink twice, turn head) and depth analysis to detect screen video spoofing attempts.
              </p>
            </div>

            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-emerald-400">LAYER 05</div>
              <h3 className="text-lg font-semibold text-white">Classroom Geofence Validation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                GPS satellite accuracy combined with Wi-Fi BSSID RSSI triangulation ensuring student is physically inside the designated lab.
              </p>
            </div>

            <div className="bg-[#121A2B] border border-[#1E2D4A] hover:border-cyan-500/40 p-6 rounded-xl transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs text-amber-400">LAYER 06</div>
              <h3 className="text-lg font-semibold text-white">Temporal Anti-Replay & Lock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-use nonce validation preventing double check-in and enforcing late-arrival cutoff rules set by faculty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Guarantee Section */}
      <section className="py-16 bg-[#0E1524] border-b border-[#1E2D4A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
              PRIVACY & GOVERNANCE BY DESIGN
            </span>
            <h2 className="text-3xl font-bold text-white">
              Biometric Protection Without Compromise
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              VERITY never stores raw facial photos or video recordings on external servers. All biometric processing converts imagery into irreversible mathematical embeddings.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Zero raw image retention policy
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> AES-256 encrypted vector templates
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Explainable risk scoring with human faculty review path
              </li>
            </ul>
          </div>

          <div className="bg-[#121A2B] border border-[#1E2D4A] p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1E2D4A]">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">Explainable Governance Model</h4>
                <p className="text-xs text-slate-400">No automated rejection without faculty review</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If location accuracy drifts due to indoor signal interference, VERITY routes the attempt to <span className="text-amber-400 font-semibold">Pending Review</span> rather than marking the student absent, keeping faculty in complete control.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-12 bg-[#0B1020] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-white">VERITY</span> — Smart Multi-Layer Attendance Platform 2026
          </div>
          <div className="flex items-center gap-6 font-mono text-slate-400">
            <button onClick={() => setActiveScreen('landing')} className="hover:text-cyan-400">Documentation</button>
            <button onClick={() => setActiveScreen('auth')} className="hover:text-cyan-400">Faculty Login</button>
            <button onClick={() => setActiveScreen('verification-experience')} className="hover:text-cyan-400">Student Check-In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
