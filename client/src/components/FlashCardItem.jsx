import React, { useState } from 'react';
import { RotateCw, Trash2, CheckCircle2, BookOpen } from 'lucide-react';

export default function FlashCardItem({ card, onDelete, showDelete = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'badge-green';
    if (diff === 'Hard') return 'badge-red';
    return 'badge-blue';
  };

  return (
    <div 
      className="h-[280px] w-full cursor-pointer group rounded-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {!isFlipped ? (
        /* FRONT SIDE: QUESTION / CONCEPT */
        <div className="w-full h-full rounded-xl p-6 flex flex-col justify-between border border-indigo-500/40 text-center bg-[#162032] shadow-lg hover:border-indigo-500/80 transition-all">
          
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
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 mb-2">QUESTION / CONCEPT</div>
            <h4 className="text-base sm:text-lg font-bold text-white font-['Outfit'] leading-snug">
              {card.question}
            </h4>
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500 font-mono">ID: {card._id?.substring(0, 8)}</span>
            <span className="flex items-center gap-1.5 text-indigo-300 font-bold group-hover:text-white transition-colors">
              <RotateCw className="w-3.5 h-3.5" /> Show Answer
            </span>
          </div>

        </div>
      ) : (
        /* BACK SIDE: ANSWER / EXPLANATION */
        <div className="w-full h-full rounded-xl p-6 flex flex-col justify-between border border-emerald-500/50 text-center bg-[#0e1e2e] shadow-xl hover:border-emerald-400 transition-all">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <span className="badge badge-green text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Answer
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
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
              {card.answer || 'No detailed explanation available for this card.'}
            </p>
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <span className="text-[11px] text-slate-400 font-mono">Click to return</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <RotateCw className="w-3.5 h-3.5" /> Back to Question
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
