import React, { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, ShieldCheck, PlusCircle, Trash2, Calculator, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { apiService } from '../services/api';

const PRESET_GOALS = [
  { title: 'Emergency Safety Net', category: 'Emergency Fund', amount: 500000, years: 2, icon: '🛡️' },
  { title: 'House Down Payment', category: 'House Down Payment', amount: 3500000, years: 5, icon: '🏡' },
  { title: 'FIRE Early Retirement', category: 'Early Retirement', amount: 25000000, years: 15, icon: '🌴' },
  { title: 'Child Higher Education', category: 'Child Education', amount: 5000000, years: 10, icon: '🎓' }
];

export default function GoalPlannerPage({ user, onOpenRiskModal }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculator Form State
  const [title, setTitle] = useState('House Down Payment');
  const [category, setCategory] = useState('House Down Payment');
  const [targetAmount, setTargetAmount] = useState(3500000);
  const [currentAmount, setCurrentAmount] = useState(250000);
  const [targetYears, setTargetYears] = useState(5);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await apiService.getGoals(user?.token, user?.id);
      if (res && res.success && Array.isArray(res.goals)) {
        setGoals(res.goals);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  // Live Compound Curve Calculation
  const calculateLiveProjection = () => {
    const months = targetYears * 12;
    const monthlyRate = expectedReturnRate / 12 / 100;
    
    const futureCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
    const remainingTarget = Math.max(0, targetAmount - futureCurrent);

    let monthlySip = 0;
    if (remainingTarget > 0 && months > 0) {
      if (monthlyRate > 0) {
        monthlySip = (remainingTarget * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
      } else {
        monthlySip = remainingTarget / months;
      }
    }

    let equity = 70;
    let debt = 20;
    let gold = 10;
    if (targetYears <= 3) {
      equity = 25; debt = 65; gold = 10;
    } else if (targetYears <= 7) {
      equity = 60; debt = 30; gold = 10;
    } else {
      equity = 80; debt = 10; gold = 10;
    }

    const curve = [];
    let investedSum = currentAmount;
    let corpusVal = currentAmount;
    let currentSip = monthlySip;

    for (let yr = 1; yr <= targetYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        corpusVal = (corpusVal + currentSip) * (1 + monthlyRate);
        investedSum += currentSip;
      }
      curve.push({
        year: `Yr ${yr}`,
        invested: Math.round(investedSum),
        estimatedWealth: Math.round(corpusVal),
        targetGoal: targetAmount
      });
      currentSip *= (1 + (stepUpPercentage / 100));
    }

    return {
      monthlySipRequired: Math.round(monthlySip),
      projectedCorpus: Math.round(corpusVal),
      equity,
      debt,
      gold,
      curve
    };
  };

  const liveData = calculateLiveProjection();

  const handleSaveGoal = async () => {
    const payload = {
      title,
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      targetYears: Number(targetYears),
      expectedReturnRate: Number(expectedReturnRate),
      stepUpPercentage: Number(stepUpPercentage)
    };

    const res = await apiService.createGoal(payload, user?.token, user?.id);
    if (res.success) {
      fetchGoals();
      alert('Goal saved to your advisory portfolio!');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (confirm('Delete this financial goal?')) {
      const res = await apiService.deleteGoal(id, user?.token, user?.id);
      if (res.success) {
        fetchGoals();
      }
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
      
      {/* PAGE HEADER (STRICTLY CENTER ALIGNED) */}
      <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-3 pb-4 border-b border-[var(--border-card)]">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold border border-pink-500/20 mx-auto">
          <Target className="w-4 h-4" /> Goal-Based Wealth Advisory
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-main)] font-['Outfit'] tracking-tight text-center w-full">
          Smart SIP & Goal Advisory
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center w-full max-w-xl mx-auto">
          Simulate compound interest growth curves, step-up SIPs, and risk-adjusted asset splits
        </p>

        {/* User Risk Context Badge */}
        <div 
          onClick={onOpenRiskModal}
          className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[var(--bg-card-inner)] border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all shrink-0 mt-2 mx-auto shadow-md"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs text-center">
            <div className="text-[var(--text-muted)] font-mono">Risk Profile Context</div>
            <div className="font-bold text-[var(--text-main)]">
              {user?.riskProfile?.score || 68}/100 • {user?.riskProfile?.category || 'Growth'}
            </div>
          </div>
        </div>
      </div>

      {/* GOAL PRESETS BAR (CENTER ALIGNED) */}
      <div className="space-y-3 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Quick Select Financial Milestone Preset:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {PRESET_GOALS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                setTitle(preset.title);
                setCategory(preset.category);
                setTargetAmount(preset.amount);
                setTargetYears(preset.years);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                title === preset.title
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="font-bold text-xs text-white">{preset.title}</div>
              <div className="text-[11px] text-indigo-300 font-mono mt-1">₹{(preset.amount/100000).toFixed(1)} Lakhs • {preset.years} Yrs</div>
            </div>
          ))}
        </div>
      </div>

      {/* CALCULATOR & COMPOUND CURVE MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Calculator Controls (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 border-indigo-500/30 space-y-5 text-center">
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center justify-center gap-2 border-b border-white/10 pb-3">
            <Calculator className="w-4 h-4 text-pink-400" /> Interactive Goal Controls
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Milestone Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-glass text-sm text-center"
            />
          </div>

          {/* Target Amount */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Target Goal Amount</span>
              <span className="text-indigo-400 font-bold font-mono">₹{targetAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="50000000"
              step="100000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Current Saved Seed */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Current Saved Seed Money</span>
              <span className="text-emerald-400 font-bold font-mono">₹{currentAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Timeline Years */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Time Horizon (Years)</span>
              <span className="text-pink-400 font-bold font-mono">{targetYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={targetYears}
              onChange={(e) => setTargetYears(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Expected Return % */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Return %</label>
              <input
                type="number"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="input-glass text-xs font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Step-Up %</label>
              <input
                type="number"
                step="1"
                value={stepUpPercentage}
                onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                className="input-glass text-xs font-mono text-center"
              />
            </div>
          </div>

          <button
            onClick={handleSaveGoal}
            className="w-full btn-primary justify-center py-3.5 text-sm mt-2"
          >
            <PlusCircle className="w-4 h-4" /> Save Goal to Advisory Portfolio
          </button>
        </div>

        {/* Right Column: Compound Growth Chart & Risk Allocations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Result Banner (Center Aligned) */}
          <div className="glass-card p-6 bg-gradient-to-r from-indigo-950/60 via-violet-950/40 to-slate-900 border-indigo-500/30 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Monthly SIP</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-['Outfit'] mt-1">
                  ₹{liveData.monthlySipRequired.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  With {stepUpPercentage}% annual step-up increase
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Wealth at Year {targetYears}</span>
                <div className="text-3xl font-extrabold text-indigo-300 font-['Outfit'] mt-1">
                  ₹{liveData.projectedCorpus.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Target Goal Met: 100%
                </div>
              </div>
            </div>
          </div>

          {/* COMPOUND INTEREST GROWTH CHART */}
          <div className="glass-card p-6 text-center">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white font-['Outfit'] inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Wealth Compounding Projection Curve
              </h3>
              <p className="text-xs text-slate-400">Total Invested vs Estimated Wealth Growth over {targetYears} Years</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData.curve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1321', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '14px', fontSize: '12px' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="estimatedWealth" name="Estimated Wealth" stroke="#6366f1" fillOpacity={1} fill="url(#colorWealth)" />
                  <Area type="monotone" dataKey="invested" name="Total Invested" stroke="#10b981" fillOpacity={1} fill="url(#colorInvested)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RISK-ADJUSTED ASSET ALLOCATION RECOMMENDATION */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-sm font-bold text-white font-['Outfit'] inline-flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-violet-400" /> Recommended Risk-Adjusted Asset Split
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tailored for {targetYears}-year horizon and user risk tolerance profile ({user?.riskProfile?.category || 'Growth'}):
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                <div className="text-xs text-slate-400">Equity / Index Funds</div>
                <div className="text-2xl font-extrabold text-indigo-400 font-['Outfit'] mt-1">{liveData.equity}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-xs text-slate-400">Debt & Fixed Income</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-['Outfit'] mt-1">{liveData.debt}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-xs text-slate-400">Gold & Sovereign Bonds</div>
                <div className="text-2xl font-extrabold text-amber-400 font-['Outfit'] mt-1">{liveData.gold}%</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SAVED FINANCIAL GOALS LIST */}
      {goals.length > 0 && (
        <div className="glass-card p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-white font-['Outfit'] mb-6">Saved Active Financial Goals</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {goals.map((g) => (
              <div key={g._id} className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 relative text-center">
                <button
                  onClick={() => handleDeleteGoal(g._id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <span className="badge badge-blue text-[10px] mb-1">{g.category}</span>
                  <h4 className="text-base font-bold text-white font-['Outfit']">{g.title}</h4>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Target: <strong className="text-white">₹{g.targetAmount?.toLocaleString()}</strong></span>
                  <span className="text-slate-400">Tenure: <strong className="text-white">{g.targetYears} Yrs</strong></span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs">
                  <span className="text-slate-400">Monthly SIP Needed: </span>
                  <strong className="text-emerald-400 font-bold font-mono">₹{g.monthlySipRequired?.toLocaleString()}/mo</strong>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Progress ({g.progressPercentage || 0}%)</span>
                    <span>₹{g.currentAmount?.toLocaleString()}</span>
                  </div>
                  <div className="gauge-bar-track">
                    <div 
                      className="gauge-bar-fill bg-emerald-500"
                      style={{ width: `${g.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
