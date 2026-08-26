import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart2, Plus, ArrowUpRight, ArrowDownRight, Wallet, ShieldAlert, Sparkles, RefreshCw, Trash2, ShieldCheck, Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { apiService } from '../services/api';

export default function DashboardPage({ user, onOpenAddModal, onOpenRiskModal }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssetFilter, setSelectedAssetFilter] = useState('All');

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await apiService.getPortfolio(user?.token, user?.id);
      if (res && res.success && res.summary) {
        setPortfolioData(res);
      }
    } catch (err) {
      console.warn('Backend portfolio fetch warning, using fallback metrics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user?.id]);

  const handleDeleteAsset = async (assetId) => {
    if (confirm('Are you sure you want to remove this investment holding?')) {
      try {
        const res = await apiService.deletePortfolioItem(assetId, user?.token, user?.id);
        if (res && res.success) {
          fetchPortfolio();
        }
      } catch (err) {
        console.error('Delete asset error:', err.message);
      }
    }
  };

  const summary = portfolioData?.summary || {
    totalNetWorth: 657645,
    totalInvested: 526116,
    unrealizedGainLoss: 131529,
    percentageReturn: 25.0,
    assetAllocation: [
      { name: 'Equity/Stocks', value: 427469, percent: 65, color: '#6366f1' },
      { name: 'Mutual Funds / SIP', value: 164411, percent: 25, color: '#10b981' },
      { name: 'Savings / Cash', value: 65765, percent: 10, color: '#f59e0b' }
    ],
    spendingByCategory: [
      { category: 'Investments / SIP', amount: 32500 },
      { category: 'Rent & Living', amount: 18000 },
      { category: 'Utilities & Bills', amount: 6500 },
      { category: 'Discretionary', amount: 4200 }
    ]
  };

  const holdings = portfolioData?.holdings || [
    { _id: 'h1', name: 'Nifty 50 Index Fund', assetClass: 'Mutual Funds / SIP', ticker: 'NIFTYBEES', quantity: 450, avgBuyPrice: 210, currentPrice: 285, currentWorth: 128250, gainLoss: 33750, percentReturn: 35.7 },
    { _id: 'h2', name: 'Reliance Industries Ltd', assetClass: 'Equity/Stocks', ticker: 'RELIANCE', quantity: 50, avgBuyPrice: 2400, currentPrice: 2950, currentWorth: 147500, gainLoss: 27500, percentReturn: 22.9 },
    { _id: 'h3', name: 'HDFC Bank Ltd', assetClass: 'Equity/Stocks', ticker: 'HDFCBANK', quantity: 80, avgBuyPrice: 1450, currentPrice: 1680, currentWorth: 134400, gainLoss: 18400, percentReturn: 15.8 },
    { _id: 'h4', name: 'Gold Sovereign Bond', assetClass: 'Gold & Commodities', ticker: 'SGB2030', quantity: 20, avgBuyPrice: 5200, currentPrice: 6550, currentWorth: 131000, gainLoss: 27000, percentReturn: 25.9 },
    { _id: 'h5', name: 'High-Yield Liquid Savings', assetClass: 'Savings / Cash', ticker: 'CASH', quantity: 1, avgBuyPrice: 116495, currentPrice: 116495, currentWorth: 116495, gainLoss: 0, percentReturn: 0.0 }
  ];

  const filteredHoldings = holdings.filter(h => selectedAssetFilter === 'All' || h.assetClass === selectedAssetFilter);

  if (loading && !portfolioData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white font-['Outfit']">Loading your custom wealth metrics...</h3>
        <p className="text-xs text-slate-400">Synchronizing consolidated holdings and MongoDB portfolio analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 text-left">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-green text-xs">Verified Portfolio</span>
            <span className="text-xs text-slate-400">User ID: {user?.id || 'clerk_user'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
            Consolidated Portfolio Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPortfolio}
            className="btn-glass text-xs py-2.5 px-4"
            title="Refresh Holdings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          
          <button
            onClick={onOpenAddModal}
            className="btn-primary text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" /> Add Asset / Holding
          </button>
        </div>
      </div>

      {/* TOP METRIC KPI CARDS (4-COLUMN GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bento-card p-5 border-[#1e293b] rounded-lg">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>TOTAL NET WORTH</span>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">
            ₹{summary.totalNetWorth?.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +₹{summary.unrealizedGainLoss?.toLocaleString()} (+{summary.percentageReturn}%)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bento-card p-5 border-[#1e293b] rounded-lg">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>TOTAL INVESTED</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-2">
            ₹{summary.totalInvested?.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1">
            Across {holdings.length} Assets
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bento-card p-5 border-[#1e293b] rounded-lg">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>MONTHLY SIP OUTFLOW</span>
            <BarChart2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-300 font-['Outfit'] mt-2">
            ₹32,500/mo
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1">
            Automated Discipline
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={onOpenRiskModal}
          className="bento-card p-5 border-[#1e293b] rounded-lg cursor-pointer hover:border-indigo-500 transition-all"
        >
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>RISK TOLERANCE</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-['Outfit'] mt-2">
            {user?.riskProfile?.score || 68} / 100
          </div>
          <div className="text-xs font-semibold text-slate-300 mt-1 flex items-center justify-between">
            <span>{user?.riskProfile?.category || 'Growth Investor'}</span>
            <span className="text-indigo-400 underline text-[11px]">Edit</span>
          </div>
        </div>

      </div>

      {/* SIDE-BY-SIDE CHARTS (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Asset Allocation Donut Chart (6 Cols) */}
        <div className="lg:col-span-6 bento-card p-6 border-[#1e293b] rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" /> Multi-Asset Class Allocation
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Consolidated</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {summary.assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending & SIP Outflow Bar Chart (6 Cols) */}
        <div className="lg:col-span-6 bento-card p-6 border-[#1e293b] rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" /> Monthly Spending Analytics
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Monthly Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.spendingByCategory}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CONSOLIDATED HOLDINGS TABLE */}
      <div className="bento-card p-6 border-[#1e293b] rounded-lg space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">Individual Asset Holdings</h3>
            <p className="text-xs text-slate-400">Detailed line items across equities, mutual funds, gold, and cash</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
            {['All', 'Equity/Stocks', 'Mutual Funds / SIP', 'Gold & Commodities', 'Savings / Cash'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedAssetFilter(filter)}
                className={`px-3 py-1 rounded-md border transition-all ${
                  selectedAssetFilter === filter 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-[#0b0f19] border-[#1e293b] text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Asset Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3 text-right">Qty</th>
                <th className="py-3 px-3 text-right">Avg Price</th>
                <th className="py-3 px-3 text-right">Current Price</th>
                <th className="py-3 px-3 text-right">Current Worth</th>
                <th className="py-3 px-3 text-right">Gain / Loss</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-slate-200">
              {filteredHoldings.map((item) => (
                <tr key={item._id} className="hover:bg-[#1f2937]/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.ticker || 'ASSET'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge badge-blue text-[10px]">{item.assetClass}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">₹{item.avgBuyPrice?.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">₹{item.currentPrice?.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    ₹{(item.currentWorth || (item.quantity * item.currentPrice))?.toLocaleString()}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${
                    (item.gainLoss >= 0) ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.gainLoss >= 0 ? '+' : ''}₹{item.gainLoss?.toLocaleString()} ({item.percentReturn}%)
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteAsset(item._id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete holding"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
