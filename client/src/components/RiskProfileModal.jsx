import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Sliders } from 'lucide-react';
import { apiService } from '../services/api';

const QUESTIONS = [
  {
    id: 'horizon',
    question: 'What is your primary investment time horizon?',
    options: [
      { key: 'short', label: 'Short-term (Under 3 years)', detail: 'Priority on immediate liquidity & capital protection' },
      { key: 'medium', label: 'Medium-term (3 to 7 years)', detail: 'Balanced growth for mid-term goals like home down payment' },
      { key: 'long', label: 'Long-term (7+ years)', detail: 'Maximum compound growth for FIRE, retirement, long-term wealth' }
    ]
  },
  {
    id: 'dipReaction',
    question: 'How do you react if your equity portfolio dips 25% in a market correction?',
    options: [
      { key: 'sell', label: 'Sell immediately to stop further losses', detail: 'Low risk tolerance, high anxiety' },
      { key: 'hold', label: 'Hold firm & wait for market recovery', detail: 'Moderate tolerance, patient approach' },
      { key: 'buy', label: 'Aggressively buy the dip with spare cash', detail: 'High risk appetite, opportunistic investor' }
    ]
  },
  {
    id: 'knowledge',
    question: 'How would you rate your financial market knowledge?',
    options: [
      { key: 'beginner', label: 'Beginner / Casual Investor', detail: 'Rely mostly on index funds & fixed deposits' },
      { key: 'intermediate', label: 'Intermediate Investor', detail: 'Understand PE ratios, mutual fund categories & CAGR' },
      { key: 'advanced', label: 'Advanced / Quant Trader', detail: 'Deep knowledge of option greeks, balance sheets & macro trends' }
    ]
  },
  {
    id: 'objective',
    question: 'Which statement best describes your wealth creation goal?',
    options: [
      { key: 'preservation', label: 'Capital Preservation', detail: 'Beat inflation safely with minimal drawdown risk' },
      { key: 'balanced', label: 'Consistent Compound Wealth', detail: 'Aim for 12-15% annual market CAGR with balanced asset splits' },
      { key: 'aggressive', label: 'Aggressive Capital Multiplier', detail: 'Target high-growth equities, tech stocks & emerging sector SIPs' }
    ]
  }
];

export default function RiskProfileModal({ isOpen, onClose, user, onUpdateSuccess }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    horizon: user?.riskProfile?.answers?.horizon || 'long',
    dipReaction: user?.riskProfile?.answers?.dipReaction || 'buy',
    knowledge: user?.riskProfile?.answers?.knowledge || 'intermediate',
    objective: user?.riskProfile?.answers?.objective || 'balanced'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[step];

  const handleSelectOption = (key) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await apiService.updateRiskProfile(answers, user?.token, user?.id);
    setSubmitting(false);

    if (res.success && res.riskProfile) {
      onUpdateSuccess(res.riskProfile);
      onClose();
    } else {
      // Fallback update
      onUpdateSuccess({
        score: answers.dipReaction === 'buy' ? 78 : answers.dipReaction === 'hold' ? 62 : 38,
        category: answers.dipReaction === 'buy' ? 'Growth / Aggressive' : 'Balanced / Moderate',
        answers
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-xl p-6 md:p-8 relative bg-[#0f172a]/95 border border-indigo-500/30">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Investor Risk Profiling Survey</h3>
            <p className="text-xs text-slate-400">Step {step + 1} of {QUESTIONS.length} • Tailors AI Hype Analysis & SIP Allocations</p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h4 className="text-lg font-semibold text-slate-100 mb-4">{currentQ.question}</h4>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.key;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm mb-1">{opt.label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{opt.detail}</div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`btn-glass text-xs py-2.5 ${step === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary text-xs py-2.5 px-5"
          >
            {submitting ? 'Processing Score...' : step === QUESTIONS.length - 1 ? 'Save & Calculate Score' : 'Next Question'}
            {step < QUESTIONS.length - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
