import React from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { SignUpButton, SignInButton } from '@clerk/clerk-react';

export default function AuthModal({ isOpen, onClose, mode }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-md p-8 relative bg-[#0a0f1d] border border-indigo-500/30 rounded-xl text-center shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            CredoMetrics Authentication
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Protected exclusively by Clerk Verified Single Sign-On & JWT Encryption.
          </p>
        </div>

        {/* Exclusive Clerk Authentication Options */}
        <div className="space-y-4">
          <SignUpButton mode="modal">
            <button 
              onClick={onClose}
              className="w-full btn-primary justify-center py-3.5 text-sm font-bold rounded-xl shadow-lg"
            >
              Sign Up with Clerk
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button 
              onClick={onClose}
              className="w-full btn-glass justify-center py-3.5 text-sm font-bold rounded-xl"
            >
              Log In with Clerk
            </button>
          </SignInButton>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Clerk OAuth & Multi-Factor Protection</span>
        </div>

      </div>
    </div>
  );
}
