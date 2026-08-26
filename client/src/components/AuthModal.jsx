import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, Sparkles, Shield, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, mode, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'user_clerk_' + Date.now(),
        email: email || 'investor@finaura.app',
        name: name || (activeTab === 'signup' ? 'New Investor' : 'Alex Vance'),
        token: 'jwt_clerk_token_sample_' + Date.now(),
        riskProfile: { score: 68, category: 'Growth / Moderate-Aggressive' }
      });
      onClose();
    }, 600);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'demo_investor_99',
        email: 'alex.investor@finaura.app',
        name: 'Alex Vance',
        token: 'demo-token',
        riskProfile: { score: 68, category: 'Growth / Moderate-Aggressive' }
      });
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-md p-6 relative bg-[#0f172a]/95 border border-indigo-500/30">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            {activeTab === 'login' ? 'Welcome Back to FinAura' : 'Create FinAura Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Protected by Clerk Authentication & JWT Token Encryption
          </p>
        </div>

        {/* Auth Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-white/10">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass pl-10 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="investor@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass pl-10 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-sm mt-2"
          >
            {loading ? 'Authenticating...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 mb-2">Want to evaluate without signing up?</p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            Launch Instant Demo Mode (Pre-populated Portfolio)
          </button>
        </div>

      </div>
    </div>
  );
}
