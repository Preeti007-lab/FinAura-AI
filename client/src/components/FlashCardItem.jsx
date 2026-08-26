import React, { useState } from 'react';
import { RotateCw, Trash2, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export default function FlashCardItem({ card, onDelete, showDelete = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'badge-green';
    if (diff === 'Hard') return 'badge-red';
    return 'badge-blue';
  };

  return (
    <div 
      className="perspective-1000 h-[280px] w-full cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        
        {/* FRONT SIDE: QUESTION / CONCEPT */}
        <div className="absolute inset-0 w-full h-full backface-hidden flashcard p-6 flex flex-col justify-between border-indigo-500/40 text-center bg-[#0d1321]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <span className="badge badge-blue text-[11px] flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> {card.topic || 'General'}
            </span>
            <span className={`badge ${getDifficultyBadge(card.difficulty)} text-[10px]`}>
              {card.difficulty || 'Medium'}
            </span>
          </div>

          {/* Question / Concept Center */}
          <div className="my-auto px-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">QUESTION / CONCEPT</div>
            <h4 className="text-base sm:text-lg font-bold text-white font-['Outfit'] leading-snug">
              {card.question}
            </h4>
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500 font-mono">ID: {card._id?.substring(0, 8)}</span>
            <span className="flex items-center gap-1 text-indigo-300 font-semibold group-hover:scale-105 transition-transform">
              <RotateCw className="w-3.5 h-3.5" /> Flip Answer
            </span>
          </div>

        </div>

        {/* BACK SIDE: ANSWER / EXPLANATION */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flashcard p-6 flex flex-col justify-between border-emerald-500/40 text-center bg-[#09141f]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <span className="badge badge-green text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Answer & Explanation
            </span>
            {showDelete && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card._id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete this flashcard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Answer Text Center */}
          <div className="my-auto px-2 overflow-y-auto max-h-[160px] scrollbar-thin text-left">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {card.answer}
            </p>
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">Click to flip front</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <RotateCw className="w-3.5 h-3.5" /> Back to Question
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
