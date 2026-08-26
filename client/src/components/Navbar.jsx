import React from 'react';
import { Sparkles, BrainCircuit, LayoutDashboard, Target, Home, Sun, Moon, Laptop } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar({ activeTab, setActiveTab, user, theme, setTheme, onOpenRiskModal, onOpenMiracle }) {
  let clerkUser = null;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
  } catch (e) {}

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--bg-card)]/90 border-b border-[var(--border-card)] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* FAR-LEFT: Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[var(--bg-card)] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-[var(--text-main)] font-['Outfit'] uppercase">CREDOMETRICS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">AI</span>
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anti-Hype WealthTech</span>
            </div>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-card-inner)] p-1 rounded-lg border border-[var(--border-card)]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'landing' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
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
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
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
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
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
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Goal SIPs
          </button>

          <button
            onClick={() => {
              if (onOpenMiracle) onOpenMiracle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-extrabold text-amber-300 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-purple-500/40 hover:border-amber-400/60 shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Miracle AI</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono uppercase">New</span>
          </button>
        </nav>

        {/* FAR-RIGHT: Theme Control + Clerk Auth */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Theme Option Switcher: Light, Dark, System */}
          <div className="flex items-center bg-[var(--bg-card-inner)] p-1 rounded-lg border border-[var(--border-card)] text-xs">
            <button
              onClick={() => setTheme('light')}
              title="Light Theme"
              className={`p-1.5 rounded-md transition-all ${
                theme === 'light' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Theme"
              className={`p-1.5 rounded-md transition-all ${
                theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Theme"
              className={`p-1.5 rounded-md transition-all ${
                theme === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          <SignedIn>
            <div className="flex items-center gap-3">
              <div 
                onClick={onOpenRiskModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs cursor-pointer hover:border-indigo-500 transition-all"
              >
                <span className="font-bold text-[var(--text-main)]">{clerkUser?.fullName || user?.name || 'Verified Investor'}</span>
                <span className="badge badge-green text-[9px] py-0 px-1.5">Risk: {user?.riskProfile?.score || 68}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn-glass text-xs py-1.5 px-3.5 cursor-pointer">
                  Log In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="btn-primary text-xs py-1.5 px-4 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>

      </div>
    </header>
  );
}
