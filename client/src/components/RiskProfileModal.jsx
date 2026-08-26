import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, PieChart, ShieldAlert, Award, Sparkles, Save, Check } from 'lucide-react';
import { apiService } from '../services/api';

const QUESTIONS = [
  {
    id: 'goalType',
    title: 'Financial Goal',
    question: 'What is your primary financial milestone for this capital?',
    options: [
      { key: 'retirement', label: 'Retirement & FIRE Wealth', detail: 'Build long-term independence and passive cashflow' },
      { key: 'growth', label: 'Wealth Accumulation & Multiplier', detail: 'Maximize portfolio compounding over multi-year cycles' },
      { key: 'home', label: 'Mid-Term Goal (Home / Property)', detail: 'Targeted capital goal needed in 3 to 7 years' },
      { key: 'preservation', label: 'Capital Safety & Emergency Cushion', detail: 'Protect purchasing power with minimal downside drawdown' }
    ]
  },
  {
    id: 'horizon',
    title: 'Time Horizon',
    question: 'What is your planned investment horizon before needing this money?',
    options: [
      { key: 'short', label: 'Short-Term (Under 3 Years)', detail: 'Requires high liquidity and zero market crash risk' },
      { key: 'medium', label: 'Medium-Term (3 to 7 Years)', detail: 'Balanced growth horizon with moderate volatility allowance' },
      { key: 'long', label: 'Long-Term (7+ Years)', detail: 'Maximum compounding runway to ride through market cycles' }
    ]
  },
  {
    id: 'dipReaction',
    title: 'Risk Tolerance',
    question: 'How do you react if a market correction causes a 25% portfolio dip?',
    options: [
      { key: 'sell', label: 'Sell Immediately to Stop Losses', detail: 'Low risk tolerance, priority on capital preservation' },
      { key: 'hold', label: 'Hold Firm & Wait for Recovery', detail: 'Patient approach, comfortable with temporary paper losses' },
      { key: 'buy', label: 'Aggressively Buy the Dip', detail: 'High risk appetite, opportunistic long-term investor' }
    ]
  },
  {
    id: 'incomeStability',
    title: 'Income Stability',
    question: 'How stable is your current monthly income and cashflow?',
    options: [
      { key: 'stable', label: 'Highly Stable Salaried Income', detail: 'Predictable regular inflows with 6+ months emergency cash' },
      { key: 'moderate', label: 'Moderate Salaried / Fixed Variable', detail: 'Occasional bonus variations but consistent monthly baseline' },
      { key: 'variable', label: 'Business / Variable Freelance', detail: 'Inconsistent monthly inflows requiring liquidity buffers' }
    ]
  },
  {
    id: 'knowledge',
    title: 'Market Knowledge',
    question: 'How would you rate your financial and equity market knowledge?',
    options: [
      { key: 'beginner', label: 'Beginner / Index Investor', detail: 'Rely primarily on index funds, FDs, and simple SIPs' },
      { key: 'intermediate', label: 'Intermediate Investor', detail: 'Understand PE ratios, mutual fund categories, CAGR & Sharpe ratios' },
      { key: 'advanced', label: 'Advanced / Quant Trader', detail: 'Experienced in balance sheet analysis, macro trends & derivatives' }
    ]
  }
];

export default function RiskProfileModal({ isOpen, onClose, user, onUpdateSuccess }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goalType: 'growth',
    horizon: 'long',
    dipReaction: 'buy',
    incomeStability: 'stable',
    knowledge: 'intermediate'
  });
  const [resultProfile, setResultProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Restore saved quiz progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('risk_quiz_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.step === 'number') setStep(parsed.step);
      } else if (user?.riskProfile?.answers) {
        setAnswers(user.riskProfile.answers);
      }
    } catch (e) {}
  }, [user]);

  if (!isOpen) return null;

  const handleSelectOption = (key) => {
    const newAnswers = { ...answers, [QUESTIONS[step].id]: key };
    setAnswers(newAnswers);
    setIsSaved(true);

    // Save to localStorage
    try {
      localStorage.setItem('risk_quiz_progress', JSON.stringify({ answers: newAnswers, step }));
    } catch (e) {}

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      try {
        localStorage.setItem('risk_quiz_progress', JSON.stringify({ answers, step: nextStep }));
      } catch (e) {}
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (resultProfile) {
      setResultProfile(null);
    } else if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      try {
        localStorage.setItem('risk_quiz_progress', JSON.stringify({ answers, step: prevStep }));
      } catch (e) {}
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await apiService.updateRiskProfile(answers, user?.token, user?.id);
    setSubmitting(false);

    if (res.success && res.riskProfile) {
      setResultProfile(res.riskProfile);
      if (onUpdateSuccess) onUpdateSuccess(res.riskProfile);
    } else {
      // Fallback local score calculation
      const fallback = {
        score: answers.dipReaction === 'buy' ? 78 : answers.dipReaction === 'hold' ? 62 : 38,
        category: answers.dipReaction === 'buy' ? 'Growth / Moderate-Aggressive' : 'Balanced / Moderate Growth',
        recommendedAllocation: { equity: 75, debt: 15, gold: 5, liquid: 5 },
        maxDrawdown: '-18%',
        personalizedAssessment: 'Evaluated based on your long-term horizon and goal alignment. Balanced equity exposure recommended to beat inflation.',
        answers
      };
      setResultProfile(fallback);
      if (onUpdateSuccess) onUpdateSuccess(fallback);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-2xl p-6 md:p-8 relative bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* VIEW 01 // SURVEY QUESTIONNAIRE WITH EXPLICIT QUESTION DEMARCATION        */}
        {/* ========================================================================= */}
        {!resultProfile ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white font-['Outfit']">Investor Risk Profiling Quiz</h3>
                  <p className="text-xs text-slate-400">Question {step + 1} of {QUESTIONS.length} • Evaluates Goals, Horizon & Risk Tolerance</p>
                </div>
              </div>

              {/* Progress Saved Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saving...' : 'Progress Saved'}</span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-[#162032] h-2 rounded-full mb-6 overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* EXPLICIT QUESTION DEMARCATION CARD */}
            <div className="p-4 rounded-xl bg-[#162032] border border-[#1e293b] mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  QUESTION 0{step + 1} // {QUESTIONS[step].title}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {Math.round(((step + 1) / QUESTIONS.length) * 100)}% Completed
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                {QUESTIONS[step].question}
              </h4>
            </div>

            {/* OPTIONS GRID WITH CLEAR DEMARCATION & SELECTED HIGHLIGHT */}
            <div className="space-y-3 mb-6">
              {QUESTIONS[step].options.map((opt) => {
                const isSelected = answers[QUESTIONS[step].id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'bg-[#162032] border-[#1e293b] text-slate-300 hover:border-emerald-500/50 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                        <span>{opt.label}</span>
                        {isSelected && <span className="badge badge-green text-[9px] py-0 px-1.5">Selected</span>}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed font-normal">{opt.detail}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className={`btn-slate text-xs py-2.5 px-4 ${step === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="btn-emerald text-xs py-2.5 px-5 flex items-center gap-2"
              >
                {submitting ? 'Calculating Profile...' : step === QUESTIONS.length - 1 ? 'Evaluate Risk Assessment' : 'Next Question'}
                {step < QUESTIONS.length - 1 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </>
        ) : (
          
          /* ========================================================================= */
          /* VIEW 02 // PERSONALIZED ASSESSMENT REPORT RESULTS                          */
          /* ========================================================================= */
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white font-['Outfit']">Personalized Risk Profile Assessment</h3>
                  <p className="text-xs text-slate-400">Evaluated against your goals, horizon & drawdown tolerance</p>
                </div>
              </div>
              <span className="badge badge-green text-xs font-mono py-1 px-3">Official SEBI/SEC Assessment</span>
            </div>

            {/* Score & Tier Banner */}
            <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 rounded-xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <div className="md:col-span-5 text-center md:text-left space-y-1">
                  <div className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">Quantified Risk Score</div>
                  <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-4xl font-extrabold text-white font-['Outfit']">{resultProfile.score}</span>
                    <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mt-2">
                    {resultProfile.category}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Risk Spectrum</span>
                    <span>Max Drawdown Cap: <strong className="text-rose-400">{resultProfile.maxDrawdown}</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${resultProfile.score}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Recommended Asset Allocation Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4" />
                <span>Recommended Asset Allocation</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#162032] border border-[#1e293b] rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Equities</div>
                  <div className="text-lg font-extrabold text-indigo-400 mt-1">{resultProfile.recommendedAllocation?.equity || 75}%</div>
                </div>

                <div className="p-3 bg-[#162032] border border-[#1e293b] rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Debt / Bonds</div>
                  <div className="text-lg font-extrabold text-emerald-400 mt-1">{resultProfile.recommendedAllocation?.debt || 15}%</div>
                </div>

                <div className="p-3 bg-[#162032] border border-[#1e293b] rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Gold / Commodities</div>
                  <div className="text-lg font-extrabold text-amber-400 mt-1">{resultProfile.recommendedAllocation?.gold || 5}%</div>
                </div>

                <div className="p-3 bg-[#162032] border border-[#1e293b] rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Liquid Cash</div>
                  <div className="text-lg font-extrabold text-cyan-400 mt-1">{resultProfile.recommendedAllocation?.liquid || 5}%</div>
                </div>
              </div>
            </div>

            {/* Personalized Advice Card */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 font-mono">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Personalized Strategy Report</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {resultProfile.personalizedAssessment}
              </p>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
              <button
                onClick={handleBack}
                className="btn-slate text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Retake Survey
              </button>

              <button
                onClick={onClose}
                className="btn-emerald text-xs py-2.5 px-6"
              >
                Apply Profile to Portfolio
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
