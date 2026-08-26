import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Layers, BookOpen, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import FlashCardItem from './FlashCardItem';
import { apiService } from '../services/api';

const PRESET_TOPICS = [
  'Quantum Computing',
  'Machine Learning & AI',
  'Personal Finance & SIPs',
  'Organic Chemistry',
  'System Design & Microservices',
  'Macroeconomics'
];

export default function GeneratePage({ user, onCardGenerated }) {
  const [topic, setTopic] = useState('Quantum Computing');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic || topic.trim() === '') return;

    setLoading(true);
    setStatusMsg('');
    setGeneratedCards([]);

    const res = await apiService.generateFlashcards(topic, count, user?.token, user?.id);
    setLoading(false);

    if (res.success && res.cards) {
      setGeneratedCards(res.cards);
      setStatusMsg(`Successfully generated ${res.cards.length} AI flashcards for "${topic}"! Saved to database.`);
      if (onCardGenerated) onCardGenerated();
    } else {
      alert('Error generating flashcards: ' + (res.message || 'Failed'));
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-8">
      
      {/* PAGE HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
          <BrainCircuit className="w-4 h-4" /> Groq AI Flashcard Generator
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Generate AI Flashcards
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Enter any study topic or subject, choose the card count (1-6), and let AI generate structured flashcards.
        </p>
      </div>

      {/* PROMPT INTERFACE & DROPDOWN CARD */}
      <div className="flashcard p-6 md:p-8 border-indigo-500/40 text-center max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-left">
            
            {/* Topic Input Prompt (9 Cols) */}
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                1. Enter Subject / Topic Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Quantum Computing, Financial Ratios, System Design..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-glass text-sm"
              />
            </div>

            {/* Dropdown Selector (4 Cols: 1 to 6) */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                2. Cards Count (1-6)
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="input-glass text-sm bg-[#0d1321]"
              >
                <option value={1}>1 Flashcard</option>
                <option value={2}>2 Flashcards</option>
                <option value={3}>3 Flashcards</option>
                <option value={4}>4 Flashcards</option>
                <option value={5}>5 Flashcards</option>
                <option value={6}>6 Flashcards</option>
              </select>
            </div>

          </div>

          {/* Quick Sample Topic Chips */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">Or select a popular study topic preset:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(preset)}
                  className={`px-3 py-1 rounded-xl border text-xs font-medium transition-all ${
                    topic === preset 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow' 
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="btn-primary py-3.5 px-8 text-sm justify-center mx-auto w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" /> Generating AI Cards...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate {count} Flashcards
              </span>
            )}
          </button>

        </form>
      </div>

      {/* SUCCESS STATUS FEEDBACK */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center max-w-xl mx-auto flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {statusMsg}
        </div>
      )}

      {/* GENERATED CARDS DISPLAY WORKSPACE */}
      {generatedCards.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white font-['Outfit'] inline-flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Generated Flashcards ({generatedCards.length})
            </h3>
            <p className="text-xs text-slate-400 mt-1">Click any card below to flip between Question and Answer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedCards.map((card, idx) => (
              <FlashCardItem key={card._id || idx} card={card} showDelete={false} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
