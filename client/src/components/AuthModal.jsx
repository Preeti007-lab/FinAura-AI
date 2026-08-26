import React from 'react';
import { X } from 'lucide-react';
import { SignUp, SignIn, SignUpButton, SignInButton } from '@clerk/clerk-react';

export default function AuthModal({ isOpen, onClose, mode = 'signup' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-50">
      <div className="relative p-2 max-w-md w-full flex flex-col items-center justify-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-50 bg-[#1e293b] text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 shadow-xl cursor-pointer hover:bg-slate-800 transition-all"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Clerk Authentication Widget (Displays Google, GitHub, Apple, Email as configured in Clerk Dashboard) */}
        <div className="w-full flex justify-center">
          {mode === 'login' ? (
            <SignIn 
              routing="hash"
              appearance={{
                elements: {
                  card: "bg-[#0a0f1d] border border-[#1e293b] shadow-2xl rounded-xl",
                  headerTitle: "text-white font-['Outfit'] font-bold text-xl",
                  headerSubtitle: "text-slate-400 text-xs",
                  socialButtonsBlockButton: "bg-[#111827] border border-[#1e293b] text-white hover:bg-[#1f2937]",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold",
                  footerActionLink: "text-indigo-400 hover:text-indigo-300 font-bold"
                }
              }}
            />
          ) : (
            <SignUp 
              routing="hash"
              appearance={{
                elements: {
                  card: "bg-[#0a0f1d] border border-[#1e293b] shadow-2xl rounded-xl",
                  headerTitle: "text-white font-['Outfit'] font-bold text-xl",
                  headerSubtitle: "text-slate-400 text-xs",
                  socialButtonsBlockButton: "bg-[#111827] border border-[#1e293b] text-white hover:bg-[#1f2937]",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold",
                  footerActionLink: "text-indigo-400 hover:text-indigo-300 font-bold"
                }
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
