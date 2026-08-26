import React from 'react';
import { Sparkles, Layers, BookOpen, BrainCircuit, ArrowRight, RotateCw } from 'lucide-react';
import { SignUpButton, SignInButton } from '@clerk/clerk-react';
import FlashCardItem from './FlashCardItem';

export default function HomePage({ setActiveTab }) {
  const sampleCard = {
    _id: 'demo_sample',
    topic: 'Artificial Intelligence',
    question: 'What is a Large Language Model (LLM)?',
    answer: 'An LLM is a deep learning model trained on massive text datasets using Transformer neural network architectures to understand, generate, and process human language.',
    difficulty: 'Medium'
  };

  return (
    <div className="space-y-20 pb-20 pt-6 max-w-7xl mx-auto px-4">
      
      {/* HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Glow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Powered by Groq Llama-3 AI & Express Backend</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.12]">
          Instant AI Flashcards for <span className="gradient-text">Smarter Learning</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Generate structured, interactive study flashcards on any topic in seconds using Groq AI. Study with 3D flip cards and store your personalized collection.
        </p>

        {/* Auth CTA Buttons - Clerk Exclusive */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <SignUpButton mode="modal">
            <button className="btn-primary text-base py-3.5 px-8 rounded-2xl w-full sm:w-auto justify-center">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <button className="btn-glass text-base py-3.5 px-8 rounded-2xl w-full sm:w-auto justify-center">
              Log In to FlashGen
            </button>
          </SignInButton>
        </div>

      </section>

      {/* SAMPLE INTERACTIVE FLASHCARD DEMO */}
      <section className="max-w-md mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5">
          <RotateCw className="w-4 h-4" /> Try Clicking the Sample Flashcard Below:
        </span>
        <FlashCardItem card={sampleCard} showDelete={false} />
      </section>

      {/* THREE CORE FEATURES */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">Everything You Need to Master Concepts</h2>
          <p className="text-xs sm:text-sm text-slate-400">Powered by Llama-3 70B for instant, highly accurate question generation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={() => setActiveTab('generate')}
            className="flashcard flashcard-interactive p-8 text-center border-indigo-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="badge badge-blue mb-2">Groq Llama-3 AI</span>
              <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Instant Generation</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Type any subject, textbook chapter, or exam topic. Groq AI generates structured questions, answers, and difficulty levels in milliseconds.
              </p>
            </div>
            <div className="text-xs font-extrabold text-indigo-400 flex items-center justify-center gap-1">
              Try FlashGen Engine <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveTab('mycards')}
            className="flashcard flashcard-interactive p-8 text-center border-emerald-500/30 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="badge badge-green mb-2">MongoDB Persistence</span>
              <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Personalized Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                All your generated cards are automatically saved in your personal database vault. Filter by topic, search concepts, or delete cards anytime.
              </p>
            </div>
            <div className="text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1">
              View Collection <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 */}
          <SignUpButton mode="modal">
            <div className="flashcard flashcard-interactive p-8 text-center border-pink-500/30 flex flex-col justify-between cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="badge badge-amber mb-2">3D Active Flip</span>
                <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Interactive Flip UI</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Test your knowledge using smooth 3D flip card interactions. Question on front, detailed answer on back.
                </p>
              </div>
              <div className="text-xs font-extrabold text-pink-400 flex items-center justify-center gap-1">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </SignUpButton>

        </div>

      </section>

    </div>
  );
}
