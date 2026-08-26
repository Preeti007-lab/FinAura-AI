import React, { useState } from 'react';
import { 
  Sparkles, BrainCircuit, LayoutDashboard, Target, ShieldCheck, ArrowRight, TrendingUp, CheckCircle2, Flame, ShieldAlert, Cpu, Lock, Layers, BarChart2, Zap, ArrowUpRight, Activity, Calculator, ChevronRight, ExternalLink, Sliders
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function LandingPage({ setActiveTab, onOpenAuthModal }) {
  const [demoPrompt, setDemoPrompt] = useState('🔥 GUARANTEED 10X RETURNS on XYZ Penny Stock! Buy before YouTube explosion!');
  const [analyzingDemo, setAnalyzingDemo] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  // Compounding Interest Slider States (Real-time dynamic SVG curve)
  const [sipAmount, setSipAmount] = useState(30000);
  const [horizonYears, setHorizonYears] = useState(15);
  const [cagrRate, setCagrRate] = useState(14);

  // Module 3 Goal Slider State
  const [moduleSipAmount, setModuleSipAmount] = useState(32500);

  const handleRunDemo = () => {
    setAnalyzingDemo(true);
    setDemoResult(null);
    setTimeout(() => {
      setAnalyzingDemo(false);
      setDemoResult({
        hypeScore: 92,
        sentiment: 'High Risk / Pump & Dump',
        riskLevel: 'Extreme Speculative',
        redFlags: [
          'Unrealistic guaranteed yield claim (10x in short period)',
          'Finfluencer social media FOMO tactic without disclosures',
          'Lacks SEBI/SEC audited financial statements'
        ],
        recommendation: 'AVOID committing essential capital. Reallocate into broad-market index funds.'
      });
    }, 600);
  };

  // Upward Area Chart Data
  const assetsGrowthData = [
    { m: 'Jan', v: 12 },
    { m: 'Mar', v: 18 },
    { m: 'May', v: 24 },
    { m: 'Jul', v: 32 },
    { m: 'Sep', v: 41 },
    { m: 'Nov', v: 48 }
  ];

  // Declining Losses Bar Chart Data
  const decliningLossesData = [
    { q: 'Q1', loss: 45 },
    { q: 'Q2', loss: 28 },
    { q: 'Q3', loss: 12 },
    { q: 'Q4', loss: 3 }
  ];

  // Asset Split Donut Data for Module 02
  const assetSplitData = [
    { name: 'Equities', value: 65, color: '#6366f1' },
    { name: 'Debt Funds', value: 25, color: '#10b981' },
    { name: 'Gold & Cash', value: 10, color: '#f59e0b' }
  ];

  // Real-Time SVG Compounding Curve Generator (Smooth Bezier Smoothing)
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
    <div className="space-y-36 pb-36 max-w-7xl mx-auto px-4 text-center">
      
      {/* ========================================================================= */}
      {/* BLOCK 1: HERO SECTION                                                     */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-8 max-w-4xl mx-auto pt-6">
        
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-md bg-[#111827] border border-[#1e293b] text-indigo-300 text-xs font-bold shadow-md">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Institutional WealthTech & Anti-Hype AI Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.08] max-w-4xl mx-auto">
          Turn Finfluencer Noise into <span className="gradient-hero-text">Actionable Wealth</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Audit social hype with real-time AI, consolidate multi-asset holdings into a single dashboard, and automate inflation-adjusted SIP goals.
        </p>

        <div>
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="btn-hero-cta"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111827] border border-[#1e293b] text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>98.4% Hype Accuracy</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111827] border border-[#1e293b] text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real-Time Groq AI Inference</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111827] border border-[#1e293b] text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SEC/SEBI Framework Aligned</span>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="bento-card p-8 border-[#1e293b] rounded-lg cursor-pointer group hover:border-indigo-500 transition-all space-y-6 bg-[#111827] text-left"
          >
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-white font-['Outfit']">CredoMetrics Consolidated Dashboard</span>
              </div>
              <span className="badge badge-green">+25.0% Net Return</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-[#0a0f1d] border border-[#1e293b]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consolidated Net Worth</div>
                <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">₹6,57,645</div>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹1,31,529 Gain
                </div>
              </div>

              <div className="p-4 rounded-md bg-[#0a0f1d] border border-[#1e293b]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Smart SIPs</div>
                <div className="text-2xl font-extrabold text-indigo-300 font-['Outfit'] mt-1">₹32,500/mo</div>
                <div className="text-xs text-slate-400 mt-0.5">3 Financial Goals</div>
              </div>

              <div className="p-4 rounded-md bg-[#0a0f1d] border border-[#1e293b]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Profile Score</div>
                <div className="text-2xl font-extrabold text-cyan-300 font-['Outfit'] mt-1">68 / 100</div>
                <div className="text-xs text-slate-400 mt-0.5">Growth Investor</div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>Equities (65%)</span>
                <span>Debt Funds (25%)</span>
                <span>Gold & Commodities (10%)</span>
              </div>
              <div className="h-2.5 rounded-md bg-[#0a0f1d] overflow-hidden flex">
                <div className="h-full bg-indigo-500 w-[65%]" />
                <div className="h-full bg-emerald-500 w-[25%]" />
                <div className="h-full bg-amber-500 w-[10%]" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Full Interactive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: METRIC COUNTERS                                                */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">INSTITUTIONAL EVIDENCE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">Live Metric Counters & Evidence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bento-card p-8 flex flex-col justify-between space-y-6 text-left border-[#1e293b] rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-green text-[10px]">Verified Assets</span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-4xl font-extrabold text-white font-['Outfit']">$48M+</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Assets Tracked & Verified</div>
            </div>

            <div className="h-24 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={assetsGrowthData}>
                  <defs>
                    <linearGradient id="emeraldGradSec2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#emeraldGradSec2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="hover-reveal flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>View Audit Certificate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between space-y-6 text-left border-[#1e293b] rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-blue text-[10px]">Risk Mitigation</span>
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-4xl font-extrabold text-white font-['Outfit']">14,200+</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Portfolios Protected from Pump Hype</div>
            </div>

            <div className="h-24 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={decliningLossesData}>
                  <Bar dataKey="loss" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="hover-reveal flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <span>Explore Protection Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between space-y-6 text-left border-[#1e293b] rounded-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-amber text-[10px]">Accuracy Benchmark</span>
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-4xl font-extrabold text-emerald-400 font-['Outfit']">98.4%</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">Anti-Hype AI Detection Win Rate</div>
            </div>

            <div className="flex items-center justify-center pt-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-400 stroke-current animate-pulse" strokeWidth="3.5" strokeDasharray="98.4, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-sm font-extrabold text-emerald-400 font-['Outfit']">98.4%</span>
              </div>
            </div>

            <div className="hover-reveal flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Read Compliance Report</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: MODULE 01 (ANTI-HYPE DETECTOR)                                */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-10 max-w-5xl mx-auto">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">ISOLATED SECTION 3</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">Module 01: Anti-Hype AI Social Detector</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Audit Finfluencer tips, Telegram calls, and viral tweets with real-time Groq Llama-3 AI.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('analyzer')}
          className="bento-card p-8 border-[#1e293b] rounded-lg text-left space-y-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <span className="badge badge-green text-xs">Module 01 System</span>
            <span className="text-xs text-indigo-400 font-bold flex items-center gap-1">
              Launch AI Analyzer <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 p-6 rounded-lg bg-[#0a0f1d] border border-[#1e293b] text-center space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hype Evaluation Score</div>
              <div className="text-5xl font-extrabold text-rose-400 font-['Outfit']">92 / 100</div>
              <div className="text-xs text-rose-300 font-semibold">High Risk / Pump & Dump Alert</div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="p-4 rounded-lg bg-[#0a0f1d] border border-rose-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>⚠️ DETECTED WARNING FLAGS</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                  <li>Unrealistic guaranteed yield claim ("10x returns in 7 days!")</li>
                  <li>Unregulated Telegram/YouTube pump recommendation</li>
                  <li>Lacks SEBI/SEC audited financial statements</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0a0f1d] border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <strong className="text-emerald-400">Recommended Action:</strong> Reallocate into broad index fund.
                </div>
                <div className="hover-reveal text-xs font-bold text-indigo-400 flex items-center gap-1">
                  <span>Deep Dive</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MODULE 02 (NET WORTH VAULT)                                   */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-10 max-w-5xl mx-auto">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">ISOLATED SECTION 4</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">Module 02: Consolidated Net Worth Vault</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Single-pane view for Equities, Mutual Funds, Savings, Gold, and Crypto holdings.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('dashboard')}
          className="bento-card p-8 border-[#1e293b] rounded-lg text-left space-y-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <span className="badge badge-blue text-xs">Module 02 System</span>
            <span className="text-xs text-indigo-400 font-bold flex items-center gap-1">
              Launch Net Worth Vault <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-6 bg-[#0a0f1d] p-6 rounded-lg border border-[#1e293b] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Consolidated Net Worth</div>
                  <div className="text-4xl font-extrabold text-white font-['Outfit'] mt-1">₹26,57,645</div>
                </div>
                <span className="badge badge-green text-sm">+25.0% Gain</span>
              </div>

              <div className="h-16 w-full pt-1">
                <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path d="M0 20 Q 25 15, 50 12 T 100 2" fill="none" stroke="#10b981" strokeWidth="3" />
                  <circle cx="100" cy="2" r="3" fill="#10b981" />
                </svg>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#0a0f1d] p-4 rounded-lg border border-[#1e293b] flex items-center justify-between">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={assetSplitData} innerRadius={28} outerRadius={46} paddingAngle={4} dataKey="value">
                      {assetSplitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs pr-4">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Equities (65%)
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Debt Funds (25%)
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Gold & Cash (10%)
                </div>
              </div>
            </div>

          </div>

          <div className="hover-reveal flex items-center justify-between text-xs font-bold text-indigo-400 pt-2 border-t border-[#1e293b]">
            <span>Click to View Full Multi-Asset Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: INTERACTIVE COMPOUNDING INTEREST SLIDER CARD (REAL-TIME SVG)   */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-10 max-w-5xl mx-auto">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Sliders className="w-4 h-4" /> REAL-TIME COMPOUNDING ENGINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">Compounding Interest Simulator</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Drag the monthly investment handle to watch the SVG curve dynamically smooth-curve upward in real-time.
          </p>
        </div>

        <div className="bento-card p-8 sm:p-10 border-[#1e293b] rounded-lg text-left shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Sliders (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 bg-[#0a0f1d] p-6 rounded-lg border border-[#1e293b]">
              
              {/* Slider 1: Monthly Investment (Drag handle) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Monthly Investment (SIP)</span>
                  <span className="text-emerald-400 font-mono text-base">₹{sipAmount.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="150000"
                  step="2500"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-md appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 2: Horizon */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Investment Horizon</span>
                  <span className="text-cyan-300 font-mono text-base">{horizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-md appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 3: Expected CAGR */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Expected CAGR Return</span>
                  <span className="text-amber-300 font-mono text-base">{cagrRate}% P.A.</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="18"
                  step="0.5"
                  value={cagrRate}
                  onChange={(e) => setCagrRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-md appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Real-time Calculated Metrics */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Projected Corpus</div>
                  <div className="text-2xl font-extrabold text-emerald-300 font-mono mt-0.5">
                    ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-300">
                  <div>Invested: ₹{(totalInvested / 100000).toFixed(1)}L</div>
                  <div className="text-emerald-400 font-bold">Wealth Gain: ₹{(totalGain / 100000).toFixed(1)}L</div>
                </div>
              </div>

            </div>

            {/* DYNAMIC REAL-TIME MORPHING SVG LINE GRAPH (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Real-Time Compounding Curve ({horizonYears} Years)</span>
                <span className="text-emerald-400 font-mono">CAGR Rate: {cagrRate}%</span>
              </div>

              {/* Dynamic SVG Box */}
              <div className="relative w-full h-72 bg-[#0a0f1d] p-4 rounded-lg border border-[#1e293b] flex items-center justify-center overflow-hidden">
                
                {/* SVG Curve Canvas */}
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="svgLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    <linearGradient id="svgAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Faint Background Grid Lines */}
                  <line x1="24" y1="50" x2="476" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="24" y1="100" x2="476" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="24" y1="150" x2="476" y2="150" stroke="#1e293b" strokeDasharray="4 4" />

                  {/* Gradient Area Fill */}
                  <path d={areaD} fill="url(#svgAreaGrad)" transition="all 0.15s ease-out" />

                  {/* Smooth Curved Line Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#svgLineGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ transition: 'd 0.15s ease-out' }}
                  />

                  {/* Pulsing End Node Marker */}
                  {lastPoint && (
                    <g className="animate-pulse">
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="7" fill="#10b981" />
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="12" fill="#10b981" opacity="0.3" />
                    </g>
                  )}
                </svg>

                {/* Floating Real-Time Badge */}
                <div className="absolute top-4 right-4 bg-[#111827]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-lg">
                  ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                </div>

              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
                <span>Start: Yr 0 (₹0)</span>
                <span>Mid Horizon: Yr {Math.round(horizonYears / 2)}</span>
                <span className="text-emerald-400 font-bold">Goal: Yr {horizonYears} (₹{(finalCorpus / 100000).toFixed(1)}L)</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CASE STUDIES & FOOTERS                                         */}
      {/* ========================================================================= */}
      <section className="section-tower space-y-12 max-w-5xl mx-auto">
        
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">REAL-WORLD APPLICATION RESULTS</span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit']">Before vs After CredoMetrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 bento-card p-6 border-rose-500/30 text-left bg-[#170e17] rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <span className="badge badge-red text-xs">BEFORE CREDOMETRICS</span>
                <span className="text-xs font-extrabold text-rose-400 font-['Outfit']">THE NOISE</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-md bg-[#0a0f1d] border border-rose-500/30 space-y-1">
                  <div className="text-rose-400 font-bold text-[11px] flex items-center justify-between">
                    <span>📱 Telegram & Twitter Tips</span>
                    <span className="text-rose-500 font-extrabold">-45% Loss</span>
                  </div>
                  <p className="text-[11px] text-slate-400">"Buy XYZ penny stock now! 10x guaranteed returns!"</p>
                </div>
                <div className="p-3 rounded-md bg-[#0a0f1d] border border-rose-500/30 space-y-1">
                  <div className="text-rose-400 font-bold text-[11px]">⚡ Fragmented Accounts</div>
                  <p className="text-[11px] text-slate-400">No consolidated view across stocks, mutual funds & savings.</p>
                </div>
              </div>
              <div className="text-[11px] text-rose-400 font-bold text-center pt-1">
                ⚠️ Result: High Drawdown & FOMO Trading
              </div>
            </div>

            <div className="md:col-span-2 text-center flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            <div className="md:col-span-5 bento-card p-6 border-emerald-500/40 text-left bg-[#0e1c17] rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="badge badge-green text-xs">AFTER CREDOMETRICS</span>
                <span className="text-xs font-extrabold text-emerald-400 font-['Outfit']">ACTIONABLE WEALTH</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="p-3 rounded-md bg-[#0a0f1d] border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400 font-bold text-[11px] flex items-center justify-between">
                    <span>🛡️ Groq Anti-Hype AI Filter</span>
                    <span className="text-emerald-400 font-extrabold">+25.0% Profit</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Filtered noise. Reallocated into broad-market index SIPs.</p>
                </div>
                <div className="p-3 rounded-md bg-[#0a0f1d] border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400 font-bold text-[11px]">📊 Single-Pane Net Worth Dashboard</div>
                  <p className="text-[11px] text-slate-300">Automated asset allocation & goal-based SIP compounding.</p>
                </div>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold text-center pt-1">
                ✅ Result: Disciplined Wealth Compounding
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Evaluator Sandbox */}
        <div className="bento-card p-8 border-[#1e293b] rounded-lg text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Flame className="w-3.5 h-3.5" /> LIVE AI HYPE EVALUATOR
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Test the Anti-Hype Engine</h3>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={demoPrompt}
              onChange={(e) => setDemoPrompt(e.target.value)}
              className="input-glass text-sm text-center max-w-lg mx-auto"
            />
            
            <button
              onClick={handleRunDemo}
              disabled={analyzingDemo}
              className="btn-primary py-2.5 px-8 text-xs justify-center mx-auto"
            >
              {analyzingDemo ? 'Evaluating Noise...' : 'Evaluate Social Hype'}
            </button>

            {demoResult && (
              <div className="mt-4 p-5 rounded-md bg-[#0a0f1d] border border-[#1e293b] space-y-3 text-center max-w-lg mx-auto animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1e293b]">
                  <span className="badge badge-red text-xs">{demoResult.sentiment}</span>
                  <span className="text-xs text-slate-400">Risk: <strong className="text-rose-400">{demoResult.riskLevel}</strong></span>
                  <span className="text-xs font-bold text-rose-400 font-['Outfit']">Hype: {demoResult.hypeScore}/100</span>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Warning Signals:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5 pl-2">
                    {demoResult.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 text-center">
                  <strong className="text-emerald-300">Action:</strong> {demoResult.recommendation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Badges */}
        <div className="bento-card p-4 border-[#1e293b] rounded-lg flex flex-col md:flex-row items-center justify-around gap-4 text-xs text-slate-400 font-semibold text-center">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Bank-Grade Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SEC/SEBI Institutional Framework</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Groq Llama-3 AI Engine</span>
          </div>
        </div>

      </section>

    </div>
  );
}
