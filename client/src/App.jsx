import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import HypeAnalyzerPage from './components/HypeAnalyzerPage';
import GoalPlannerPage from './components/GoalPlannerPage';
import AuthModal from './components/AuthModal';
import RiskProfileModal from './components/RiskProfileModal';
import AddAssetModal from './components/AddAssetModal';
import { apiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'dashboard', 'analyzer', 'goals'

  // Mouse Tracking Glow Position
  const [mousePos, setMousePos] = useState({ x: 500, y: 300 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // User Auth State
  const [user, setUser] = useState({
    id: 'demo_investor_99',
    email: 'alex.investor@finaura.app',
    name: 'Alex Vance',
    token: 'demo-token',
    riskProfile: {
      score: 68,
      category: 'Growth / Moderate-Aggressive',
      answers: { horizon: 'long', dipReaction: 'buy', knowledge: 'intermediate', objective: 'balanced' }
    }
  });

  // Modal Controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    async function syncRisk() {
      if (user) {
        const res = await apiService.getRiskProfile(user.token, user.id);
        if (res.success && res.riskProfile) {
          setUser(prev => ({ ...prev, riskProfile: res.riskProfile }));
        }
      }
    }
    syncRisk();
  }, []);

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  const handleUpdateRiskSuccess = (newRiskProfile) => {
    setUser(prev => prev ? { ...prev, riskProfile: newRiskProfile } : null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* INTERACTIVE MOUSE-TRACKING AMBIENT GLOW LAYER */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08) 50%, transparent 80%)`
        }}
      />

      {/* Navigation Header (Fixed at top) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenRiskModal={() => setIsRiskModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main Content View (Padded 72px top for Navbar clearance) */}
      <main className="flex-1 pt-20 relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'dashboard' && (
          user ? (
            <DashboardPage
              user={user}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenRiskModal={() => setIsRiskModalOpen(true)}
            />
          ) : (
            <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Authentication Required</h2>
              <p className="text-xs text-slate-400">Please log in or sign up to view your consolidated portfolio dashboard.</p>
              <button onClick={() => handleOpenAuthModal('login')} className="btn-primary py-3 px-6 text-xs inline-flex">
                Log In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'analyzer' && (
          user ? (
            <HypeAnalyzerPage
              user={user}
              onOpenRiskModal={() => setIsRiskModalOpen(true)}
            />
          ) : (
            <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Authentication Required</h2>
              <p className="text-xs text-slate-400">Please log in or sign up to use the AI Hype & Sentiment Analyzer.</p>
              <button onClick={() => handleOpenAuthModal('login')} className="btn-primary py-3 px-6 text-xs inline-flex">
                Log In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'goals' && (
          user ? (
            <GoalPlannerPage
              user={user}
              onOpenRiskModal={() => setIsRiskModalOpen(true)}
            />
          ) : (
            <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Authentication Required</h2>
              <p className="text-xs text-slate-400">Please log in or sign up to access the Goal Planner & SIP Advisory tool.</p>
              <button onClick={() => handleOpenAuthModal('login')} className="btn-primary py-3 px-6 text-xs inline-flex">
                Log In Now
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <RiskProfileModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        user={user}
        onUpdateSuccess={handleUpdateRiskSuccess}
      />

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        user={user}
        onItemAdded={() => {}}
      />

    </div>
  );
}
