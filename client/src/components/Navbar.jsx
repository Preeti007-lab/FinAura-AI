import React from 'react';
import { Shield, Sparkles, BrainCircuit, LayoutDashboard, Target, LogOut, Home, Layers, User } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenRiskModal, onOpenAuthModal, onLogout }) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkActive = clerkPubKey && !clerkPubKey.includes('your_clerk_publishable_key_here');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f1d]/90 border-b border-[#1e293b] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* FAR-LEFT: Clean Bold Uppercase Logo (CREDOMETRICS) */}
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

        {/* CENTER: Clean Nav Links */}
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
            onClick={() => user ? setActiveTab('dashboard') : onOpenAuthModal('login')}
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
            onClick={() => user ? setActiveTab('analyzer') : onOpenAuthModal('login')}
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
            onClick={() => user ? setActiveTab('goals') : onOpenAuthModal('login')}
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

        {/* FAR-RIGHT: Clerk Auth Controls & Profile Photo Avatars */}
        <div className="flex items-center gap-3 shrink-0">
          {isClerkActive ? (
            <>
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="btn-primary text-xs py-1.5 px-4">
                      Log In with Clerk
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-3">
                  <div 
                    onClick={onOpenRiskModal}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111827] border border-[#1e293b] text-xs cursor-pointer hover:border-indigo-500 transition-all"
                  >
                    <span className="font-bold text-slate-200">{user?.name || 'Clerk User'}</span>
                    <span className="badge badge-green text-[9px] py-0 px-1.5">Risk: {user?.riskProfile?.score || 68}</span>
                  </div>
                  
                  {/* Official Clerk UserAvatar & Profile Dropdown */}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </>
          ) : (
            user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={onOpenRiskModal}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111827] border border-[#1e293b] text-xs cursor-pointer hover:border-indigo-500 transition-all"
                  title="View Investor Risk Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
                    {user.name ? user.name[0] : 'A'}
                  </div>
                  <span className="font-bold text-slate-200 hidden sm:inline">{user.name || 'Alex Vance'}</span>
                  <span className="badge badge-green text-[9px] py-0 px-1.5 hidden lg:inline">Risk: {user.riskProfile?.score || 68}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-md bg-[#111827] border border-[#1e293b] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all"
                  title="Log Out Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
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
                  Sign Up
                </button>
              </div>
            )
          )}
        </div>

      </div>
    </header>
  );
}
