import React from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle2, Cpu, Server } from 'lucide-react';
import { mockTrustPulse } from '../../data/mockData';

export const TrustPulse: React.FC = () => {
  return (
    <div className="w-full bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Shield className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-100 tracking-wide">VERITY Trust Pulse™</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Institution-wide verification pulse & real-time telemetry summary
            </p>
          </div>
        </div>

        {/* Microservice Health Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1020] border border-[#1E2D4A]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Face Engine:</span>
            <span className="text-emerald-400 font-medium font-mono">99.8%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1020] border border-[#1E2D4A]">
            <Server className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-300">Geofence Node:</span>
            <span className="text-emerald-400 font-medium font-mono">Active</span>
          </div>
        </div>
      </div>

      {/* Pulse Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-[#0B1020]/70 border border-[#1E2D4A] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            Check-Ins Today
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              {mockTrustPulse.totalCheckInsToday.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">across {mockTrustPulse.completedSessionsToday} sessions</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/70 border border-[#1E2D4A] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            Verification Success Rate
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {mockTrustPulse.overallSuccessRate}%
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">+0.3% vs avg</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/70 border border-[#1E2D4A] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            Avg Verification Latency
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-cyan-300">
              {mockTrustPulse.averageVerificationTimeSec}s
            </span>
            <span className="text-[11px] text-slate-400">6 verification layers</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/70 border border-[#1E2D4A] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            Unresolved Risk Alerts
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-amber-400">
              {mockTrustPulse.unresolvedRiskAlerts}
            </span>
            <span className="text-[11px] text-amber-400 font-mono">Requires Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
