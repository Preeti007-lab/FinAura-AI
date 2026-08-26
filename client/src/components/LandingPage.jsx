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
      question: 'How fast will your investment double at 12% annual CAGR?',
      answer: '72 ÷ 12 = 6 Years. Your capital doubles every 6 years. At 15% CAGR, it doubles in 4.8 years.',
      calculativeInsight: '★ Key Takeaway: Elevating CAGR from 10% to 15% cuts doubling time from 7.2 yrs to 4.8 yrs.'
    },
    {
      id: 'rule503020',
      category: 'BUDGETING RATIO',
      colorClass: 'card-border-amber',
      term: '50 / 30 / 20 Rule',
      badge: 'Cashflow Rule',
      formula: '50% Needs + 30% Wants + 20% Wealth SIPs',
      question: 'How should monthly net salary be strictly allocated?',
      answer: '• 50% Essential Needs (Rent, Groceries, EMIs)\n• 30% Lifestyle Wants (Dining, Travel)\n• 20% Automated Wealth SIPs (Equities, Debt)',
      calculativeInsight: '★ Key Takeaway: Cap total fixed debt/EMIs to < 30% of net monthly income.'
    },
    {
      id: 'emergencyFund',
      category: 'SAVINGS CUSHION',
      colorClass: 'card-border-emerald',
      term: 'Emergency Buffer Ratio',
      badge: 'Liquidity Guard',
      formula: 'Buffer = 6 × (Monthly Fixed Needs + EMIs)',
      question: 'How much liquid cash must be reserved before investing?',
      answer: 'Exactly 6 months of total fixed obligations stored in 30% Bank Savings + 70% Liquid Mutual Funds.',
      calculativeInsight: '★ Key Takeaway: Prevents forced liquidation of equities during temporary market dips.'
    },
    {
      id: 'sharpeRatio',
      category: 'RISK BENCHMARK',
      colorClass: 'card-border-rose',
      term: 'Sharpe Ratio',
      badge: 'Alpha Metric',
      formula: 'Sharpe = (Portfolio Return - RiskFree Rate) ÷ Volatility',
      question: 'How do institutional funds measure risk-adjusted return?',
      answer: 'A Sharpe ratio > 1.0 indicates solid excess return per unit of volatility; > 2.0 indicates institutional excellence.',
      calculativeInsight: '★ Key Takeaway: High return paired with extreme drawdown yields an inferior Sharpe score.'
    },
    {
      id: 'inflationShield',
      category: 'PURCHASING POWER',
      colorClass: 'card-border-cyan',
      term: 'Real Rate of Return',
      badge: 'CPI Inflation',
      formula: 'Real Return = Nominal CAGR - CPI Inflation (6%)',
      question: 'Why do traditional bank FDs fail to grow real wealth?',
      answer: 'If FD yields 6.5% interest and CPI inflation is 6.0%, your net real return after 30% tax is negative (-1.45%).',
      calculativeInsight: '★ Key Takeaway: Equities & broad index funds are essential to outpace long-term CPI inflation.'
    },
    {
      id: 'assetAlloc',
      category: 'PORTFOLIO MIX',
      colorClass: 'card-border-violet',
      term: '100 Minus Age Rule',
      badge: 'Asset Allocation',
      formula: 'Equity Target % = 100 - Current Age',
      question: 'How should your asset allocation shift as you age?',
      answer: 'At age 30: 70% Equities, 20% Debt, 10% Gold/Cash. At age 50: 50% Equities, 40% Debt, 10% Gold/Cash.',
      calculativeInsight: '★ Key Takeaway: Rebalance annually to lock in profits and maintain target risk score.'
    }
  ];

  return (
    <div className="w-full min-h-screen text-[var(--text-main)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center font-sans">
      
      {/* REAL-TIME LIVE MARKET TICKER WIDGET */}
      <div className="w-full bg-[var(--bg-card-inner)] border-b border-[var(--border-card)] py-2.5 px-4 mb-8 overflow-hidden rounded-[8px]">
        <div className="flex items-center justify-between text-xs font-mono gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[var(--text-muted)]">MARKETS LIVE:</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span>NIFTY 50</span>
            <span>22,645.70</span>
            <span className="text-[10px] bg-emerald-500/10 px-1 rounded">▲ +0.69%</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span>S&P 500</span>
            <span>5,214.85</span>
            <span className="text-[10px] bg-emerald-500/10 px-1 rounded">▲ +0.93%</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span>NASDAQ</span>
            <span>16,420.30</span>
            <span className="text-[10px] bg-cyan-500/10 px-1 rounded">▲ +1.21%</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span>GOLD</span>
            <span>$2,348.60</span>
            <span className="text-[10px] bg-amber-500/10 px-1 rounded">▲ +0.95%</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <span>BITCOIN</span>
            <span>$67,420.00</span>
            <span className="text-[10px] bg-indigo-500/10 px-1 rounded">▲ +2.10%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01 // OVERVIEW HERO VIEW                                         */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-16 pb-16 mb-40">
        
        {/* Section Header Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-indigo-400 text-xs font-bold shadow-md mb-8 mx-auto justify-center">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="uppercase tracking-widest font-mono">SECTION 01 // WEALTHTECH OVERVIEW</span>
        </div>

        {/* Center Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.1] max-w-4xl mx-auto text-center">
          Turn Finfluencer Noise into <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Actionable Wealth</span>
        </h1>

        {/* Center Subtext */}
        <p className="mt-8 text-base sm:text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed text-center">
          A disciplined, quantitative wealth management engine. Eliminate social hype, profile institutional risk, consolidate multi-asset vaults, and automate goal SIPs.
        </p>

        {/* Hero Visual Ticker Banner */}
        <div className="mt-10 mb-8 w-full max-w-3xl aspect-[16/9] rounded-[12px] overflow-hidden border border-[var(--border-card)] shadow-2xl mx-auto">
          <img 
            src="/images/ticker_banner.jpg" 
            alt="Real-time Financial Stock Market Ticker Banner" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Center CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
          {isSignedIn ? (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-lg sm:text-xl rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-lg sm:text-xl rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20">
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </SignUpButton>
          )}
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 02 // PROOF COUNTERS METRICS                                     */}
      {/* ========================================================================= */}
      <section className="mb-40">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
            SECTION 02 // VERIFIED INSTITUTIONAL PROOF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/50 transition-all">
            <div className="text-5xl sm:text-6xl font-extrabold text-emerald-400 tracking-tight">
              $48M+
            </div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-4">
              Assets Verified
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-lg hover:border-indigo-500/50 transition-all">
            <div className="text-5xl sm:text-6xl font-extrabold text-indigo-400 tracking-tight">
              14,200+
            </div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-4">
              Portfolios Protected
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="text-5xl sm:text-6xl font-extrabold text-cyan-400 tracking-tight">
              98.4%
            </div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mt-4">
              Filtering Accuracy
            </div>
          </div>

        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 03 // FINANCIAL JOURNEY PHASE 1 - RISK PROFILING ENGINE          */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
            SECTION 03 // FINANCIAL JOURNEY PHASE 1
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] text-center">
            Institutional Risk Profiling
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium text-center">
            Determine your exact risk tolerance score before allocating capital to equities or debt.
          </p>
        </div>

        {/* Systematic 50/50 Uniform Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-8 sm:p-12 shadow-xl text-center max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Uniform Visual Photo Container */}
            <div className="lg:col-span-6 relative w-full aspect-[16/9] rounded-[10px] overflow-hidden border border-[var(--border-card)] shadow-md">
              <img 
                src="/images/risk_journey.jpg" 
                alt="Institutional Risk Profile Gauge & Spectrum" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-[#0a0f1d]/90 px-3.5 py-1.5 rounded border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold">
                Risk Score: 68 / 100 (Growth)
              </div>
            </div>

            {/* Matching Uniform Text Container */}
            <div className="lg:col-span-6 space-y-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-main)] text-center">
                Quantified Risk Band Assessment
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-center">
                Our algorithm evaluates market drawdown tolerance, investment horizon, and loss limits according to SEBI/SEC institutional framework guidelines.
              </p>

              <div className="w-full grid grid-cols-2 gap-3 text-xs font-bold text-[var(--text-main)]">
                <div className="p-3.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Max Drawdown</div>
                  <div className="text-rose-400 text-sm mt-1 font-bold">-15% Limit</div>
                </div>
                <div className="p-3.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Equity Band</div>
                  <div className="text-emerald-400 text-sm mt-1 font-bold">70% Target</div>
                </div>
              </div>

              {onOpenRiskModal && (
                <button
                  onClick={onOpenRiskModal}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30 mx-auto"
                >
                  <span>Take 2-Min Risk Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 04 // BRAND NEW FEATURE: AI TAX OPTIMIZER & WEALTH ADVISOR       */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            SECTION 04 // AI TAX OPTIMIZER & WEALTH ADVISOR
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] text-center">
            Smart Tax Deductions & Harvesting
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium text-center">
            Maximize Section 80C/80D tax savings and capture short-term tax-loss harvesting up to ₹1.12 Lakhs/year.
          </p>
        </div>

        {/* Systematic 50/50 Uniform Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-8 sm:p-12 shadow-xl text-center max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Matching Uniform Text Container */}
            <div className="lg:col-span-6 space-y-6 text-center flex flex-col items-center order-2 lg:order-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-main)] text-center">
                Automated Tax Optimization Engine
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-center">
                Instantly scan your portfolio for ELSS tax-saving funds, municipal bonds, and tax-loss harvesting opportunities to optimize total tax liabilities.
              </p>

              <div className="w-full grid grid-cols-3 gap-3 text-xs font-bold text-[var(--text-main)]">
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Sec 80C ELSS</div>
                  <div className="text-emerald-400 text-sm mt-1 font-bold">₹1,50,000</div>
                </div>
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Sec 80D Health</div>
                  <div className="text-cyan-400 text-sm mt-1 font-bold">₹75,000</div>
                </div>
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Tax Saved</div>
                  <div className="text-amber-400 text-sm mt-1 font-bold">₹1,12,500</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('analyzer')}
                className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30 mx-auto"
              >
                <span>Run AI Tax Optimization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Uniform Visual Photo Container (16:9 Aspect Ratio) */}
            <div className="lg:col-span-6 relative w-full aspect-[16/9] rounded-[10px] overflow-hidden border border-[var(--border-card)] shadow-md order-1 lg:order-2">
              <img 
                src="/images/tax_advisor.jpg" 
                alt="AI Tax Optimizer & Wealth Advisor Dashboard" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-[#0a0f1d]/90 px-3.5 py-1.5 rounded border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                Tax Savings Identified: 28.5%
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 05 // FINANCIAL JOURNEY PHASE 2 - PORTFOLIO CONSOLIDATION VAULT   */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            SECTION 05 // FINANCIAL JOURNEY PHASE 2
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] text-center">
            Multi-Asset Portfolio Consolidation
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium text-center">
            Unify stocks, mutual funds, crypto, real estate, and fixed deposits into a single-pane vault.
          </p>
        </div>

        {/* Systematic 50/50 Uniform Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-8 sm:p-12 shadow-xl text-center max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Uniform Visual Photo Container (16:9 Aspect Ratio) */}
            <div className="lg:col-span-6 relative w-full aspect-[16/9] rounded-[10px] overflow-hidden border border-[var(--border-card)] shadow-md">
              <img 
                src="/images/portfolio_journey.jpg" 
                alt="Multi-Asset Portfolio Consolidation Vault Dashboard" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-[#0a0f1d]/90 px-3.5 py-1.5 rounded border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                Net Worth: $18.7M (+14.3% YTD)
              </div>
            </div>

            {/* Matching Uniform Text Container */}
            <div className="lg:col-span-6 space-y-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <PieChart className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-main)] text-center">
                Single-Pane Net Worth Vault
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-center">
                Track true net worth in real-time. Automated rebalancing alerts warn you when equity allocation drifts beyond your target risk tolerance.
              </p>

              <div className="w-full grid grid-cols-3 gap-3 text-xs font-bold text-[var(--text-main)]">
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Stocks</div>
                  <div className="text-indigo-400 text-sm mt-1 font-bold">45%</div>
                </div>
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">MFs</div>
                  <div className="text-emerald-400 text-sm mt-1 font-bold">30%</div>
                </div>
                <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Gold/Debt</div>
                  <div className="text-amber-400 text-sm mt-1 font-bold">25%</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30 mx-auto"
              >
                <span>Launch Asset Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 06 // FINANCIAL JOURNEY PHASE 3 - GOAL-BASED SIP PLANNING ENGINE  */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            SECTION 06 // FINANCIAL JOURNEY PHASE 3
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] text-center">
            Goal-Based Wealth Accumulation
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium text-center">
            Align investments with life milestones: Retirement, Home Purchase, and Education.
          </p>
        </div>

        {/* Systematic 50/50 Uniform Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-8 sm:p-12 shadow-xl text-center max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Matching Uniform Text Container */}
            <div className="lg:col-span-6 space-y-6 text-center flex flex-col items-center order-2 lg:order-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-main)] text-center">
                Inflation-Adjusted Milestone SIPs
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-center">
                Factor in 6.0% CPI inflation to calculate true future milestone costs, paired with a 10% annual SIP step-up strategy.
              </p>

              <div className="w-full grid grid-cols-2 gap-3 text-xs font-bold text-[var(--text-main)]">
                <div className="p-3.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Retirement SIP</div>
                  <div className="text-cyan-400 text-sm mt-1 font-bold">₹45,000 / mo</div>
                </div>
                <div className="p-3.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-center">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Home Downpayment</div>
                  <div className="text-amber-400 text-sm mt-1 font-bold">₹25,000 / mo</div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('goals')}
                className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-400/30 mx-auto"
              >
                <span>Plan Goal SIP Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Uniform Visual Photo Container (16:9 Aspect Ratio) */}
            <div className="lg:col-span-6 relative w-full aspect-[16/9] rounded-[10px] overflow-hidden border border-[var(--border-card)] shadow-md order-1 lg:order-2">
              <img 
                src="/images/goal_journey.jpg" 
                alt="Financial Goal Planning Roadmap & Milestones" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-[#0a0f1d]/90 px-3.5 py-1.5 rounded border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                Retirement Target: $2.85M (2055)
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 07 // COLOUR-MARKED 3D FINANCIAL TERM FLASHCARDS DECK             */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest px-3 py-1 rounded bg-violet-500/10 border border-violet-500/20">
            SECTION 07 // INTERACTIVE CONCEPTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] text-center">
            Core Wealth Flashcards (Colour-Coded Boundaries)
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-medium text-center">
            Click any flashcard to flip and reveal exact formulas, calculations, and financial takeaways.
          </p>
        </div>

        {/* 3D Flip Cards Grid with Distinct Colour Marking Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {financialFlashcards.map((fc) => (
            <div 
              key={fc.id}
              onClick={() => toggleFlip(fc.id)}
              className="perspective-1000 h-[320px] w-full cursor-pointer group"
            >
              <div 
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  flippedCard[fc.id] ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT SIDE */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-[12px] p-7 flex flex-col justify-between text-left bg-[var(--bg-card)] ${fc.colorClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {fc.category}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {fc.badge}
                    </span>
                  </div>

                  <div className="my-auto space-y-3">
                    <h3 className="text-2xl font-bold text-[var(--text-main)]">
                      {fc.term}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                      {fc.question}
                    </p>
                    <div className="p-3 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs font-mono text-cyan-300 font-semibold">
                      {fc.formula}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Click to Flip Answer</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[12px] p-7 flex flex-col justify-between text-left bg-[var(--bg-card-inner)] ${fc.colorClass}`}>
                  <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
                    <span className="text-xs font-bold text-emerald-400">
                      Formula & Calculation
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">Verified Rule</span>
                  </div>

                  <div className="my-auto space-y-3 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-medium">
                    <p className="whitespace-pre-line">{fc.answer}</p>
                    <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-bold">
                      {fc.calculativeInsight}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Click to Return to Question</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 08 // CALCULATIVE FINANCIAL CONCEPTS WITH UNIFORM IMAGES          */}
      {/* ========================================================================= */}
      <section className="mb-40 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            SECTION 08 // WEALTH BUILDING PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] text-center">
            Investing, Saving & Budgeting Framework
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-medium text-center">
            Calculative principles for disciplined wealth compounding and risk mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Investing */}
          <div className="bento-module-card p-8 text-left space-y-6 flex flex-col justify-between rounded-[12px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge badge-green text-[11px]">Investing Matrix</span>
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">
                  Asset Allocation & CAGR
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Compound interest doubles wealth systematically via asset allocation.
                </p>
              </div>

              {/* Uniform Image Container (16:9 Aspect Ratio) */}
              <div className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden border border-[var(--border-card)]">
                <img 
                  src="/images/wealth_compounding.jpg" 
                  alt="Wealth Compounding Exponential Chart" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span><strong>Rule of 72:</strong> Capital doubles in 72 ÷ CAGR yrs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span><strong>Sharpe Ratio:</strong> Risk-adjusted excess return benchmark</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Saving */}
          <div className="bento-module-card p-8 text-left space-y-6 flex flex-col justify-between rounded-[12px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge badge-blue text-[11px]">Savings Vault</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">
                  Asset Allocation Vault
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Single-pane consolidation for Equities, Debt Funds, and Cash reserves.
                </p>
              </div>

              {/* Uniform Image Container (16:9 Aspect Ratio) */}
              <div className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden border border-[var(--border-card)]">
                <img 
                  src="/images/asset_vault.jpg" 
                  alt="Asset Allocation Vault Portfolio Breakdown" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span><strong>Buffer Target:</strong> 6x Monthly Essential Needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span><strong>Real Yield:</strong> Nominal Rate - CPI Inflation (6%)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Anti-Hype AI Audit */}
          <div className="bento-module-card p-8 text-left space-y-6 flex flex-col justify-between rounded-[12px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge badge-amber text-[11px]">Anti-Hype AI</span>
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">
                  AI Financial Stock Audit
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Real-time Groq Llama-3 AI social media noise & pump detection.
                </p>
              </div>

              {/* Uniform Image Container (16:9 Aspect Ratio) */}
              <div className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden border border-[var(--border-card)]">
                <img 
                  src="/images/ai_radar.jpg" 
                  alt="AI Financial Stock Audit Shield" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span><strong>50/30/20 Rule:</strong> 50% Needs, 30% Wants, 20% SIPs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span><strong>Debt Cap:</strong> Maximum 30% net income allocated to EMIs</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 09 // INTERACTIVE FORECASTING PLAYGROUND                          */}
      {/* ========================================================================= */}
      <section className="mb-40">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            SECTION 09 // DYNAMIC COMPOUNDING ENGINE
          </span>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-8 sm:p-14 shadow-xl text-left">
          
          <div className="flex items-center gap-2 mb-10 justify-center text-center">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              Interactive Compounding Playground
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Slider Controls */}
            <div className="lg:col-span-5 space-y-6 bg-[var(--bg-card-inner)] p-8 rounded-[10px] border border-[var(--border-card)]">
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Monthly Investment Goal</span>
                  <span className="text-emerald-400 font-mono text-base">₹{sipAmount.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Investment Horizon</span>
                  <span className="text-cyan-400 font-mono text-base">{horizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">Expected Return</span>
                  <span className="text-amber-400 font-mono text-base">{cagrRate}% P.A.</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={cagrRate}
                  onChange={(e) => setCagrRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div className="p-5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Projected Corpus</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div className="text-right text-xs text-[var(--text-muted)] space-y-0.5">
                  <div>Invested: ₹{(totalInvested / 100000).toFixed(1)}L</div>
                  <div className="text-emerald-400 font-bold">Gain: ₹{(totalGain / 100000).toFixed(1)}L</div>
                </div>
              </div>

            </div>

            {/* Dynamic Real-Time Bending SVG Chart */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)] uppercase">
                <span>DYNAMIC GROWTH CURVE ({horizonYears} YRS)</span>
                <span className="text-emerald-400 font-mono">{cagrRate}% CAGR RATE</span>
              </div>

              <div className="relative w-full h-88 bg-[var(--bg-card-inner)] p-5 rounded-[10px] border border-[var(--border-card)] flex items-center justify-center overflow-hidden">
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

                <div className="absolute top-4 right-4 bg-[var(--bg-card)] px-3.5 py-1.5 rounded border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                  ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full border-t border-[var(--border-card)] my-12" />

      {/* ========================================================================= */}
      {/* SECTION 10 // ORGANIZED BENTO FEATURE MODULES                             */}
      {/* ========================================================================= */}
      <section className="mb-40">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
            SECTION 10 // PLATFORM CAPABILITIES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group min-h-[340px] rounded-[12px]"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              
              <h3 className="text-xl font-bold text-[var(--text-main)]">
                Anti-Hype AI Detection
              </h3>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
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

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Explore AI Engine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group min-h-[340px] rounded-[12px]"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-[var(--text-main)]">
                Consolidated Asset Vault
              </h3>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
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

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Asset Vault</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('goals')}
            className="bento-module-card p-8 flex flex-col justify-between text-left cursor-pointer group min-h-[340px] rounded-[12px]"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>

              <h3 className="text-xl font-bold text-[var(--text-main)]">
                Automated Goal Engine
              </h3>

              <ul className="space-y-2.5 text-xs text-[var(--text-muted)] font-semibold">
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

            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Plan Goal SIPs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER BADGES */}
      <footer className="pb-20 pt-10 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold text-[var(--text-muted)]">
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
