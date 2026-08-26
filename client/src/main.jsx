import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.jsx';

// Error Boundary to prevent Blank Page crashes on any uncaught React runtime error
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 bg-[#111827] border border-rose-500/40 rounded-xl space-y-4 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-rose-400 font-['Outfit']">Application Error</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg text-xs text-white shadow-lg transition-all"
            >
              Reload CredoMetrics App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rawKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// Always wrap App in ClerkProvider so Clerk components never crash with missing context
const PUBLISHABLE_KEY = (rawKey && !rawKey.includes('your_clerk_publishable_key_here')) 
  ? rawKey 
  : 'pk_test_Y2xlcmsuZmluYXVyYS5kZXYk';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        signUpForceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
      >
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
);
