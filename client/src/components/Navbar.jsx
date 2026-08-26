import React, { useState } from 'react';
import { Sparkles, BrainCircuit, LayoutDashboard, Target, Home, Sun, Moon, Laptop, Menu, X, FolderGit2, Layers, ShieldCheck } from 'lucide-react';
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
    <header className="nav-fixed-header">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* FAR-LEFT: Brand Logo & Title */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0f172a] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white font-['Outfit'] uppercase">CREDOMETRICS</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">AI</span>
            </div>
            <div className="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anti-Hype WealthTech</span>
            </div>
          </div>
        </div>

        {/* CENTER: Dynamic JS SPA Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#162032] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'landing' 
                ? 'active-nav' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'features' || activeTab === 'analyzer'
                ? 'active-nav' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Features</span>
          </button>

          <button
            onClick={() => handleNavClick('files')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'files' || activeTab === 'dashboard'
                ? 'active-nav' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Files & Holdings</span>
          </button>

          <button
            onClick={() => handleNavClick('goals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'goals' 
                ? 'active-nav' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Goal SIPs</span>
          </button>

          <button
            onClick={() => {
              if (onOpenMiracle) onOpenMiracle();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-extrabold text-amber-300 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-purple-500/40 hover:border-amber-400/60 shadow-md hover:scale-105 transition-all ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Miracle AI</span>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono uppercase">Chat</span>
          </button>
        </nav>

        {/* FAR-RIGHT: Theme Control, Clerk Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Theme Switcher */}
          <div className="flex items-center bg-[#162032] p-1 rounded-lg border border-[#1e293b] text-xs hidden sm:flex">
            <button
              onClick={() => setTheme('light')}
              title="Light Theme"
              className={`p-1 rounded-md transition-all ${
                theme === 'light' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Theme"
              className={`p-1 rounded-md transition-all ${
                theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Theme"
              className={`p-1 rounded-md transition-all ${
                theme === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          <SignedIn>
            <div className="flex items-center gap-2">
              <div 
                onClick={onOpenRiskModal}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#162032] border border-[#1e293b] text-xs cursor-pointer hover:border-indigo-500 transition-all"
              >
                <span className="font-bold text-white text-xs">{clerkUser?.fullName || user?.name || 'Verified Investor'}</span>
                <span className="badge badge-green text-[9px] py-0 px-1.5">Risk: {user?.riskProfile?.score || 68}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn-slate text-xs py-1 px-3 cursor-pointer">
                  Log In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="btn-indigo text-xs py-1 px-3.5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 bg-[#162032] rounded-lg border border-[#1e293b] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-[#1e293b] absolute top-[60px] left-0 right-0 p-4 shadow-2xl flex flex-col gap-1.5 transition-all z-50">
          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'landing' ? 'active-nav' : 'text-slate-300 hover:bg-[#162032]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home View</span>
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'features' || activeTab === 'analyzer' ? 'active-nav' : 'text-slate-300 hover:bg-[#162032]'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Features View</span>
          </button>

          <button
            onClick={() => handleNavClick('files')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'files' || activeTab === 'dashboard' ? 'active-nav' : 'text-slate-300 hover:bg-[#162032]'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Files & Holdings View</span>
          </button>

          <button
            onClick={() => handleNavClick('goals')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-left transition-all ${
              activeTab === 'goals' ? 'active-nav' : 'text-slate-300 hover:bg-[#162032]'
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
            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-extrabold text-amber-300 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-purple-500/40"
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
