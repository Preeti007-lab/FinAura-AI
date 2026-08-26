import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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

  // Clerk User Hook
  let clerkUserObj = null;
  let clerkIsSignedIn = false;
  try {
    const clerk = useUser();
    clerkUserObj = clerk?.user;
    clerkIsSignedIn = clerk?.isSignedIn;
  } catch (e) {
    // Graceful fallback when ClerkProvider is unconfigured
  }

  // Mouse Tracking Glow Position
  const [mousePos, setMousePos] = useState({ x: 500, y: 300 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Theme Management: 'dark' | 'light' | 'system'
  const [theme, setTheme] = useState(() => localStorage.getItem('finaura_theme') || 'system');

  useEffect(() => {
    localStorage.setItem('finaura_theme', theme);
    
    const applyTheme = () => {
      let active = theme;
      if (theme === 'system') {
        active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', active);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Sync route pathname or Clerk sign-in state
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/dashboard' || path === '/sign-up' || path === '/sign-in' || clerkIsSignedIn) {
      setActiveTab('dashboard');
    }
  }, [clerkIsSignedIn]);

  // User Session State (Clerk User or Fallback Demo Investor)
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

  // Sync Clerk User Object when signed in
  useEffect(() => {
    if (clerkIsSignedIn && clerkUserObj) {
      setUser({
        id: clerkUserObj.id,
        email: clerkUserObj.primaryEmailAddress?.emailAddress || 'investor@credometrics.app',
        name: clerkUserObj.fullName || clerkUserObj.firstName || 'Clerk User',
        token: 'clerk-token',
        riskProfile: user?.riskProfile || { score: 68, category: 'Growth Investor' }
      });
    }
  }, [clerkIsSignedIn, clerkUserObj]);

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
    setActiveTab('dashboard');
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

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        theme={theme}
        setTheme={setTheme}
        onOpenRiskModal={() => setIsRiskModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main Content View */}
      <main className="flex-1 pt-20 relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            user={user || { id: 'demo_investor_99', name: 'Verified Investor' }}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenRiskModal={() => setIsRiskModalOpen(true)}
          />
        )}

        {activeTab === 'analyzer' && (
          <HypeAnalyzerPage
            user={user || { id: 'demo_investor_99', name: 'Verified Investor' }}
            onOpenRiskModal={() => setIsRiskModalOpen(true)}
          />
        )}

        {activeTab === 'goals' && (
          <GoalPlannerPage
            user={user || { id: 'demo_investor_99', name: 'Verified Investor' }}
            onOpenRiskModal={() => setIsRiskModalOpen(true)}
          />
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
