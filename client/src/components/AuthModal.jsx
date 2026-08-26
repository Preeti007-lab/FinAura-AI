import React, { useState } from 'react';
import { X, Mail, UserCheck, Sparkles, Shield, KeyRound } from 'lucide-react';
import { SignUpButton, SignInButton } from '@clerk/clerk-react';

export default function AuthModal({ isOpen, onClose, mode, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(mode || 'signup');
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
      if (onLoginSuccess) {
        onLoginSuccess({
          id: 'user_clerk_' + Date.now(),
          email: email || 'investor@finaura.app',
          name: name || (activeTab === 'signup' ? 'New Investor' : 'Alex Vance'),
          token: 'jwt_clerk_token_sample_' + Date.now(),
          riskProfile: { score: 68, category: 'Growth / Moderate-Aggressive' }
        });
      }
      onClose();
    }, 500);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          id: 'demo_investor_99',
          email: 'alex.investor@finaura.app',
          name: 'Alex Vance',
          token: 'demo-token',
          riskProfile: { score: 68, category: 'Growth / Moderate-Aggressive' }
        });
      }
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-md p-6 relative bg-[#0a0f1d] border border-indigo-500/30 rounded-xl text-center shadow-2xl">
        
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
            {activeTab === 'login' ? 'Welcome Back to CredoMetrics' : 'Create CredoMetrics Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Protected by Clerk Single Sign-On & JWT Encryption
          </p>
        </div>

        {/* CLERK ONE-CLICK AUTHENTICATION BUTTONS */}
        <div className="space-y-3 mb-6">
          {activeTab === 'signup' ? (
            <SignUpButton mode="modal">
              <button 
                className="w-full btn-primary justify-center py-3 text-sm font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Sign Up with Clerk (SSO)
              </button>
            </SignUpButton>
          ) : (
            <SignInButton mode="modal">
              <button 
                className="w-full btn-primary justify-center py-3 text-sm font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Log In with Clerk (SSO)
              </button>
            </SignInButton>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Or Standard Authentication</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Auth Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-4 border border-white/10">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass pl-10 text-xs py-2.5"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="investor@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass justify-center py-2.5 text-xs mt-2 font-bold cursor-pointer"
          >
            {loading ? 'Authenticating...' : (activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Investor Account')}
          </button>
        </form>

        {/* Quick Demo Mode Option */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Launch Instant Demo Mode (Pre-populated Portfolio)
          </button>
        </div>

      </div>
    </div>
  );
}
