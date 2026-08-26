import React, { useState } from 'react';
import { 
  Sparkles, BrainCircuit, ArrowRight, TrendingUp, ShieldCheck, Zap, Sliders, Layers, Target, Lock, Cpu, RotateCw, BookOpen, Calculator, ShieldAlert, BarChart2, Compass, PieChart, CheckCircle2, DollarSign, FileText, ArrowUpRight
} from 'lucide-react';
import { useUser, SignUpButton } from '@clerk/clerk-react';

export default function LandingPage({ setActiveTab, onOpenAuthModal, onOpenRiskModal }) {
  let isSignedIn = false;
  try {
    const clerk = useUser();
    isSignedIn = clerk?.isSignedIn;
  } catch (e) {}

  // Compounding Interest Slider States
  const [sipAmount, setSipAmount] = useState(35000);
  const [horizonYears, setHorizonYears] = useState(15);
  const [cagrRate, setCagrRate] = useState(14);

  // 3D Flip Card Active States
  const [flippedCard, setFlippedCard] = useState({});

  const toggleFlip = (id) => {
    setFlippedCard(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Real-Time SVG Compounding Curve Generator
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

  // Financial Terms Flashcards Data
  const financialFlashcards = [
    {
      id: 'rule72',
      category: 'INVESTING FORMULA',
      colorClass: 'card-border-indigo',
      term: 'Rule of 72',
      badge: 'Doubling Speed',
      formula: 'Years to Double = 72 ÷ CAGR',
      question: 'How fast will an investment double at 12% CAGR?',
      answer: '• 72 ÷ 12 = 6 Years to double capital.\n• At 15% CAGR = 4.8 Years.',
      calculativeInsight: '★ 15% CAGR cuts doubling time to 4.8 yrs.'
    },
    {
      id: 'rule503020',
      category: 'BUDGETING RATIO',
      colorClass: 'card-border-amber',
      term: '50 / 30 / 20 Rule',
      badge: 'Cashflow Rule',
      formula: '50% Needs + 30% Wants + 20% Wealth SIPs',
      question: 'How should monthly salary be allocated?',
      answer: '• 50% Essential Needs\n• 30% Lifestyle Wants\n• 20% Automated Wealth SIPs',
      calculativeInsight: '★ Fixed Debt / EMIs capped to < 30% net income.'
    },
    {
      id: 'emergencyFund',
      category: 'SAVINGS CUSHION',
      colorClass: 'card-border-emerald',
      term: 'Emergency Buffer Ratio',
      badge: 'Liquidity Guard',
      formula: 'Buffer = 6 × (Fixed Needs + EMIs)',
      question: 'How much liquid cash to reserve before investing?',
      answer: '• 6 Months fixed obligations buffer.\n• 30% Bank Savings + 70% Liquid MFs.',
      calculativeInsight: '★ Prevents forced selling during market dips.'
    },
    {
      id: 'sharpeRatio',
      category: 'RISK BENCHMARK',
      colorClass: 'card-border-rose',
      term: 'Sharpe Ratio',
      badge: 'Alpha Metric',
      formula: 'Sharpe = (Return - RiskFree) ÷ Volatility',
      question: 'How do institutional funds measure risk-adjusted return?',
      answer: '• Sharpe > 1.0 = Strong excess return.\n• Sharpe > 2.0 = Institutional excellence.',
      calculativeInsight: '★ High volatility yields lower Sharpe score.'
    },
    {
      id: 'inflationShield',
      category: 'PURCHASING POWER',
      colorClass: 'card-border-cyan',
      term: 'Real Rate of Return',
      badge: 'CPI Inflation',
      formula: 'Real Return = Nominal CAGR - CPI Inflation (6%)',
      question: 'Why do traditional bank FDs fail to grow wealth?',
      answer: '• 6.5% FD - 6.0% CPI - 30% Tax.\n• Net real return = -1.45% negative yield.',
      calculativeInsight: '★ Equities required to beat long-term CPI inflation.'
    },
    {
      id: 'assetAlloc',
      category: 'PORTFOLIO MIX',
      colorClass: 'card-border-violet',
      term: '100 Minus Age Rule',
      badge: 'Asset Allocation',
      formula: 'Equity Target % = 100 - Current Age',
      question: 'How should asset mix shift over time?',
      answer: '• Age 30: 70% Equity, 20% Debt, 10% Gold.\n• Age 50: 50% Equity, 40% Debt, 10% Gold.',
      calculativeInsight: '★ Rebalance annually to lock in profits.'
    }
  ];

  return (
    <div className="w-full min-h-screen text-[var(--text-main)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center font-sans">
      
      {/* REAL-TIME LIVE MARKET TICKER WIDGET */}
      <div className="w-full bg-[var(--bg-card-inner)] border-b border-[var(--border-card)] py-2 px-4 mb-8 overflow-hidden rounded-[8px] text-center">
        <div className="flex items-center justify-center text-xs font-mono gap-5 overflow-x-auto whitespace-nowrap scrollbar-none mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[var(--text-muted)]">MARKETS:</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <span>NIFTY 50</span>
            <span>22,645.70</span>
            <span className="text-[10px] bg-emerald-500/10 px-1 rounded">▲+0.69%</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <span>S&P 500</span>
            <span>5,214.85</span>
            <span className="text-[10px] bg-emerald-500/10 px-1 rounded">▲+0.93%</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <span>NASDAQ</span>
            <span>16,420.30</span>
            <span className="text-[10px] bg-cyan-500/10 px-1 rounded">▲+1.21%</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>GOLD</span>
            <span>$2,348.60</span>
            <span className="text-[10px] bg-amber-500/10 px-1 rounded">▲+0.95%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01 // OVERVIEW HERO VIEW                                         */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto pt-8 pb-10 mb-24">
        
        {/* Section Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-indigo-400 text-xs font-bold shadow-md mb-6 mx-auto justify-center font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SECTION 01 // WEALTHTECH OVERVIEW</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight max-w-3xl mx-auto text-center">
          Turn Finfluencer Noise into <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Actionable Wealth</span>
        </h1>

        {/* Short Precise Subtext */}
        <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] font-semibold max-w-xl mx-auto text-center">
          Risk Profiling • Multi-Asset Vault • Goal SIPs • AI Social Audit
        </p>

        {/* STRICT SMALL INLINE PIXEL IMAGE */}
        <div className="mt-6 mb-4 flex justify-center mx-auto">
          <img 
            src="/images/ticker_banner.jpg" 
            alt="Real-time Stock Market Banner" 
            style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-card)' }}
            className="hover:scale-105 transition-transform duration-300 shadow-sm"
          />
        </div>

        {/* Center CTA Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 mx-auto">
          {isSignedIn ? (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-full shadow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-full shadow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20">
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </SignUpButton>
          )}
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 02 // PROOF METRICS                                              */}
      {/* ========================================================================= */}
      <section className="mb-24 text-center">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 mx-auto">
            SECTION 02 // VERIFIED PROOF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight text-center">
              $48M+
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1.5 text-center">
              Assets Verified
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight text-center">
              14,200+
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1.5 text-center">
              Portfolios Protected
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:border-cyan-400/50 transition-all">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight text-center">
              98.4%
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1.5 text-center">
              Filtering Accuracy
            </div>
          </div>

        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 03 // RISK PROFILING ENGINE                                       */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 mx-auto">
            SECTION 03 // RISK PROFILING
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Institutional Risk Banding
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            SEBI/SEC Risk Scoring • Max Loss Limits • Equity Target
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-5 sm:p-6 shadow-md text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center">
            
            {/* STRICT SMALL INLINE PIXEL IMAGE */}
            <div className="lg:col-span-5 flex justify-center mx-auto">
              <img 
                src="/images/risk_journey.jpg" 
                alt="Institutional Risk Profile Gauge" 
                style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-card)' }}
                className="hover:scale-105 transition-transform duration-300 shadow-sm"
              />
            </div>

            {/* Content & Action */}
            <div className="lg:col-span-7 space-y-3 text-center flex flex-col items-center justify-center mx-auto">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] text-center">
                Quantified Risk Limits
              </h3>

              <div className="w-full grid grid-cols-2 gap-2 text-xs font-bold text-[var(--text-main)] text-center">
                <div className="p-2 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[9px] text-[var(--text-muted)] uppercase text-center">Drawdown Limit</div>
                  <div className="text-rose-400 text-xs mt-0.5 font-bold text-center">-15% Cap</div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[9px] text-[var(--text-muted)] uppercase text-center">Equity Mix</div>
                  <div className="text-emerald-400 text-xs mt-0.5 font-bold text-center">70% Target</div>
                </div>
              </div>

              {onOpenRiskModal && (
                <button
                  onClick={onOpenRiskModal}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-400/30 mx-auto"
                >
                  <span>2-Min Risk Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 04 // AI TAX OPTIMIZER & WEALTH ADVISOR                          */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 mx-auto">
            SECTION 04 // AI TAX OPTIMIZER
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Smart Tax Deductions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            Sec 80C ELSS • Sec 80D Health • Tax-Loss Harvesting
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-5 sm:p-6 shadow-md text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center">
            
            {/* Content & Action */}
            <div className="lg:col-span-7 space-y-3 text-center flex flex-col items-center justify-center order-2 lg:order-1 mx-auto">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] text-center">
                Tax Liability Reduction
              </h3>

              <div className="w-full grid grid-cols-3 gap-1.5 text-xs font-bold text-[var(--text-main)] text-center">
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">80C ELSS</div>
                  <div className="text-emerald-400 text-[11px] mt-0.5 font-bold text-center">₹1.5L</div>
                </div>
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">80D Health</div>
                  <div className="text-cyan-400 text-[11px] mt-0.5 font-bold text-center">₹75k</div>
                </div>
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">Saved</div>
                  <div className="text-amber-400 text-[11px] mt-0.5 font-bold text-center">₹1.12L</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('analyzer')}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400/30 mx-auto"
              >
                <span>Run AI Tax Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* STRICT SMALL INLINE PIXEL IMAGE */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 mx-auto">
              <img 
                src="/images/tax_advisor.jpg" 
                alt="AI Tax Optimizer Dashboard" 
                style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-card)' }}
                className="hover:scale-105 transition-transform duration-300 shadow-sm"
              />
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 05 // PORTFOLIO CONSOLIDATION VAULT                              */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 mx-auto">
            SECTION 05 // MULTI-ASSET VAULT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Portfolio Consolidation
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            Stocks • Mutual Funds • Gold • Crypto • Real Estate
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-5 sm:p-6 shadow-md text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center">
            
            {/* STRICT SMALL INLINE PIXEL IMAGE */}
            <div className="lg:col-span-5 flex justify-center mx-auto">
              <img 
                src="/images/portfolio_journey.jpg" 
                alt="Portfolio Vault Dashboard" 
                style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-card)' }}
                className="hover:scale-105 transition-transform duration-300 shadow-sm"
              />
            </div>

            {/* Content & Action */}
            <div className="lg:col-span-7 space-y-3 text-center flex flex-col items-center justify-center mx-auto">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <PieChart className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] text-center">
                Single-Pane Net Worth Vault
              </h3>

              <div className="w-full grid grid-cols-3 gap-1.5 text-xs font-bold text-[var(--text-main)] text-center">
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">Stocks</div>
                  <div className="text-indigo-400 text-[11px] mt-0.5 font-bold text-center">45%</div>
                </div>
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">MFs</div>
                  <div className="text-emerald-400 text-[11px] mt-0.5 font-bold text-center">30%</div>
                </div>
                <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-slate-400 uppercase text-center">Gold/Debt</div>
                  <div className="text-amber-400 text-[11px] mt-0.5 font-bold text-center">25%</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/30 mx-auto"
              >
                <span>Launch Asset Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 06 // GOAL-BASED SIP PLANNING ENGINE                             */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 mx-auto">
            SECTION 06 // GOAL ROADMAP
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Goal-Based SIP Engine
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            Retirement • Home Purchase • Child Education
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-5 sm:p-6 shadow-md text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center">
            
            {/* Content & Action */}
            <div className="lg:col-span-7 space-y-3 text-center flex flex-col items-center justify-center order-2 lg:order-1 mx-auto">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Target className="w-4 h-4 text-cyan-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] text-center">
                Inflation-Adjusted SIPs
              </h3>

              <div className="w-full grid grid-cols-2 gap-2 text-xs font-bold text-[var(--text-main)] text-center">
                <div className="p-2 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-[var(--text-muted)] uppercase text-center">Retirement SIP</div>
                  <div className="text-cyan-400 text-xs mt-0.5 font-bold text-center">₹45k/mo</div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[8px] text-[var(--text-muted)] uppercase text-center">Home Downpayment</div>
                  <div className="text-amber-400 text-xs mt-0.5 font-bold text-center">₹25k/mo</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('goals')}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-cyan-400/30 mx-auto"
              >
                <span>Plan Goal Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* STRICT SMALL INLINE PIXEL IMAGE */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 mx-auto">
              <img 
                src="/images/goal_journey.jpg" 
                alt="Goal Planning Roadmap" 
                style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-card)' }}
                className="hover:scale-105 transition-transform duration-300 shadow-sm"
              />
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 07 // COLOUR-MARKED 3D FINANCIAL TERM FLASHCARDS DECK             */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider px-3 py-1 rounded bg-violet-500/10 border border-violet-500/20 mx-auto">
            SECTION 07 // INTERACTIVE FLASHCARDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Core Wealth Flashcards
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            Click any flashcard to flip answer & formula
          </p>
        </div>

        {/* 3D Flip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {financialFlashcards.map((fc) => (
            <div 
              key={fc.id}
              onClick={() => toggleFlip(fc.id)}
              className="perspective-1000 h-[260px] w-full cursor-pointer group"
            >
              <div 
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  flippedCard[fc.id] ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT SIDE */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-[8px] p-5 flex flex-col justify-between text-center items-center bg-[var(--bg-card)] ${fc.colorClass}`}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {fc.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {fc.badge}
                    </span>
                  </div>

                  <div className="my-auto space-y-1.5 text-center">
                    <h3 className="text-lg font-bold text-[var(--text-main)] text-center">
                      {fc.term}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed text-center">
                      {fc.question}
                    </p>
                    <div className="p-1.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-[10px] font-mono text-cyan-300 font-semibold text-center">
                      {fc.formula}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between w-full text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Flip Answer</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[8px] p-5 flex flex-col justify-between text-center items-center bg-[var(--bg-card-inner)] ${fc.colorClass}`}>
                  <div className="flex items-center justify-between w-full border-b border-[var(--border-card)] pb-1">
                    <span className="text-[10px] font-bold text-emerald-400">
                      Calculation
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">Verified</span>
                  </div>

                  <div className="my-auto space-y-1.5 text-xs text-[var(--text-main)] leading-relaxed font-semibold text-center">
                    <p className="whitespace-pre-line text-center">{fc.answer}</p>
                    <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-bold text-center">
                      {fc.calculativeInsight}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between w-full text-xs font-bold text-emerald-400">
                    <span>Return to Question</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 08 // WEALTH BUILDING PRINCIPLES                                  */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6 text-center">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 mx-auto">
            SECTION 08 // WEALTH PRINCIPLES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] text-center">
            Investing, Saving & Budgeting
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
            CAGR Growth • Emergency Cushion • 50/30/20 Rule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Investing */}
          <div className="bento-module-card p-5 text-center space-y-3 flex flex-col justify-between items-center rounded-[8px]">
            <div className="space-y-2.5 w-full text-center flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <span className="badge badge-green text-[9px]">Investing</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                  Asset Mix & CAGR
                </h3>
              </div>

              {/* STRICT SMALL INLINE PIXEL IMAGE */}
              <div className="flex justify-center mx-auto">
                <img 
                  src="/images/wealth_compounding.jpg" 
                  alt="Wealth Compounding Chart" 
                  style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-card)' }}
                  className="hover:scale-105 transition-transform duration-300 shadow-sm"
                />
              </div>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• <strong>Rule of 72:</strong> 72 ÷ CAGR yrs</li>
                <li>• <strong>Sharpe:</strong> Excess alpha</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Saving */}
          <div className="bento-module-card p-5 text-center space-y-3 flex flex-col justify-between items-center rounded-[8px]">
            <div className="space-y-2.5 w-full text-center flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <span className="badge badge-blue text-[9px]">Saving</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                  Asset Vault
                </h3>
              </div>

              {/* STRICT SMALL INLINE PIXEL IMAGE */}
              <div className="flex justify-center mx-auto">
                <img 
                  src="/images/asset_vault.jpg" 
                  alt="Asset Vault Breakdown" 
                  style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-card)' }}
                  className="hover:scale-105 transition-transform duration-300 shadow-sm"
                />
              </div>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• <strong>Emergency:</strong> 6x Needs</li>
                <li>• <strong>Yield:</strong> Rate - 6% CPI</li>
              </ul>
            </div>
          </div>

          {/* Card 3: Anti-Hype AI Audit */}
          <div className="bento-module-card p-5 text-center space-y-3 flex flex-col justify-between items-center rounded-[8px]">
            <div className="space-y-2.5 w-full text-center flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <span className="badge badge-amber text-[9px]">AI Audit</span>
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                  AI Stock Audit
                </h3>
              </div>

              {/* STRICT SMALL INLINE PIXEL IMAGE */}
              <div className="flex justify-center mx-auto">
                <img 
                  src="/images/ai_radar.jpg" 
                  alt="AI Stock Audit Shield" 
                  style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-card)' }}
                  className="hover:scale-105 transition-transform duration-300 shadow-sm"
                />
              </div>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• <strong>50/30/20:</strong> Needs/Wants/SIPs</li>
                <li>• <strong>Cap:</strong> &lt; 30% Net Pay</li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 09 // DYNAMIC COMPOUNDING ENGINE                                  */}
      {/* ========================================================================= */}
      <section className="mb-24 text-center">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 mx-auto">
            SECTION 09 // COMPOUNDING ENGINE
          </span>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-5 sm:p-8 shadow-md text-center">
          
          <div className="flex items-center gap-2 mb-6 justify-center text-center">
            <Sliders className="w-4.5 h-4.5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] text-center">
              Compounding Simulator
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-center">
            
            {/* Slider Controls */}
            <div className="lg:col-span-5 space-y-4 bg-[var(--bg-card-inner)] p-5 rounded-[6px] border border-[var(--border-card)] text-center">
              
              <div className="space-y-1 text-center">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Monthly SIP</span>
                  <span className="text-emerald-400 font-mono text-xs font-bold">₹{sipAmount.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-1 text-center">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Horizon</span>
                  <span className="text-cyan-400 font-mono text-xs font-bold">{horizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1 text-center">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Expected CAGR</span>
                  <span className="text-amber-400 font-mono text-xs font-bold">{cagrRate}% P.A.</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={cagrRate}
                  onChange={(e) => setCagrRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-center">
                <div className="text-center">
                  <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Projected Corpus</div>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">
                    ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div className="text-right text-[11px] text-[var(--text-muted)] space-y-0.5">
                  <div>Invested: ₹{(totalInvested / 100000).toFixed(1)}L</div>
                  <div className="text-emerald-400 font-bold">Gain: ₹{(totalGain / 100000).toFixed(1)}L</div>
                </div>
              </div>

            </div>

            {/* Dynamic Real-Time Bending SVG Chart */}
            <div className="lg:col-span-7 space-y-2.5 text-center">
              <div className="flex justify-between items-center text-[11px] font-bold text-[var(--text-muted)] uppercase">
                <span>GROWTH CURVE ({horizonYears} YRS)</span>
                <span className="text-emerald-400 font-mono">{cagrRate}% CAGR</span>
              </div>

              <div className="relative w-full h-60 bg-[var(--bg-card-inner)] p-3 rounded-[6px] border border-[var(--border-card)] flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    <linearGradient id="curveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <line x1="24" y1="50" x2="476" y2="50" stroke="var(--border-card)" strokeDasharray="4 4" />
                  <line x1="24" y1="100" x2="476" y2="100" stroke="var(--border-card)" strokeDasharray="4 4" />
                  <line x1="24" y1="150" x2="476" y2="150" stroke="var(--border-card)" strokeDasharray="4 4" />

                  <path d={areaD} fill="url(#curveAreaGrad)" transition="all 0.15s ease-out" />

                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#curveLineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ transition: 'd 0.15s ease-out' }}
                  />

                  {lastPoint && (
                    <g className="animate-pulse">
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="6" fill="#10b981" />
                      <circle cx={lastPoint.x} cy={lastPoint.y} r="12" fill="#10b981" opacity="0.25" />
                    </g>
                  )}
                </svg>

                <div className="absolute top-2.5 right-2.5 bg-[var(--bg-card)] px-2.5 py-0.5 rounded border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                  ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-6" />

      {/* ========================================================================= */}
      {/* SECTION 10 // PLATFORM CAPABILITIES                                      */}
      {/* ========================================================================= */}
      <section className="mb-24 text-center">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 mx-auto">
            SECTION 10 // PLATFORM CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="bento-module-card p-5 flex flex-col justify-between text-center items-center cursor-pointer group min-h-[260px] rounded-[8px]"
          >
            <div className="space-y-2.5 w-full flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-[6px] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
              </div>
              
              <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                Anti-Hype AI Detection
              </h3>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• Real-time Groq social audit</li>
                <li>• Automated SEBI/SEC risk scoring</li>
                <li>• Instant pump & dump detection</li>
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Explore AI Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="bento-module-card p-5 flex flex-col justify-between text-center items-center cursor-pointer group min-h-[260px] rounded-[8px]"
          >
            <div className="space-y-2.5 w-full flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-[6px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                Consolidated Asset Vault
              </h3>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• Single-pane multi-asset vault</li>
                <li>• Unified net worth tracking</li>
                <li>• Real-time portfolio rebalancing</li>
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Asset Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('goals')}
            className="bento-module-card p-5 flex flex-col justify-between text-center items-center cursor-pointer group min-h-[260px] rounded-[8px]"
          >
            <div className="space-y-2.5 w-full flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-[6px] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Target className="w-4 h-4 text-cyan-400" />
              </div>

              <h3 className="text-base font-bold text-[var(--text-main)] text-center">
                Automated Goal Engine
              </h3>

              <ul className="space-y-1 text-xs text-[var(--text-muted)] font-semibold text-center w-full">
                <li>• Inflation-adjusted target goals</li>
                <li>• Dynamic SIP compounding curve</li>
                <li>• Automated wealth accumulation</li>
              </ul>
            </div>

            <div className="pt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Plan Goal SIPs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER BADGES */}
      <footer className="pb-12 pt-6 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-[var(--text-muted)] text-center">
        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Institutional Grade Encryption</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>SEC/SEBI Institutional Framework</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Groq AI Engine</span>
        </div>
      </footer>

    </div>
  );
}
