import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, activeScreen, setActiveScreen } = useAuth();

  const navItems = [
    {
      id: role === 'admin' ? 'admin-dashboard' : role === 'faculty' ? 'faculty-dashboard' : 'student-dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['admin', 'faculty', 'student']
    },
    {
      id: 'verification-experience',
      label: 'Live Verification Check',
      icon: ShieldCheck,
      roles: ['admin', 'faculty', 'student']
    },
    {
      id: 'investigation-center',
      label: 'Security Center',
      icon: AlertTriangle,
      roles: ['admin', 'faculty']
    },
    {
      id: 'faculty-dashboard',
      label: 'Session Creator & QR',
      icon: Calendar,
      roles: ['admin', 'faculty']
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      roles: ['admin', 'faculty']
    },
    {
      id: 'student-history',
      label: 'Attendance History',
      icon: FileText,
      roles: ['student']
    },
    {
      id: 'admin-security',
      label: 'Administration & System',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside
      className={`bg-[#0B1020] border-r border-[#1E2D4A] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      } shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] sticky top-16`}
    >
      <div className="p-3 space-y-4">
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-end border-b border-[#1E2D4A]/50 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-[#121A2B] text-slate-400 hover:text-white border border-[#1E2D4A] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121A2B]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status Pill */}
      {!collapsed && (
        <div className="p-3 m-3 bg-[#121A2B] border border-[#1E2D4A] rounded-lg text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-cyan-400 font-bold">VERITY CORE v2.4</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500">Node: VERTEX-ASIA-SOUTH1</p>
        </div>
      )}
    </aside>
  );
};
