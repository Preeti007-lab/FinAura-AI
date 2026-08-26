import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, Flame, Zap, ArrowRight, History, ThumbsUp, ThumbsDown, CheckCircle2, ShieldAlert, Cpu
} from 'lucide-react';
import { apiService } from '../services/api';

const PRESET_QUERIES = [
  { label: '🚀 Finfluencer Penny Stock Tip', text: '🔥 GUARANTEED 10X RETURNS on XYZ MicroCap! Buy before Telegram channel pump!' },
  { label: '💎 High Yield Crypto Protocol', text: 'Earn 25% APY guaranteed passive income on new decentralized staking vault.' },
  { label: '📈 Nifty 50 Bluechip SIP', text: 'Should I invest ₹20,000 monthly into Nifty 50 Index Fund for 10 years?' },
  { label: '🤖 Tech AI Stocks Rally', text: 'AI stocks are booming! Is it too late to lump-sum buy Nvidia & Microsoft?' }
];

export default function HypeAnalyzerPage({ user, onOpenRiskModal }) {
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await apiService.getAnalysisHistory(user?.token, user?.id);
    if (res.success && res.history) {
      setHistory(res.history);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleAnalyze = async (textToRun = null) => {
    const targetText = textToRun || queryText;
    if (!targetText || targetText.trim() === '') return;

    setLoading(true);
    setAnalysisResult(null);

    const riskScore = user?.riskProfile?.score || 68;
    const res = await apiService.analyzeTrend(targetText, riskScore, user?.token, user?.id);
    setLoading(false);

    if (res.success && res.data) {
      setAnalysisResult(res.data);
      fetchHistory();
    } else {
      alert('Error running AI analysis');
    }
  };

  const getHypeColor = (score) => {
    if (score > 75) return 'from-red-500 to-rose-600 text-rose-400';
    if (score > 45) return 'from-amber-500 to-yellow-600 text-amber-400';
    return 'from-emerald-500 to-teal-600 text-emerald-400';
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8">
      
      {/* PAGE HEADER (CENTER ALIGNED) */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 border-b border-white/10">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <BrainCircuit className="w-4 h-4" /> Anti-Hype Financial Intelligence
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          AI Social Hype & Trend Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Evaluates Finfluencer tips, social media trends & stocks against factual data and your risk profile
        </p>

        {/* User Risk Context Badge */}
        <div 
          onClick={onOpenRiskModal}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all shrink-0 mt-2"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs text-left">
            <div className="text-slate-400">Target Risk Profile</div>
            <div className="font-bold text-white">
              {user?.riskProfile?.category || 'Growth'} ({user?.riskProfile?.score || 68}/100)
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT INPUT SECTION (CENTER ALIGNED) */}
      <div className="glass-card p-6 md:p-8 border-indigo-500/30 text-center">
        
        <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
          Paste Social Tip, Finfluencer Tweet, Telegram Call, or Stock Ticker:
        </label>
        
        <div className="space-y-4 mb-6">
          <textarea
            rows="3"
            placeholder="e.g. 'BUY NOW! Penny stock ABC Motors expected to 10x after secret EV contract!' or 'Parag Parikh Flexi Cap Fund review'"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="input-glass text-sm resize-none text-center"
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !queryText.trim()}
            className="btn-primary py-3.5 px-8 text-sm justify-center mx-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin" /> Evaluating Noise...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Run AI Trend Analysis
              </span>
            )}
          </button>
        </div>

        {/* Preset Sample Prompts */}
        <div className="space-y-3 pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block">Or test with popular social hype samples:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(preset.text);
                  handleAnalyze(preset.text);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 text-xs font-medium transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* AI ANALYSIS RESULTS CARD (CENTER ALIGNED HEADERS) */}
      {analysisResult && (
        <div className="glass-card p-6 md:p-8 border-indigo-500/40 space-y-6 animate-fadeIn text-center">
          
          {/* Top Banner */}
          <div className="pb-6 border-b border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Target</span>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              "{analysisResult.assetName || analysisResult.queryText}"
            </h2>

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className={`badge ${
                analysisResult.hypeScore > 75 ? 'badge-red' : analysisResult.hypeScore > 45 ? 'badge-amber' : 'badge-green'
              } text-xs py-1.5 px-3`}>
                {analysisResult.sentiment}
              </span>
              <span className="badge badge-blue text-xs py-1.5 px-3">
                Risk: {analysisResult.riskLevel}
              </span>
            </div>
          </div>

          {/* HYPE METER GAUGE */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> Finfluencer Hype Meter
              </span>
              <span className={`text-2xl font-extrabold font-['Outfit'] ${
                analysisResult.hypeScore > 75 ? 'text-rose-400' : analysisResult.hypeScore > 45 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {analysisResult.hypeScore} / 100
              </span>
            </div>

            <div className="gauge-bar-track my-2">
              <div 
                className={`gauge-bar-fill bg-gradient-to-r ${getHypeColor(analysisResult.hypeScore)}`}
                style={{ width: `${analysisResult.hypeScore}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-1">
              <span>0 (Organic / Fact-Based)</span>
              <span>50 (Moderate Hype)</span>
              <span>100 (Pure Pump & Dump)</span>
            </div>
          </div>

          {/* TWO COLUMN GRID: RED FLAGS & FACTUAL SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            {/* Red Flags Detector */}
            <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> AI Detected Warning Signals
              </h4>
              <ul className="space-y-2">
                {analysisResult.redFlags && analysisResult.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-rose-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Factual Market Breakdown */}
            <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-indigo-400 shrink-0" /> Market Fundamentals
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.factualSummary}
              </p>
            </div>

          </div>

          {/* RECOMMENDATION & SUITABILITY */}
          <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-2xl space-y-3 text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">Actionable AI Recommendation</span>
              <p className="text-base font-bold text-white leading-relaxed">
                {analysisResult.recommendation}
              </p>
            </div>
            
            <div className="pt-3 border-t border-indigo-500/20 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
              <span><strong>Risk Suitability Verdict:</strong> {analysisResult.riskSuitability}</span>
            </div>
          </div>

        </div>
      )}

      {/* PAST ANALYSIS HISTORY */}
      {history.length > 0 && (
        <div className="glass-card p-6 md:p-8 text-center">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center justify-center gap-2 mb-4">
            <History className="w-4 h-4 text-slate-400" /> Recent Hype Evaluations History
          </h3>

          <div className="divide-y divide-white/5 max-w-3xl mx-auto">
            {history.map((item) => (
              <div key={item._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="truncate text-left flex-1">
                  <div className="font-semibold text-slate-200 truncate">"{item.queryText}"</div>
                  <div className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge ${item.hypeScore > 70 ? 'badge-red' : 'badge-green'}`}>
                    Hype: {item.hypeScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
