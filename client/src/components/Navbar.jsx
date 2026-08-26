import React from 'react';
import { Sparkles, BrainCircuit, LayoutDashboard, Target, Home } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenRiskModal, onOpenAuthModal, onLogout }) {
  let isSignedIn = false;
  let clerkUser = null;

  try {
    const clerk = useUser();
    isSignedIn = clerk?.isSignedIn;
    clerkUser = clerk?.user;
  } catch (e) {
    // Graceful fallback when Clerk Context is unconfigured
  }

  const currentUser = clerkUser || user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f1d]/90 border-b border-[#1e293b] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* FAR-LEFT: Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white font-['Outfit'] uppercase">CREDOMETRICS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">AI</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anti-Hype WealthTech</span>
            </div>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'landing' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'analyzer' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            Hype Analyzer
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'goals' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Goal SIPs
          </button>
        </nav>

        {/* FAR-RIGHT: Authentication Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={onOpenRiskModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111827] border border-[#1e293b] text-xs cursor-pointer hover:border-indigo-500 transition-all"
              >
                <span className="font-bold text-slate-200">{currentUser?.fullName || currentUser?.name || 'Verified Investor'}</span>
                <span className="badge badge-green text-[9px] py-0 px-1.5">Risk: {user?.riskProfile?.score || 68}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onOpenAuthModal('login')}
                className="btn-glass text-xs py-1.5 px-3.5"
              >
                Log In
              </button>

              <button 
                onClick={() => onOpenAuthModal('signup')}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Sign Up with Clerk
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
