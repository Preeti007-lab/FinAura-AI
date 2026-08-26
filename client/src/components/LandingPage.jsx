import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, BrainCircuit, Target, FolderGit2, RotateCw, CheckCircle2, Award, Zap, HelpCircle, FileText, Lock
} from 'lucide-react';
import { useUser, SignUpButton } from '@clerk/clerk-react';

export default function LandingPage({ setActiveTab, onOpenRiskModal }) {
  let isSignedIn = false;
  try {
    const clerk = useUser();
    isSignedIn = clerk?.isSignedIn;
  } catch (e) {}

  // State to track flipped flashcards
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlipCard = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Financial Terms Flashcards Data
  const financialFlashcards = [
    {
      id: 'rule72',
      category: 'INVESTING FORMULA',
      colorClass: 'border-indigo-500/40',
      term: 'Rule of 72',
      badge: 'Doubling Speed',
      formula: 'Years to Double = 72 ÷ CAGR',
      question: 'How fast will an investment double at 12% CAGR?',
      answer: '• 72 ÷ 12 = 6 Years to double capital.\n• At 15% CAGR = 4.8 Years.',
      insight: '★ 15% CAGR cuts doubling time to 4.8 yrs.'
    },
    {
      id: 'rule503020',
      category: 'BUDGETING RATIO',
      colorClass: 'border-amber-500/40',
      term: '50 / 30 / 20 Rule',
      badge: 'Cashflow Rule',
      formula: '50% Needs + 30% Wants + 20% Wealth SIPs',
      question: 'How should monthly salary be allocated?',
      answer: '• 50% Essential Needs\n• 30% Lifestyle Wants\n• 20% Automated Wealth SIPs',
      insight: '★ Fixed Debt / EMIs capped to < 30% net income.'
    },
    {
      id: 'emergencyFund',
      category: 'SAVINGS CUSHION',
      colorClass: 'border-emerald-500/40',
      term: 'Emergency Buffer Ratio',
      badge: 'Liquidity Guard',
      formula: 'Buffer = 6 × (Fixed Needs + EMIs)',
      question: 'How much liquid cash to reserve before investing?',
      answer: '• 6 Months fixed obligations buffer.\n• 30% Bank Savings + 70% Liquid MFs.',
      insight: '★ Prevents forced selling during market dips.'
    },
    {
      id: 'sharpeRatio',
      category: 'RISK BENCHMARK',
      colorClass: 'border-cyan-500/40',
      term: 'Sharpe Ratio',
      badge: 'Alpha Metric',
      formula: 'Sharpe = (Return - RiskFree) ÷ Volatility',
      question: 'How do institutional funds measure risk-adjusted return?',
      answer: '• Sharpe > 1.0 = Strong excess return.\n• Sharpe > 2.0 = Institutional excellence.',
      insight: '★ High volatility yields lower Sharpe score.'
    },
    {
      id: 'cagrVSabsolute',
      category: 'COMPOUNDING METRIC',
      colorClass: 'border-purple-500/40',
      term: 'CAGR vs Absolute Return',
      badge: 'Truth Metric',
      formula: 'CAGR = (End/Start)^(1/Years) - 1',
      question: 'Why is CAGR more accurate than absolute percentage?',
      answer: '• Absolute return ignores time duration.\n• CAGR shows true annualized growth rate.',
      insight: '★ Always use CAGR for multi-year comparison.'
    },
    {
      id: 'swpRule',
      category: 'RETIREMENT PASSIVE CASH',
      colorClass: 'border-rose-500/40',
      term: '4% SWP Rule',
      badge: 'FIRE Cashflow',
      formula: 'Safe Withdrawal = Portfolio × 4%',
      question: 'How to draw inflation-protected passive cash forever?',
      answer: '• Withdraw 4% annually from total corpus.\n• Corpus lasts 30+ years with equity growth.',
      insight: '★ Needs 25× annual expenses corpus size.'
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 py-6 font-sans text-center flex flex-col items-center justify-center">
      
      {/* ========================================================================= */}
      {/* SECTION 01 // OVERVIEW HERO VIEW                                         */}
      {/* ========================================================================= */}
      <section id="hero" className="card-grid-container max-w-4xl mx-auto my-4 text-center scroll-mt-24">
        
        {/* Section Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-cyan-400 text-xs font-bold shadow-sm mb-4 mx-auto justify-center font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SECTION 01 // WEALTHTECH OVERVIEW</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto text-center font-['Outfit']">
          Turn Finfluencer Noise into <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Actionable Wealth</span>
        </h1>

        {/* Short Precise Subtext */}
        <p className="mt-3 text-xs sm:text-sm text-slate-300 font-semibold max-w-lg mx-auto text-center">
          Risk Profiling • Multi-Asset Vault • Goal SIPs • AI Social Audit
        </p>

        {/* INLINE TICKER IMAGE */}
        <div className="mt-4 mb-3 flex justify-center mx-auto">
          <img 
            src="/images/ticker_banner.jpg" 
            alt="Real-time Stock Market Banner" 
            style={{ width: '180px', height: '95px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #1e293b' }}
            className="hover:scale-105 transition-transform duration-300 shadow-sm"
          />
        </div>

        {/* Center CTA Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 mx-auto">
          {isSignedIn ? (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="btn-indigo text-xs py-2.5 px-6 cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="btn-indigo text-xs py-2.5 px-6 cursor-pointer">
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </SignUpButton>
          )}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 // PROOF METRICS                                              */}
      {/* ========================================================================= */}
      <section id="features" className="text-center scroll-mt-24">
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 mx-auto">
            SECTION 02 // VERIFIED PROOF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#162032] border border-[#1e293b] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">
              $48M+
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 font-mono">
              Assets Verified
            </div>
          </div>

          <div className="bg-[#162032] border border-[#1e293b] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="text-3xl font-extrabold text-indigo-400 tracking-tight font-mono">
              14,200+
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 font-mono">
              Portfolios Protected
            </div>
          </div>

          <div className="bg-[#162032] border border-[#1e293b] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-cyan-400/50 transition-all">
            <div className="text-3xl font-extrabold text-cyan-400 tracking-tight font-mono">
              98.4%
            </div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 font-mono">
              Filtering Accuracy
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 // CORE FEATURES FLASHCARD GRID                                */}
      {/* ========================================================================= */}
      <section className="text-center">
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 mx-auto">
            SECTION 03 // CORE PLATFORM FEATURES
          </span>
          <h2 className="text-2xl font-extrabold text-white text-center font-['Outfit'] mt-2">
            Institutional Wealth Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* Feature Card 1: Anti-Hype AI */}
          <div className="flashcard-grid-card text-center p-6 bg-[#162032] border border-[#1e293b] rounded-xl flex flex-col justify-between items-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] text-center">Anti-Hype AI Audit</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed text-center font-medium">
                Audits Finfluencer Telegram tips, stock pumps & crypto scams against SEBI data and your risk score.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('features')}
              className="btn-indigo text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Run AI Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature Card 2: Risk Banding */}
          <div className="flashcard-grid-card text-center p-6 bg-[#162032] border border-[#1e293b] rounded-xl flex flex-col justify-between items-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] text-center">Risk Profiling Engine</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed text-center font-medium">
                5-step SEBI/SEC survey evaluating financial goals, time horizon, dip tolerance, and max loss drawdown cap.
              </p>
            </div>
            <button
              onClick={onOpenRiskModal}
              className="btn-glass text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Take Risk Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature Card 3: Multi-Asset Vault */}
          <div className="flashcard-grid-card text-center p-6 bg-[#162032] border border-[#1e293b] rounded-xl flex flex-col justify-between items-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] text-center">Multi-Asset Vault</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed text-center font-medium">
                Consolidate stocks, mutual funds, gold, crypto & real estate into a single real-time net worth tracker.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('files')}
              className="btn-indigo text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 // INTERACTIVE WEALTH RULES FLASHCARDS DECK (STATE FLIPPED)    */}
      {/* ========================================================================= */}
      <section className="text-center space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 mx-auto">
            SECTION 04 // WEALTH RULES FLASHCARDS
          </span>
          <h2 className="text-2xl font-extrabold text-white text-center font-['Outfit']">
            Core Compounding Rules
          </h2>
          <p className="text-xs text-slate-400 font-semibold text-center">
            Click any flashcard to flip and view the verified answer & formula
          </p>
        </div>

        {/* State-Driven Flashcard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {financialFlashcards.map((fc) => {
            const isFlipped = flippedCards[fc.id];
            return (
              <div 
                key={fc.id}
                onClick={() => toggleFlipCard(fc.id)}
                className="h-[270px] w-full cursor-pointer rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {!isFlipped ? (
                  /* FRONT CARD SIDE */
                  <div className={`w-full h-full rounded-xl p-5 flex flex-col justify-between text-center items-center bg-[#162032] border ${fc.colorClass} shadow-md`}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {fc.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {fc.badge}
                      </span>
                    </div>

                    <div className="my-auto space-y-1.5 text-center">
                      <h3 className="text-lg font-bold text-white text-center font-['Outfit']">
                        {fc.term}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed text-center">
                        {fc.question}
                      </p>
                      <div className="p-1.5 rounded bg-[#0f172a] border border-[#1e293b] text-[10px] font-mono text-cyan-300 font-semibold text-center">
                        {fc.formula}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between w-full text-xs font-bold text-indigo-400">
                      <span>Click to Show Answer</span>
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ) : (
                  /* BACK CARD SIDE - EXPLICIT ANSWER & CALCULATION */
                  <div className={`w-full h-full rounded-xl p-5 flex flex-col justify-between text-center items-center bg-[#0d1c2c] border border-emerald-500/60 shadow-xl`}>
                    <div className="flex items-center justify-between w-full border-b border-[#1e293b] pb-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Answer & Calculation
                      </span>
                      <span className="text-[9px] text-emerald-300 font-mono">SEBI Verified</span>
                    </div>

                    <div className="my-auto space-y-2 text-xs text-white leading-relaxed font-medium text-left px-1">
                      <p className="whitespace-pre-line text-slate-200">{fc.answer}</p>
                      <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold text-center">
                        {fc.insight}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between w-full text-xs font-bold text-emerald-400">
                      <span>Return to Question</span>
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
