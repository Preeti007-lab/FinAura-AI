import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Sparkles, X, Send, User, Trash2, Copy, Check, Zap, Wand2
} from 'lucide-react';
import { apiService } from '../services/api';

const QUICK_PROMPTS = [
  { icon: '📈', label: 'SIP Plan', text: 'How do I optimize my monthly SIP strategy for 15% CAGR?' },
  { icon: '🚨', label: 'Crypto Hype', text: 'Is this 10x Telegram crypto tip safe or a pump & dump scheme?' },
  { icon: '🎯', label: 'Goal Target', text: 'How much monthly investment do I need to reach ₹50 Lakhs in 10 years?' },
  { icon: '🛡️', label: 'Emergency Fund', text: 'What is the best way to calculate and store an emergency fund?' }
];

export default function AIChatbot({ user, externalOpenState, setExternalOpenState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showBadge, setShowBadge] = useState(true);

  const chatbotRef = useRef(null);
  const chatEndRef = useRef(null);

  // Sync external open state (e.g., from Navbar button)
  useEffect(() => {
    if (externalOpenState !== undefined && externalOpenState !== null) {
      setIsOpen(externalOpenState);
      if (externalOpenState) setShowBadge(false);
    }
  }, [externalOpenState]);

  // Outside click listener: close chat pop-up when user clicks outside chatbot container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
        if (setExternalOpenState) setExternalOpenState(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setExternalOpenState]);

  const toggleOpen = (newState) => {
    const target = newState !== undefined ? newState : !isOpen;
    setIsOpen(target);
    if (setExternalOpenState) setExternalOpenState(target);
    if (target) setShowBadge(false);
  };

  // Encapsulated chat history state in localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('miracle_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Investor'}! 👋\n\nI am **Miracle**, your AI financial co-pilot.\n\nAsk me about **SIP strategies, anti-hype crypto tips, goal calculations, or metrics**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Save history to localStorage
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
    if (confirm('Clear Miracle chat history?')) {
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

  // Markdown renderer
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
          <h3 key={idx} className="text-xs font-bold text-white mt-2 mb-1">
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
    <div ref={chatbotRef} className="font-sans">
      {/* 1. 50px x 50px CIRCULAR FLOATING ACTION BUTTON (FAB) - Pinned at bottom: 20px, left: 20px, z-index: 9999 */}
      <div 
        className="fixed bottom-[20px] left-[20px] z-[9999]"
        style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}
      >
        <div className="relative group">
          {showBadge && !isOpen && (
            <div className="absolute -top-11 left-0 bg-slate-900/95 text-slate-200 backdrop-blur-md px-3 py-1 rounded-xl border border-indigo-500/40 text-[11px] shadow-2xl flex items-center gap-1.5 whitespace-nowrap animate-bounce">
              <Wand2 className="w-3 h-3 text-amber-400" />
              <span>Ask <strong>Miracle</strong></span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowBadge(false); }}
                className="text-slate-400 hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => toggleOpen(!isOpen)}
            className="w-[50px] h-[50px] rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-indigo-500/30 group-hover:ring-indigo-500/60 relative overflow-hidden"
            aria-label="Toggle Miracle AI Chat"
            title="Toggle Miracle AI Chat"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <MessageSquare className="w-5 h-5 text-white" />
            )}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </button>
        </div>
      </div>

      {/* 2. ENLARGED POP-UP CHAT WINDOW - Positioned fixed above FAB at bottom: 80px, left: 20px, z-index: 9999 */}
      {isOpen && (
        <div 
          className="fixed bottom-[80px] left-[20px] z-[9999] w-[420px] max-w-[92vw] h-[560px] max-h-[82vh] bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{ 
            position: 'fixed', 
            bottom: '80px', 
            left: '20px', 
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* HEADER */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-md relative">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-1 ring-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm tracking-wide">Miracle AI</h3>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Anti-Hype Wealth Co-Pilot</p>
              </div>
            </div>

            {/* CONTROLS: Clear & Close Buttons */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <button 
                onClick={handleClearChat}
                className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RISK CONTEXT BANNER */}
          {user?.riskProfile && (
            <div className="bg-indigo-950/80 px-4 py-1.5 border-b border-indigo-800/40 flex items-center justify-between text-xs text-indigo-200 shrink-0">
              <span className="flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Context: <strong>{user.riskProfile.category}</strong></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Tailored</span>
            </div>
          )}

          {/* TARGETED CHAT MESSAGES CONTAINER: id="chat-messages" */}
          <div 
            id="chat-messages"
            className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700/60"
          >
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id || idx} 
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div 
                    className={`max-w-[88%] rounded-2xl p-3 text-xs relative group shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-br-none'
                        : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-bl-none'
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
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <div 
                      className={`text-[9px] mt-1.5 flex items-center justify-between gap-2 ${
                        isUser ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.model && <span className="font-mono text-[9px] opacity-75">{msg.model}</span>}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-bl-none p-2.5 flex items-center gap-1.5">
                  <span className="text-xs text-indigo-300 font-medium mr-1">Thinking...</span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPTS CAROUSEL */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-600/40 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all duration-200 flex items-center gap-1 flex-shrink-0 shadow-sm"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>

          {/* ENLARGED INPUT FORM */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Miracle about SIPs, crypto, stocks..."
              disabled={loading}
              className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner font-medium"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
