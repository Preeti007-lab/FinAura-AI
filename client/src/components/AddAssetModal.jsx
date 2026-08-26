import React, { useState } from 'react';
import { X, PlusCircle, TrendingUp, CreditCard, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

export default function AddAssetModal({ isOpen, onClose, user, onItemAdded }) {
  const [tab, setTab] = useState('investment'); // 'investment' or 'transaction'
  const [name, setName] = useState('');
  const [assetClass, setAssetClass] = useState('Equity/Stocks');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [avgBuyPrice, setAvgBuyPrice] = useState('250');
  const [currentPrice, setCurrentPrice] = useState('320');
  
  // Transaction fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SIP / Investment');
  const [amount, setAmount] = useState('10000');
  const [txType, setTxType] = useState('investment'); // 'investment', 'expense', 'income'

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = tab === 'investment' 
      ? {
          type: 'portfolio',
          name,
          assetClass,
          ticker: ticker || name.substring(0, 5).toUpperCase(),
          quantity: Number(quantity),
          avgBuyPrice: Number(avgBuyPrice),
          currentPrice: Number(currentPrice)
        }
      : {
          type: 'transaction',
          title,
          category,
          amount: Number(amount),
          txType
        };

    const res = await apiService.addPortfolioItem(payload, user?.token, user?.id);
    setLoading(false);

    if (res.success) {
      onItemAdded(res.item);
      onClose();
    } else {
      alert('Error adding item: ' + (res.message || 'Failed'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-lg p-6 relative bg-[#0f172a]/95 border border-indigo-500/30">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Add to Portfolio</h3>
            <p className="text-xs text-slate-400">Consolidate investments or record spending analytics</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('investment')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              tab === 'investment' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Investment Holding
          </button>
          <button
            type="button"
            onClick={() => setTab('transaction')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              tab === 'transaction' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Spend / SIP Record
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'investment' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nifty 50 Index Fund or Apple Inc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Category</label>
                  <select
                    value={assetClass}
                    onChange={(e) => setAssetClass(e.target.value)}
                    className="input-glass text-sm bg-slate-900"
                  >
                    <option value="Equity/Stocks">Equity / Stocks</option>
                    <option value="Mutual Funds">Mutual Funds / SIP</option>
                    <option value="Fixed Savings">Fixed Savings / FD</option>
                    <option value="Gold & Precious">Gold & Precious Metals</option>
                    <option value="Crypto/Alternate">Crypto / Alternate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ticker / Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. AAPL or NIFTY"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="input-glass text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-glass text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Avg Buy Price</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={avgBuyPrice}
                    onChange={(e) => setAvgBuyPrice(e.target.value)}
                    className="input-glass text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Price</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    className="input-glass text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Flexi-Cap SIP or MacBook Purchase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-glass text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-glass text-sm bg-slate-900"
                  >
                    <option value="SIP / Investment">SIP / Investment</option>
                    <option value="Shopping & Tech">Shopping & Tech</option>
                    <option value="Housing & Bills">Housing & Bills</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Income / Dividend">Income / Dividend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value)}
                    className="input-glass text-sm bg-slate-900"
                  >
                    <option value="investment">Investment SIP</option>
                    <option value="expense">Expense</option>
                    <option value="income">Income / Dividend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($ / ₹)</label>
                <input
                  type="number"
                  required
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-glass text-sm"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-sm mt-4"
          >
            {loading ? 'Adding Record...' : 'Confirm & Save Asset'}
          </button>
        </form>

      </div>
    </div>
  );
}
