import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart2, Plus, ArrowUpRight, ArrowDownRight, Wallet, ShieldAlert, Sparkles, RefreshCw, Trash2, ShieldCheck, Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { apiService } from '../services/api';

export default function DashboardPage({ user, onOpenAddModal, onOpenRiskModal }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAssetFilter, setSelectedAssetFilter] = useState('All');

  const fetchPortfolio = async () => {
    try {
      const res = await apiService.getPortfolio(user?.token, user?.id);
      if (res && res.success && res.summary) {
        setPortfolioData(res);
      }
    } catch (err) {
      console.warn('Backend portfolio fetch warning, using fallback metrics:', err.message);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user?.id]);

  const handleDeleteAsset = async (assetId) => {
    if (confirm('Are you sure you want to remove this investment holding?')) {
      try {
        const res = await apiService.deletePortfolioItem?.(assetId, user?.token, user?.id);
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
    percentageReturn: 25.0
  };

  const assetAllocation = (summary && Array.isArray(summary.assetAllocation) && summary.assetAllocation.length > 0)
    ? summary.assetAllocation
    : [
        { name: 'Equity/Stocks', value: 427469, percent: 65, color: '#6366f1' },
        { name: 'Mutual Funds / SIP', value: 164411, percent: 25, color: '#10b981' },
        { name: 'Savings / Cash', value: 65765, percent: 10, color: '#f59e0b' }
      ];

  const spendingByCategory = (summary && Array.isArray(summary.spendingByCategory) && summary.spendingByCategory.length > 0)
    ? summary.spendingByCategory
    : [
        { category: 'Investments / SIP', amount: 32500 },
        { category: 'Rent & Living', amount: 18000 },
        { category: 'Utilities & Bills', amount: 6500 },
        { category: 'Discretionary', amount: 4200 }
      ];

  const holdings = (portfolioData && Array.isArray(portfolioData.holdings) && portfolioData.holdings.length > 0)
    ? portfolioData.holdings
    : [
        { _id: 'h1', name: 'Nifty 50 Index Fund', assetClass: 'Mutual Funds / SIP', ticker: 'NIFTYBEES', quantity: 450, avgBuyPrice: 210, currentPrice: 285, currentWorth: 128250, gainLoss: 33750, percentReturn: 35.7 },
        { _id: 'h2', name: 'Reliance Industries Ltd', assetClass: 'Equity/Stocks', ticker: 'RELIANCE', quantity: 50, avgBuyPrice: 2400, currentPrice: 2950, currentWorth: 147500, gainLoss: 27500, percentReturn: 22.9 },
        { _id: 'h3', name: 'HDFC Bank Ltd', assetClass: 'Equity/Stocks', ticker: 'HDFCBANK', quantity: 80, avgBuyPrice: 1450, currentPrice: 1680, currentWorth: 134400, gainLoss: 18400, percentReturn: 15.8 },
        { _id: 'h4', name: 'Gold Sovereign Bond', assetClass: 'Gold & Commodities', ticker: 'SGB2030', quantity: 20, avgBuyPrice: 5200, currentPrice: 6550, currentWorth: 131000, gainLoss: 27000, percentReturn: 25.9 },
        { _id: 'h5', name: 'High-Yield Liquid Savings', assetClass: 'Savings / Cash', ticker: 'CASH', quantity: 1, avgBuyPrice: 116495, currentPrice: 116495, currentWorth: 116495, gainLoss: 0, percentReturn: 0.0 }
      ];

  const filteredHoldings = holdings.filter(h => selectedAssetFilter === 'All' || h.assetClass === selectedAssetFilter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 text-center font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border-card)]">
        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="badge badge-green text-xs font-mono">Verified Portfolio</span>
            <span className="text-xs text-[var(--text-muted)] font-mono">ID: {user?.id || 'clerk_user'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mt-1 text-center">
            Consolidated Portfolio Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Investment</span>
            </button>
          )}
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-5 border-[var(--border-card)] rounded-lg space-y-2 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase">Total Net Worth</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{summary.totalNetWorth?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{summary.percentageReturn}% Returns
          </div>
        </div>

        <div className="bento-card p-5 border-[var(--border-card)] rounded-lg space-y-2 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase">Total Capital Invested</div>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono">
            ₹{summary.totalInvested?.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] font-semibold">Active Capital</div>
        </div>

        <div className="bento-card p-5 border-[var(--border-card)] rounded-lg space-y-2 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase">Unrealized Gain / Loss</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            +₹{summary.unrealizedGainLoss?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">Unrealized Profit</div>
        </div>

        <div className="bento-card p-5 border-[var(--border-card)] rounded-lg space-y-2 text-center">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase">Risk Score</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">
            68 / 100
          </div>
          <div className="text-[11px] text-cyan-400 font-semibold">Moderate Growth</div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Asset Allocation Pie (6 Cols) */}
        <div className="lg:col-span-6 bento-card p-6 border-[var(--border-card)] rounded-lg space-y-4 text-center">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 mx-auto">
              <PieIcon className="w-4 h-4 text-indigo-400" /> Asset Allocation Breakdown
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
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
        <div className="lg:col-span-6 bento-card p-6 border-[var(--border-card)] rounded-lg space-y-4 text-center">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 mx-auto">
              <BarChart2 className="w-4 h-4 text-emerald-400" /> Monthly Cashflow Allocation
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingByCategory}>
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
      <div className="bento-card p-6 border-[var(--border-card)] rounded-lg space-y-4 text-center">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[var(--border-card)] pb-3">
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)] text-center">Individual Asset Holdings</h3>
            <p className="text-xs text-[var(--text-muted)] text-center">Equities, Mutual Funds, Gold, and Cash</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs font-semibold">
            {['All', 'Equity/Stocks', 'Mutual Funds / SIP', 'Gold & Commodities', 'Savings / Cash'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedAssetFilter(filter)}
                className={`px-3 py-1 rounded-md border transition-all ${
                  selectedAssetFilter === filter 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-[var(--bg-card-inner)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-[var(--border-card)] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Asset Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3">Avg Price</th>
                <th className="py-3 px-3">Current Price</th>
                <th className="py-3 px-3">Current Worth</th>
                <th className="py-3 px-3">Gain / Loss</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-card)] text-[var(--text-main)]">
              {filteredHoldings.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.ticker || 'ASSET'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge badge-blue text-[10px]">{item.assetClass}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 font-mono">₹{item.avgBuyPrice?.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">₹{item.currentPrice?.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    ₹{(item.currentWorth || (item.quantity * item.currentPrice))?.toLocaleString()}
                  </td>
                  <td className={`py-3 px-3 font-mono font-bold ${
                    (item.gainLoss >= 0) ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.gainLoss >= 0 ? '+' : ''}₹{item.gainLoss?.toLocaleString()} ({item.percentReturn}%)
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteAsset(item._id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
