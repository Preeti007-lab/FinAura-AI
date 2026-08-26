import React, { useState } from 'react';
import { 
  Sparkles, BrainCircuit, ShieldAlert, ArrowRight, TrendingUp, ShieldCheck, Zap, Sliders, Layers, Target, BarChart2, Activity, Lock, Cpu
} from 'lucide-react';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';

export default function LandingPage({ setActiveTab, onOpenAuthModal }) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkActive = clerkPubKey && !clerkPubKey.includes('your_clerk_publishable_key_here');

  // Compounding Interest Slider States (Real-time dynamic SVG curve)
  const [sipAmount, setSipAmount] = useState(35000);
  const [horizonYears, setHorizonYears] = useState(15);
  const [cagrRate, setCagrRate] = useState(14);

  // Real-Time SVG Compounding Curve Generator (Smooth Bezier Curve Bending)
  const calculateCompounding = () => {
    const totalInvested = sipAmount * 12 * horizonYears;
    const monthlyRate = cagrRate / 12 / 100;
    let corpus = 0;
    const points = [{ yr: 0, corpus: 0 }];

    for (let yr = 1; yr <= horizonYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        corpus = (corpus + sipAmount) * (1 + monthlyRate);
      }
      points.push({ yr, corpus });
    }

    const finalCorpus = corpus;
    const totalGain = Math.max(0, finalCorpus - totalInvested);

    // Build SVG Path Coordinates (500x220 canvas)
    const maxVal = Math.max(1, points[points.length - 1].corpus);
    const width = 500;
    const height = 220;
    const padding = 24;

    const coords = points.map((p, i) => {
      const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
      const y = height - padding - (p.corpus / maxVal) * (height - 2 * padding);
      return { x, y };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) * 0.5;
      const cp2y = p1.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const areaD = `${pathD} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;

    return { totalInvested, finalCorpus, totalGain, pathD, areaD, lastPoint: last };
  };

  const { totalInvested, finalCorpus, totalGain, pathD, areaD, lastPoint } = calculateCompounding();

  return (
    <div className="w-full bg-[#0A0F1D] min-h-screen text-slate-100 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* SECTION 1: THE SPACIOUS HERO VIEW (TOP)                                  */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-20 pb-8">
        
        {/* Institutional Pill Header */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111827] border border-[#1E293B] text-indigo-300 text-xs font-bold shadow-md mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>INSTITUTIONAL WEALTHTECH & ANTI-HYPE PLATFORM</span>
        </div>

        {/* Massive Center-Aligned Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.08] font-['Outfit'] max-w-4xl mx-auto">
          Turn Finfluencer Noise into <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Actionable Wealth</span>
        </h1>

        {/* Exactly ONE Large Rounded Call-to-Action Button Wrapped in Clerk's SignUpButton */}
        <div className="mt-12 mb-[120px] flex justify-center">
          <SignedIn>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-lg sm:text-xl rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:shadow-[0_15px_45px_rgba(99,102,241,0.65)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-lg sm:text-xl rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:shadow-[0_15px_45px_rgba(99,102,241,0.65)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20">
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </SignUpButton>
          </SignedOut>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE SCROLL-ANIMATED PROOF COUNTERS (SCROLL DOWN 1)            */}
      {/* ========================================================================= */}
      <section className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Proof Counter Card 1 */}
          <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-[8px] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/50 transition-all duration-300">
            <div className="text-5xl sm:text-6xl font-extrabold text-emerald-400 font-['Outfit'] tracking-tight">
              $48M+
            </div>
            <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
              Assets Verified
            </div>
          </div>

          {/* Proof Counter Card 2 */}
          <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-[8px] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-indigo-500/50 transition-all duration-300">
            <div className="text-5xl sm:text-6xl font-extrabold text-indigo-400 font-['Outfit'] tracking-tight">
              14,200+
            </div>
            <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
              Portfolios Protected
            </div>
          </div>

          {/* Proof Counter Card 3 */}
          <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-[8px] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-cyan-400/50 transition-all duration-300">
            <div className="text-5xl sm:text-6xl font-extrabold text-cyan-400 font-['Outfit'] tracking-tight">
              98.4%
            </div>
            <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mt-3">
              Filtering Accuracy
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE INTERACTIVE FORECASTING PLAYGROUND (SCROLL DOWN 2)        */}
      {/* ========================================================================= */}
      <section className="mb-32">
        <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-[8px] p-8 sm:p-12 shadow-2xl">
          
          <div className="flex items-center gap-2 mb-8">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Interactive Forecasting Playground
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Side: Dragging Slider Controls */}
            <div className="lg:col-span-5 space-y-8 bg-[#111827] p-8 rounded-[8px] border border-[#1E293B]">
              
              {/* Slider 1: Monthly Investment Goal */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300 uppercase tracking-wider text-xs">Monthly Investment Goal</span>
                  <span className="text-emerald-400 font-mono text-lg font-extrabold">₹{sipAmount.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 2: Investment Horizon */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300 uppercase tracking-wider text-xs">Investment Horizon</span>
                  <span className="text-cyan-300 font-mono text-lg font-extrabold">{horizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 3: Expected CAGR Return */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300 uppercase tracking-wider text-xs">Expected Return</span>
                  <span className="text-amber-300 font-mono text-lg font-extrabold">{cagrRate}% P.A.</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={cagrRate}
                  onChange={(e) => setCagrRate(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Real-Time Metrics Summary Box */}
              <div className="p-5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected Wealth Corpus</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono mt-1">
                    ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div className="text-right text-xs text-slate-300 space-y-0.5">
                  <div>Invested: ₹{(totalInvested / 100000).toFixed(1)}L</div>
                  <div className="text-emerald-400 font-bold">Gain: ₹{(totalGain / 100000).toFixed(1)}L</div>
                </div>
              </div>

            </div>

            {/* Right Side: Dynamic Real-Time Bending SVG Line Graph */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                <span>DYNAMIC GROWTH CURVE ({horizonYears} YRS)</span>
                <span className="text-emerald-400 font-mono">{cagrRate}% CAGR RATE</span>
              </div>

              <div className="relative w-full h-80 bg-[#111827] p-6 rounded-[8px] border border-[#1E293B] flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    <linearGradient id="curveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Guides */}
                  <line x1="24" y1="50" x2="476" y2="50" stroke="#1E293B" strokeDasharray="4 4" />
                  <line x1="24" y1="100" x2="476" y2="100" stroke="#1E293B" strokeDasharray="4 4" />
                  <line x1="24" y1="150" x2="476" y2="150" stroke="#1E293B" strokeDasharray="4 4" />

                  {/* Gradient Fill Under Curve */}
                  <path d={areaD} fill="url(#curveAreaGrad)" transition="all 0.15s ease-out" />

                  {/* Smooth Curved Line Path that bends in real-time */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#curveLineGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ transition: 'd 0.15s ease-out' }}
                  />

                  {/* End Target Node Circle */}
                  {lastPoint && (
                    <g className="animate-pulse">
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="7" fill="#10b981" />
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="14" fill="#10b981" opacity="0.25" />
                    </g>
                  )}
                </svg>

                {/* Floating Live Badge */}
                <div className="absolute top-4 right-4 bg-[#0A0F1D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-[6px] border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold shadow-lg">
                  ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ORGANIZED BENTO FEATURE MODULES (SCROLL DOWN 3)               */}
      {/* ========================================================================= */}
      <section className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Module Card 1: Anti-Hype AI Detection */}
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-[8px] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Anti-Hype AI Detection
              </h3>

              <ul className="space-y-3 text-sm text-slate-300 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>Real-time Groq LLM social audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>Automated SEBI/SEC risk scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>Instant pump & dump detection</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Explore AI Engine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Module Card 2: Consolidated Asset Vault */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Layers className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Consolidated Asset Vault
              </h3>

              <ul className="space-y-3 text-sm text-slate-300 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Single-pane multi-asset vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Unified net worth tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Real-time portfolio rebalancing</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Asset Vault</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Module Card 3: Automated Goal SIP Engine */}
          <div 
            onClick={() => setActiveTab('goals')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-[8px] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>

              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Automated Goal Engine
              </h3>

              <ul className="space-y-3 text-sm text-slate-300 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>Inflation-adjusted target goals</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>Dynamic SIP compounding curve</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>Automated wealth accumulation</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Plan Goal SIPs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INSTITUTIONAL FOOTER BADGES                                               */}
      {/* ========================================================================= */}
      <footer className="pb-16 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>256-Bit Institutional Grade Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>SEC/SEBI Institutional Framework</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Groq AI Engine</span>
        </div>
      </footer>

    </div>
  );
}
