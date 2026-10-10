import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  FileSpreadsheet,
  PieChart
} from 'lucide-react';
import { mockSubjects, mockStudents } from '../../data/mockData';

export const AnalyticsReports: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [selectedDepartment, setSelectedDepartment] = useState('cs');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Security & Attendance Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              ANALYTICS ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verification telemetry, failure mode distributions, and exportable compliance ledgers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-[#121A2B] border border-[#1E2D4A] text-xs text-white p-2 rounded-lg outline-none font-mono"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">This Semester</option>
          </select>

          <button
            onClick={() => alert('Generating CSV Attendance Ledger export...')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-[#0B1020] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Bar Chart SVG Preview */}
        <div className="lg:col-span-2 bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Daily Verification Attendance Trend
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Avg: 94.8%
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#1E2D4A]/60">
            {[92, 95, 88, 96, 94, 98, 97, 93, 95, 96, 98, 94, 95, 97].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </div>
                <div
                  style={{ height: `${val}%` }}
                  className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t-sm group-hover:brightness-125 transition-all"
                />
                <span className="text-[9px] font-mono text-slate-500">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Cause Distribution */}
        <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" /> Verification Failure Cause Distribution
          </h3>
          <p className="text-xs text-slate-400">Breakdown of non-passing check-in attempts</p>

          <div className="space-y-3 pt-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">Geofence Boundary Mismatch</span>
                <span className="text-amber-400 font-bold">45%</span>
              </div>
              <div className="w-full h-2 bg-[#0B1020] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[45%]" />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">3D Liveness Gesture Timeout</span>
                <span className="text-purple-400 font-bold">30%</span>
              </div>
              <div className="w-full h-2 bg-[#0B1020] rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 w-[30%]" />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">Expired Dynamic QR Token</span>
                <span className="text-cyan-400 font-bold">15%</span>
              </div>
              <div className="w-full h-2 bg-[#0B1020] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[15%]" />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">Late Arrival Cutoff</span>
                <span className="text-rose-400 font-bold">10%</span>
              </div>
              <div className="w-full h-2 bg-[#0B1020] rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 w-[10%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course & Subject Comparison Table */}
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-base">Subject & Course Comparison Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B1020] text-cyan-400 uppercase border-b border-[#1E2D4A]">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Subject Title</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Total Classes</th>
                <th className="p-3">Attendance Rate</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]">
              {mockSubjects.map((subj) => (
                <tr key={subj.id} className="hover:bg-[#19243C]">
                  <td className="p-3 font-bold text-white">{subj.code}</td>
                  <td className="p-3 text-slate-200">{subj.name}</td>
                  <td className="p-3 text-slate-400">{subj.facultyName}</td>
                  <td className="p-3 text-slate-300">{subj.totalClasses}</td>
                  <td className="p-3 font-bold text-emerald-400">95.4%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      OPTIMAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
