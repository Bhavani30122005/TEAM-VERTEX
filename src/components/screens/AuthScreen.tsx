import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { setRole, setActiveScreen } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'forgot' | 'activation'>('login');
  const [email, setEmail] = useState('bhavani.s@vertex.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }

    if (activeTab === 'login') {
      setSuccessMessage(`Authenticated successfully as ${selectedRole.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        setRole(selectedRole);
      }, 600);
    } else if (activeTab === 'forgot') {
      setSuccessMessage('Password reset link sent to your institutional email.');
    } else if (activeTab === 'activation') {
      setSuccessMessage('Account activated! Face template enrolment is complete.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121A2B] border border-[#1E2D4A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">VERITY Portal Access</h2>
          <p className="text-xs text-slate-400">Multi-Layer Identity & Attendance Verification</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1E2D4A] text-xs font-medium">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 border-b-2 transition-all ${
              activeTab === 'login' 
                ? 'border-cyan-400 text-cyan-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('activation'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 border-b-2 transition-all ${
              activeTab === 'activation' 
                ? 'border-cyan-400 text-cyan-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Account Activation
          </button>
          <button
            onClick={() => { setActiveTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 border-b-2 transition-all ${
              activeTab === 'forgot' 
                ? 'border-cyan-400 text-cyan-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Role Switcher Selector */}
        <div className="bg-[#0B1020] p-2 rounded-lg border border-[#1E2D4A] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 block px-1">Select Persona for Demo:</span>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-1.5 rounded font-mono transition-all ${
                selectedRole === 'student'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={`py-1.5 rounded font-mono transition-all ${
                selectedRole === 'faculty'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-1.5 rounded font-mono transition-all ${
                selectedRole === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Alerts */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-lg flex items-center gap-2 font-mono">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@vertex.edu"
                className="w-full bg-[#0B1020] border border-[#1E2D4A] focus:border-cyan-400 text-white pl-9 pr-3 py-2.5 rounded-lg outline-none transition-all"
                required
              />
            </div>
          </div>

          {activeTab !== 'forgot' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#0B1020] border border-[#1E2D4A] focus:border-cyan-400 text-white pl-9 pr-10 py-2.5 rounded-lg outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activation' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Enrolment Code
              </label>
              <input
                type="text"
                placeholder="VERITY-ACT-9901"
                className="w-full bg-[#0B1020] border border-[#1E2D4A] focus:border-cyan-400 text-white px-3 py-2.5 rounded-lg outline-none font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {activeTab === 'login' ? 'Authenticate & Enter Dashboard' : activeTab === 'activation' ? 'Activate & Enrol Biometrics' : 'Send Reset Link'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
