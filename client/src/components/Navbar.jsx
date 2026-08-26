import React, { useState } from 'react';
import { Sparkles, BrainCircuit, LayoutDashboard, Target, Home, Sun, Moon, Laptop, Menu, X, FolderGit2, Layers } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar({ activeTab, setActiveTab, user, theme, setTheme, onOpenRiskModal, onOpenMiracle }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  let clerkUser = null;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
  } catch (e) {}

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--bg-card)]/95 border-b border-[var(--border-card)] px-4 lg:px-8 py-2.5 transition-all shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* FAR-LEFT: Logo & Site Title */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[var(--bg-card)] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-[var(--text-main)] font-['Outfit'] uppercase">CREDOMETRICS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">AI</span>
            </div>
            <div className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anti-Hype WealthTech</span>
            </div>
          </div>
        </div>

        {/* CENTER: Dynamic JS SPA Navigation Tabs (Visible on MD 768px and up) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[var(--bg-card-inner)] p-1.5 rounded-xl border border-[var(--border-card)]">
          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'landing' 
                ? 'active-nav' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'features' || activeTab === 'analyzer'
                ? 'active-nav' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Features</span>
          </button>

          <button
            onClick={() => handleNavClick('files')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'files' || activeTab === 'dashboard'
                ? 'active-nav' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Files & Holdings</span>
          </button>

          <button
            onClick={() => handleNavClick('goals')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'goals' 
                ? 'active-nav' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Goal SIPs</span>
          </button>

          <button
            onClick={() => {
              if (onOpenMiracle) onOpenMiracle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold text-amber-300 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-purple-500/40 hover:border-amber-400/60 shadow-md hover:scale-105 transition-all ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Miracle AI</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono uppercase">Chat</span>
          </button>
        </nav>

        {/* FAR-RIGHT: Theme Control, Clerk Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Theme Option Switcher */}
          <div className="flex items-center bg-[var(--bg-card-inner)] p-1 rounded-xl border border-[var(--border-card)] text-xs hidden sm:flex">
            <button
              onClick={() => setTheme('light')}
              title="Light Theme"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Theme"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Theme"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          <SignedIn>
            <div className="flex items-center gap-2">
              <div 
                onClick={onOpenRiskModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs cursor-pointer hover:border-indigo-500 transition-all"
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
                <button className="btn-glass text-xs py-1.5 px-3 cursor-pointer">
                  Log In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="btn-primary text-xs py-1.5 px-3.5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* MOBILE HAMBURGER MENU BUTTON (Visible under md 768px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-main)] bg-[var(--bg-card-inner)] rounded-xl border border-[var(--border-card)] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-card)] mt-2 p-4 rounded-2xl shadow-2xl flex flex-col gap-1.5 transition-all">
          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
              activeTab === 'landing' ? 'active-nav' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-inner)]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home View</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
              activeTab === 'features' || activeTab === 'analyzer' ? 'active-nav' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-inner)]'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Features View</span>
          </button>

          <button
            onClick={() => handleNavClick('files')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
              activeTab === 'files' || activeTab === 'dashboard' ? 'active-nav' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-inner)]'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Files & Holdings View</span>
          </button>

          <button
            onClick={() => handleNavClick('goals')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
              activeTab === 'goals' ? 'active-nav' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-inner)]'
            }`}
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Goal SIPs View</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenMiracle) onOpenMiracle();
            }}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-extrabold text-amber-300 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-purple-500/40"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Miracle AI Assistant</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase">Chat</span>
          </button>
        </div>
      )}
    </header>
  );
}
