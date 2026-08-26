import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Trash2, Layers, RefreshCw, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import FlashCardItem from './FlashCardItem';
import { apiService } from '../services/api';

export default function MyCardsPage({ user, setActiveTab }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const fetchCards = async () => {
    setLoading(true);
    const res = await apiService.getCards(user?.token, user?.id);
    setLoading(false);
    if (res.success && res.cards) {
      setCards(res.cards);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  const handleDeleteCard = async (cardId) => {
    if (confirm('Are you sure you want to delete this flashcard from your collection?')) {
      const res = await apiService.deleteCard(cardId, user?.token, user?.id);
      if (res.success) {
        setCards(prev => prev.filter(c => c._id !== cardId));
      } else {
        alert('Failed to delete card: ' + (res.message || 'Error'));
      }
    }
  };

  // Get unique topics for filter pills
  const topics = ['All', ...Array.from(new Set(cards.map(c => c.topic).filter(Boolean)))];

  // Filtered Cards
  const filteredCards = cards.filter(c => {
    const matchesSearch = c.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.topic && c.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTopic = selectedTopic === 'All' || c.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      
      {/* PAGE HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-2 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <BookOpen className="w-4 h-4" /> Persistent Knowledge Vault
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          My Saved Flashcards
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          All AI-generated flashcards stored securely in your database collection ({cards.length} Total Cards)
        </p>

        {/* Header Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={fetchCards}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all shadow-sm"
            title="Refresh Flashcards Vault"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className="btn-primary text-xs py-2.5 px-5"
          >
            <PlusCircle className="w-4 h-4" /> Generate New Flashcards
          </button>
        </div>
      </div>

      {/* SEARCH & TOPIC FILTER CONTROLS */}
      <div className="flashcard p-6 border-white/10 text-center max-w-3xl mx-auto space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search questions, concepts, or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass pl-10 pr-8 text-xs py-2.5 text-center"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Topic Filter Pills */}
        {topics.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2 border-t border-white/10 text-xs font-semibold">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                  selectedTopic === t 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow' 
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* FLASHCARDS GALLERY GRID */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <FlashCardItem
              key={card._id}
              card={card}
              onDelete={handleDeleteCard}
              showDelete={true}
            />
          ))}
        </div>
      ) : (
        <div className="flashcard p-12 text-center max-w-md mx-auto space-y-3 border-white/10">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Stored Flashcards Found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery ? 'No cards match your search term.' : 'You haven\'t generated any flashcards yet.'}
          </p>
          <button
            onClick={() => setActiveTab('generate')}
            className="btn-primary text-xs py-2.5 px-5 inline-flex mt-2"
          >
            <PlusCircle className="w-4 h-4" /> Generate Your First Flashcard
          </button>
        </div>
      )}

    </div>
  );
}
