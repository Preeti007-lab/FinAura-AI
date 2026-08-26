# 🚀 CredoMetrics AI (FinAura AI) — Gen-AI WealthTech Platform

**CredoMetrics AI** is an institutional-grade, Gen-AI powered WealthTech platform designed to help investors filter out social media financial hype, automate risk profiling, consolidate multi-asset portfolios, and simulate inflation-adjusted goal SIPs.

---

## 🌟 Core Functionality

- 🚨 **Anti-Hype AI Social Audit**: Audits finfluencer tips, Telegram pump claims, and stock hype against SEC/SEBI data, generating a **0–100 Hype Score**, sentiment classification, red flags, and risk warnings.
- 📋 **Institutional Risk Profiling Engine**: 5-step SEBI risk survey assessing dip tolerance, drawdown caps, and investment horizons with auto-saving `localStorage` progress.
- 💼 **Multi-Asset Consolidated Portfolio Tracker**: Aggregates stocks, mutual funds, gold (SGBs/ETFs), crypto, and cash into a single real-time net-worth dashboard.
- 🎯 **Goal SIP Advisory**: Simulates compound growth curves, step-up monthly SIPs, and target milestones (Retirement, Home Purchase, Education).
- 🔮 **Miracle AI Assistant (Co-Pilot)**: Right-aligned floating 24/7 AI chat assistant powered by a 14-domain financial intent engine.
- 🎴 **Interactive Compounding Flashcards**: State-driven flip card deck covering Rule of 72, 50/30/20 ratio, Sharpe ratio, 4% SWP rule, and tax optimization.

---

## 🏗️ Architecture & Technology Stack

```
FinAura-AI / CredoMetrics
├── client/                     # Vite + React Frontend SPA
│   ├── src/
│   │   ├── components/         # Modular React Views & Modals (Landing, Dashboard, HypeAnalyzer, AIChatbot)
│   │   ├── services/           # Frontend API Axios Client
│   │   └── index.css           # Tailwind CSS v4 + High-Contrast Light/Dark Design System
│   └── vite.config.js          # Vite Config + @tailwindcss/vite Plugin
├── server/                     # Node.js + Express REST API Server
│   ├── routes/                 # API Endpoint Controllers (analyze, portfolio, goals, ai)
│   ├── services/               # AI Engine (Groq Llama-3.3-70B + Heuristic Engine) & Memory DB
│   └── index.js                # Server Entry Point (Port 5000)
└── vercel.json                 # Vercel Production Build & Routing Spec
```

### Stack Details
- **Frontend**: React 18, Vite 8, Tailwind CSS v4, Lucide Icons, Recharts, Clerk Auth SDK.
- **Backend**: Node.js, Express REST API, Groq Llama-3.3-70B LLM Inference Engine.
- **Design System**: High-Contrast Light Mode & Cyberpunk Dark Mode theme engine.
- **Production Hosting**: Live on Vercel (**[https://fin-aura-ai-sage.vercel.app](https://fin-aura-ai-sage.vercel.app)**).

---

## ⚡ Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Preeti007-lab/FinAura-AI.git
cd FinAura-AI

# 2. Install dependencies & run development environment
npm run dev

# 3. Build production bundle
npm run build
```
