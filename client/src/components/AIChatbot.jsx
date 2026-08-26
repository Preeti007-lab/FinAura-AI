import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Sparkles, X, Send, Bot, User, Trash2, Maximize2, 
  Minimize2, Copy, Check, Zap, RefreshCw, ShieldAlert, ArrowRight, Wand2
} from 'lucide-react';
import { apiService } from '../services/api';

const QUICK_PROMPTS = [
  { icon: '📈', label: 'SIP Optimization', text: 'How do I optimize my monthly SIP strategy for 15% CAGR?' },
  { icon: '🚨', label: 'Crypto & Hype Check', text: 'Is this 10x Telegram crypto tip safe or a pump & dump scheme?' },
  { icon: '🎯', label: 'Goal Planning', text: 'How much monthly investment do I need to reach ₹50 Lakhs in 10 years?' },
  { icon: '🛡️', label: 'Emergency Fund', text: 'What is the best way to calculate and store an emergency fund?' },
  { icon: '📊', label: 'Financial Metrics', text: 'Explain P/E Ratio and how to use it when analyzing bluechip stocks.' }
];

export default function AIChatbot({ user, externalOpenState, setExternalOpenState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showBadge, setShowBadge] = useState(true);

  // Sync external open triggers (e.g. Navbar click)
  useEffect(() => {
    if (externalOpenState !== undefined && externalOpenState !== null) {
      setIsOpen(externalOpenState);
      if (externalOpenState) setShowBadge(false);
    }
  }, [externalOpenState]);

  const toggleOpen = (newState) => {
    const target = newState !== undefined ? newState : !isOpen;
    setIsOpen(target);
    if (setExternalOpenState) setExternalOpenState(target);
    if (target) setShowBadge(false);
  };

  // Encapsulated state: Persist message history in localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('miracle_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Investor'}! 👋\n\nI am **Miracle**, your personal AI financial co-pilot powered by anti-hype wealth intelligence.\n\nAsk me anything about **SIP strategies, portfolio health, crypto hype analysis, goal calculations, or financial metrics**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef(null);

  // Save conversation history to component-level localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('miracle_chat_history', JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  // Auto-scroll target element #chat-messages to absolute bottom
  useEffect(() => {
    if (isOpen) {
      const messagesContainer = document.getElementById('chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for API call
      const historyForApi = messages
        .filter(m => m.id !== 'msg_welcome')
        .map(m => ({ role: m.role, content: m.text }));

      const res = await apiService.chatWithAI(
        query, 
        historyForApi, 
        user?.riskProfile, 
        user?.token, 
        user?.id
      );

      const aiMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: res?.response || 'Miracle is currently operating in offline mode. Please try again shortly.',
        model: res?.model || 'Miracle AI Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Miracle Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: '⚠️ Miracle was unable to process your request right now. Please check your network connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear all conversation history with Miracle?')) {
      const reset = [
        {
          id: 'msg_welcome_reset',
          role: 'assistant',
          text: `Miracle chat history reset. Ask me your next financial question!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(reset);
      localStorage.removeItem('miracle_chat_history');
    }
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Markdown renderer helper
  const formatMarkdown = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold text-indigo-400 mt-2 mb-1 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400 inline" />
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-emerald-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-3 list-disc text-slate-300 my-0.5 text-xs">
            {renderedParts}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }

      return (
        <p key={idx} className="text-slate-200 leading-relaxed text-xs my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className="font-sans">
      {/* 1. FLOATING ACTION BUTTON (FAB) - Pinned at bottom: 20px, left: 20px, z-index: 1000 */}
      <div 
        className="fixed bottom-[20px] left-[20px] z-[1000]"
        style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}
      >
        <div className="relative group">
          {showBadge && !isOpen && (
            <div className="absolute -top-12 left-0 bg-slate-900/95 text-slate-200 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-500/40 text-xs shadow-2xl flex items-center gap-2 whitespace-nowrap animate-bounce">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask <strong>Miracle AI</strong></span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowBadge(false); }}
                className="text-slate-400 hover:text-white ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => toggleOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-indigo-500/30 group-hover:ring-indigo-500/60 relative overflow-hidden"
            aria-label="Toggle Miracle AI Assistant"
            title="Toggle Miracle AI Assistant"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            )}
            <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </button>
        </div>
      </div>

      {/* 2. LEFT-SIDE INTERACTIVE CHAT WINDOW - Positioned fixed above FAB at bottom: 84px, left: 20px, z-index: 1000 */}
      {isOpen && (
        <div 
          className="fixed bottom-[84px] left-[20px] z-[1000] w-[400px] max-w-[90vw] h-[580px] max-h-[80vh] bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{ position: 'fixed', bottom: '84px', left: '20px', zIndex: 1000 }}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 flex items-center justify-center text-white shadow-md relative">
                <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-sm tracking-wide">Miracle AI</h3>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-indigo-300 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Anti-Hype Wealth Co-Pilot
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={handleClearChat}
                className="p-1.5 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => toggleOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RISK CONTEXT BANNER */}
          {user?.riskProfile && (
            <div className="bg-indigo-950/70 px-3.5 py-1.5 border-b border-indigo-800/40 flex items-center justify-between text-[10px] text-indigo-200 shrink-0">
              <span className="flex items-center gap-1">
                <Wand2 className="w-3 h-3 text-amber-400" />
                <span>Profile Context: <strong>{user.riskProfile.category}</strong></span>
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">Tailored</span>
            </div>
          )}

          {/* TARGETED CHAT MESSAGES CONTAINER: id="chat-messages" */}
          <div 
            id="chat-messages"
            className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700/60"
          >
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id || idx} 
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}

                  <div 
                    className={`max-w-[88%] rounded-2xl p-2.5 text-xs relative group shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-br-none'
                        : 'bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <div className="pr-4">
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <div>{formatMarkdown(msg.text)}</div>
                      )}
                    </div>

                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(msg.text, idx)}
                        className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    <div 
                      className={`text-[9px] mt-1 flex items-center justify-between gap-2 ${
                        isUser ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.model && <span className="font-mono text-[9px] opacity-75">{msg.model}</span>}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5 shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-bl-none p-2.5 flex items-center gap-1.5">
                  <span className="text-[11px] text-indigo-300 font-medium mr-1">Miracle thinking...</span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPTS CAROUSEL */}
          <div className="px-2.5 py-1.5 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={loading}
                className="px-2 py-1 rounded-full bg-slate-900 hover:bg-indigo-600/40 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-white text-[10px] font-medium transition-all duration-200 flex items-center gap-1 flex-shrink-0 shadow-sm"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Miracle about SIPs, crypto, goals..."
              disabled={loading}
              className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-xs px-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* FOOTER */}
          <div className="bg-slate-950 border-t border-slate-900 px-2 py-1 text-[9px] text-center text-slate-500 shrink-0">
            Miracle AI Assistant • Anti-Hype Financial Intelligence
          </div>
        </div>
      )}
    </div>
  );
}
