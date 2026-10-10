import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  Lock, 
  Layers, 
  ChevronDown,
  Sparkles,
  Eye,
  BarChart2,
  AlertOctagon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeScreen, 
    setActiveScreen, 
    notificationsCount, 
    searchQuery, 
    setSearchQuery,
    currentStudent,
    currentFaculty
  } = useAuth();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1020]/95 backdrop-blur-md border-b border-[#1E2D4A]">
      {/* Top Hackathon Demo Bar */}
      <div className="bg-[#121A2B] border-b border-[#1E2D4A]/60 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold">VERITY Hackathon 2026 Live Demo Mode:</span>
          <span className="hidden sm:inline text-slate-400">Switch user persona below</span>
        </div>

        {/* Instant Persona Switcher */}
        <div className="flex items-center gap-1 font-mono">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Role Persona:</span>
          <button
            onClick={() => handleRoleChange('public')}
            className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
              role === 'public'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Public Site
          </button>
          <button
            onClick={() => handleRoleChange('student')}
            className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
              role === 'student'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Student Mobile
          </button>
          <button
            onClick={() => handleRoleChange('faculty')}
            className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
              role === 'faculty'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Faculty Portal
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
              role === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Admin Ops
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div 
          onClick={() => setActiveScreen('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-lg group-hover:shadow-cyan-500/25 transition-all">
            <div className="w-full h-full bg-[#0B1020] rounded-[7px] flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-wider font-mono">VERITY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Presence, Proven.</p>
          </div>
        </div>

        {/* Global Search Bar (for dashboard roles) */}
        {role !== 'public' && (
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, session, attempt ID..."
              className="w-full bg-[#121A2B] border border-[#1E2D4A] focus:border-cyan-500 text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg outline-none transition-all"
            />
          </div>
        )}

        {/* Navigation Quick Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveScreen('landing')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeScreen === 'landing' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveScreen('verification-experience')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeScreen === 'verification-experience' 
                ? 'text-cyan-400 bg-cyan-500/10 font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Live Verification Check
          </button>

          <button
            onClick={() => setActiveScreen('investigation-center')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeScreen === 'investigation-center' 
                ? 'text-amber-400 bg-amber-500/10 font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            Security Center
          </button>

          <button
            onClick={() => setActiveScreen('analytics')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeScreen === 'analytics' 
                ? 'text-teal-400 bg-teal-500/10 font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
            Analytics
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {role === 'public' ? (
            <button
              onClick={() => setActiveScreen('auth')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-xs font-semibold text-[#0B1020] shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> Platform Login
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button 
                onClick={() => setActiveScreen('investigation-center')}
                className="relative p-2 rounded-lg bg-[#121A2B] border border-[#1E2D4A] text-slate-300 hover:text-white transition-colors"
                title="Notifications & Alerts"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white font-mono font-bold flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#1E2D4A]">
                <img
                  src={role === 'faculty' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' : currentStudent.avatarUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {role === 'faculty' ? currentFaculty.name : role === 'student' ? currentStudent.name : 'System Admin'}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    {role.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
