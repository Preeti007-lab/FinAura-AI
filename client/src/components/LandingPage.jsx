import React, { useState } from 'react';
import { 
  Sparkles, BrainCircuit, ArrowRight, TrendingUp, ShieldCheck, Zap, Sliders, Layers, Target, Lock, Cpu, RotateCw, PieChart, ShieldAlert, DollarSign, Calculator, BookOpen
} from 'lucide-react';
import { useUser, SignUpButton } from '@clerk/clerk-react';

export default function LandingPage({ setActiveTab, onOpenAuthModal }) {
  let isSignedIn = false;
  try {
    const clerk = useUser();
    isSignedIn = clerk?.isSignedIn;
  } catch (e) {}

  // Compounding Interest Slider States (Real-time dynamic SVG curve)
  const [sipAmount, setSipAmount] = useState(35000);
  const [horizonYears, setHorizonYears] = useState(15);
  const [cagrRate, setCagrRate] = useState(14);

  // 3D Flip Card Active States
  const [flippedCard, setFlippedCard] = useState({});

  const toggleFlip = (id) => {
    setFlippedCard(prev => ({ ...prev, [id]: !prev[id] }));
  };

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

  // Financial Terms Flashcards Data
  const financialFlashcards = [
    {
      id: 'rule72',
      category: 'INVESTING FORMULA',
      term: 'Rule of 72',
      badge: 'Easy Math',
      formula: 'Years to Double = 72 ÷ CAGR',
      question: 'How fast will an investment double at 12% annual CAGR?',
      answer: '72 ÷ 12 = 6 Years. Your capital doubles every 6 years. At 15% CAGR, it doubles in 4.8 years.',
      calculativeInsight: '★ Key Takeaway: Increasing return from 10% to 15% cuts doubling time from 7.2 years down to 4.8 years.'
    },
    {
      id: 'rule503020',
      category: 'BUDGETING RULE',
      term: '50 / 30 / 20 Budget Rule',
      badge: 'Core Ratio',
      formula: '50% Needs + 30% Wants + 20% Wealth SIPs',
      question: 'How should monthly net salary be strictly allocated?',
      answer: '• 50% Essential Needs (Rent, Groceries, EMIs)\n• 30% Lifestyle Wants (Dining, Travel)\n• 20% Automated Wealth SIPs (Equities, Debt)',
      calculativeInsight: '★ Key Takeaway: Cap fixed debt/EMIs to < 30% of net income to protect liquidity.'
    },
    {
      id: 'emergencyFund',
      category: 'SAVINGS CUSHION',
      term: 'Emergency Buffer Ratio',
      badge: 'Risk Guard',
      formula: 'Buffer = 6 × (Monthly Fixed Needs + EMIs)',
      question: 'How much liquid cash must be reserved before investing?',
      answer: 'Exactly 6 months of total fixed obligations stored in 30% Savings Account + 70% Liquid Mutual Funds.',
      calculativeInsight: '★ Key Takeaway: Prevents forced selling of equity portfolios during market dips.'
    },
    {
      id: 'sharpeRatio',
      category: 'PORTFOLIO METRIC',
      term: 'Sharpe Ratio',
      badge: 'Alpha Benchmark',
      formula: 'Sharpe = (Portfolio Return - RiskFree Rate) ÷ Volatility',
      question: 'How do institutional funds measure risk-adjusted return?',
      answer: 'A Sharpe ratio > 1.0 indicates good excess return per unit of volatility; > 2.0 indicates institutional excellence.',
      calculativeInsight: '★ Key Takeaway: High return with extreme drawdowns yields a low Sharpe score.'
    },
    {
      id: 'inflationShield',
      category: 'PURCHASING POWER',
      term: 'Real Rate of Return',
      badge: 'CPI Inflation',
      formula: 'Real Return = Nominal CAGR - CPI Inflation (6%)',
      question: 'Why do traditional bank FDs fail to grow real wealth?',
      answer: 'If FD offers 6.5% interest and inflation is 6.0%, your net real return after 30% tax is negative (-1.45%).',
      calculativeInsight: '★ Key Takeaway: Equities & broad index funds are required to beat long-term CPI inflation.'
    },
    {
      id: 'assetAlloc',
      category: 'ASSET ALLOCATION',
      term: '100 Minus Age Rule',
      badge: 'Portfolio Mix',
      formula: 'Equity Target % = 100 - Current Age',
      question: 'How should asset allocation shift as you age?',
      answer: 'At age 30: 70% Equities, 20% Debt, 10% Gold/Cash. At age 50: 50% Equities, 40% Debt, 10% Gold/Cash.',
      calculativeInsight: '★ Key Takeaway: Rebalance annually to lock in profits and maintain target risk score.'
    }
  ];

  return (
    <div className="w-full min-h-screen text-[var(--text-main)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* SECTION 1: THE SPACIOUS HERO VIEW (TOP)                                  */}
      {/* ========================================================================= */}
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-16 pb-6">
        
        {/* Institutional Pill Header */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-indigo-400 text-xs font-bold shadow-md mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>COMPACT FLASHCARD-POWERED WEALTHTECH PLATFORM</span>
        </div>

        {/* Massive Center-Aligned Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--text-main)] leading-[1.08] font-['Outfit'] max-w-4xl mx-auto">
          Turn Finfluencer Noise into <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Actionable Wealth</span>
        </h1>

        {/* Call-to-Action Button */}
        <div className="mt-10 mb-20 flex justify-center">
          {isSignedIn ? (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_10px_35px_rgba(99,102,241,0.45)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          )}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PROOF COUNTERS (COMPACT ROW)                                   */}
      {/* ========================================================================= */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-8 flex flex-col items-center justify-center text-center shadow-md hover:border-emerald-500/50 transition-all">
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-['Outfit'] tracking-tight">
              $48M+
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
              Assets Verified
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-8 flex flex-col items-center justify-center text-center shadow-md hover:border-indigo-500/50 transition-all">
            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 font-['Outfit'] tracking-tight">
              14,200+
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
              Portfolios Protected
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-8 flex flex-col items-center justify-center text-center shadow-md hover:border-cyan-400/50 transition-all">
            <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 font-['Outfit'] tracking-tight">
              98.4%
            </div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
              Filtering Accuracy
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: INTERACTIVE 3D FINANCIAL TERM FLASHCARDS DECK                  */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-card)] pb-4">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <BookOpen className="w-4 h-4" /> INTERACTIVE FINANCIAL CONCEPTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] font-['Outfit']">
              Core Wealth Flashcards (Click Card to Flip Answer)
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Click any card to reveal formula & calculations
          </span>
        </div>

        {/* 3D Flip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialFlashcards.map((fc) => (
            <div 
              key={fc.id}
              onClick={() => toggleFlip(fc.id)}
              className="perspective-1000 h-[290px] w-full cursor-pointer group"
            >
              <div 
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  flippedCard[fc.id] ? 'rotate-y-180' : ''
                }`}
              >
                
                {/* FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full backface-hidden bento-card p-6 flex flex-col justify-between border-[var(--border-card)] text-left bg-[var(--bg-card)] hover:border-indigo-500/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {fc.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {fc.badge}
                    </span>
                  </div>

                  <div className="my-auto space-y-2">
                    <h3 className="text-xl font-bold text-[var(--text-main)] font-['Outfit']">
                      {fc.term}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                      {fc.question}
                    </p>
                    <div className="p-2.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs font-mono text-cyan-300 font-semibold">
                      {fc.formula}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Click to Flip Answer</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bento-card p-6 flex flex-col justify-between border-emerald-500/40 text-left bg-[var(--bg-card-inner)]">
                  <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
                    <span className="text-[11px] font-bold text-emerald-400 font-['Outfit']">
                      Answer & Calculation
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Concept Ref</span>
                  </div>

                  <div className="my-auto space-y-2 text-xs text-[var(--text-main)] leading-relaxed font-medium">
                    <p className="whitespace-pre-line">{fc.answer}</p>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-bold">
                      {fc.calculativeInsight}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Click to Return to Question</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CALCULATIVE FINANCIAL CONCEPTS & VISUAL DIAGRAMS               */}
      {/* ========================================================================= */}
      <section className="mb-24 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">INFORMED DATA & CALCULATIONS</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)] font-['Outfit']">
            Investing, Saving & Budgeting Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Investing */}
          <div className="bento-module-card p-6 text-left space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="badge badge-green text-[10px]">Investing Matrix</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Asset Allocation & CAGR
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Optimized risk-adjusted wealth compounding principles.
              </p>
            </div>

            {/* Visual SVG Diagram: Asset Allocation Pyramid */}
            <div className="h-28 w-full bg-[var(--bg-card-inner)] rounded-md border border-[var(--border-card)] p-3 flex flex-col justify-center gap-1.5 text-[10px] font-bold">
              <div className="h-7 bg-indigo-600/80 rounded flex items-center justify-between px-3 text-white">
                <span>Equities (Nifty50 / S&P500)</span>
                <span>12-15% CAGR</span>
              </div>
              <div className="h-6 bg-emerald-600/80 rounded flex items-center justify-between px-3 text-white">
                <span>Debt Funds / Fixed Income</span>
                <span>7-8% CAGR</span>
              </div>
              <div className="h-5 bg-amber-600/80 rounded flex items-center justify-between px-3 text-white">
                <span>Gold & Cash Buffer</span>
                <span>5-6% CAGR</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
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

          {/* Card 2: Saving */}
          <div className="bento-module-card p-6 text-left space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="badge badge-blue text-[10px]">Savings Cushion</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Emergency & Liquidity Split
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Protecting capital against market drawdowns.
              </p>
            </div>

            {/* Visual SVG Diagram: Liquidity Cushion Split */}
            <div className="h-28 w-full bg-[var(--bg-card-inner)] rounded-md border border-[var(--border-card)] p-3 flex items-center justify-between gap-2">
              <div className="flex-1 text-center p-2 rounded bg-slate-800/60 border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">30% Cash</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">Instant Bank</div>
              </div>
              <div className="flex-1 text-center p-2 rounded bg-slate-800/60 border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">70% Liquid</div>
                <div className="text-xs font-bold text-cyan-400 mt-1">Debt MFs</div>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span><strong>Buffer Target:</strong> 6x Monthly Essential Needs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span><strong>Real Return:</strong> Nominal Yield - 6% CPI Inflation</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Budgeting */}
          <div className="bento-module-card p-6 text-left space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-amber-400" />
              </div>
              <span className="badge badge-amber text-[10px]">50/30/20 Rule</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Calculative Budgeting Ratio
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Automating monthly cashflow discipline.
              </p>
            </div>

            {/* Visual SVG Diagram: 50/30/20 Bar Split */}
            <div className="h-28 w-full bg-[var(--bg-card-inner)] rounded-md border border-[var(--border-card)] p-3 flex flex-col justify-center gap-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] flex justify-between">
                <span>Needs (50%)</span>
                <span>Wants (30%)</span>
                <span>SIPs (20%)</span>
              </div>
              <div className="h-4 rounded overflow-hidden flex bg-slate-800">
                <div className="h-full bg-indigo-500 w-[50%]" />
                <div className="h-full bg-amber-500 w-[30%]" />
                <div className="h-full bg-emerald-500 w-[20%]" />
              </div>
              <div className="text-[10px] text-emerald-400 font-bold text-right">
                Cap Debt EMIs to &lt; 30% Net Pay
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong>Needs Cap:</strong> Max 50% for rent, groceries, debt</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong>Wealth Goal:</strong> Min 20% automated auto-debit SIP</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: INTERACTIVE FORECASTING PLAYGROUND                             */}
      {/* ========================================================================= */}
      <section className="mb-24">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[8px] p-8 sm:p-10 shadow-xl text-left">
          
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] font-['Outfit']">
              Interactive Forecasting Playground
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Slider Controls */}
            <div className="lg:col-span-5 space-y-6 bg-[var(--bg-card-inner)] p-6 rounded-[8px] border border-[var(--border-card)]">
              
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

              <div className="p-4 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Projected Corpus</div>
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
            <div className="lg:col-span-7 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)] uppercase">
                <span>DYNAMIC GROWTH CURVE ({horizonYears} YRS)</span>
                <span className="text-emerald-400 font-mono">{cagrRate}% CAGR RATE</span>
              </div>

              <div className="relative w-full h-72 bg-[var(--bg-card-inner)] p-4 rounded-[8px] border border-[var(--border-card)] flex items-center justify-center overflow-hidden">
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

                <div className="absolute top-3 right-3 bg-[var(--bg-card)] px-3 py-1 rounded border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                  ₹{(finalCorpus / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: ORGANIZED BENTO FEATURE MODULES                                */}
      {/* ========================================================================= */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="bento-module-card p-6 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              
              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Anti-Hype AI Detection
              </h3>

              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
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
            className="bento-module-card p-6 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Consolidated Asset Vault
              </h3>

              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
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
            className="bento-module-card p-6 flex flex-col justify-between text-left cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] font-['Outfit']">
                Automated Goal Engine
              </h3>

              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-semibold">
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
      <footer className="pb-12 pt-6 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--text-muted)]">
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
