import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Server, 
  Lock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Activity,
  Key
} from 'lucide-react';
import { mockClassrooms, mockTrustPulse } from '../../data/mockData';

export const AdminSecurity: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Security & Infrastructure Administration
          </h1>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            SYSTEM ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Cluster health, encryption key rotations, microservice status, and classroom geofence nodes
        </p>
      </div>

      {/* Microservices Health Status */}
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" /> Active Security Microservice Telemetry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0B1020] border border-emerald-500/30 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Face Vector API</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-emerald-400">OPERATIONAL</div>
            <p className="text-[10px] text-slate-500 font-mono">Uptime: 99.98% • Latency: 140ms</p>
          </div>

          <div className="bg-[#0B1020] border border-emerald-500/30 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Geofence Triangulator</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-emerald-400">OPERATIONAL</div>
            <p className="text-[10px] text-slate-500 font-mono">Uptime: 99.99% • Latency: 45ms</p>
          </div>

          <div className="bg-[#0B1020] border border-emerald-500/30 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">HMAC Token Validator</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-emerald-400">OPERATIONAL</div>
            <p className="text-[10px] text-slate-500 font-mono">Rotates every 15s</p>
          </div>

          <div className="bg-[#0B1020] border border-emerald-500/30 p-3.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">PostgreSQL DB Enclave</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-emerald-400">HEALTHY</div>
            <p className="text-[10px] text-slate-500 font-mono">AES-256 Encrypted</p>
          </div>
        </div>
      </div>

      {/* Classroom Geofence Configuration List */}
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-400" /> Classroom Geofence Polygon Nodes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B1020] text-cyan-400 uppercase border-b border-[#1E2D4A]">
              <tr>
                <th className="p-3">Node ID</th>
                <th className="p-3">Classroom Name</th>
                <th className="p-3">Building</th>
                <th className="p-3">GPS Coordinates</th>
                <th className="p-3">Radius Boundary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]">
              {mockClassrooms.map((room) => (
                <tr key={room.id} className="hover:bg-[#19243C]">
                  <td className="p-3 font-bold text-white">{room.code}</td>
                  <td className="p-3 text-slate-200">{room.name}</td>
                  <td className="p-3 text-slate-400">{room.building}</td>
                  <td className="p-3 text-slate-300">{room.latitude}, {room.longitude}</td>
                  <td className="p-3 font-bold text-cyan-400">{room.allowedRadiusMeters} meters</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
