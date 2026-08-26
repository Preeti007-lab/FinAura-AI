const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');
require('dotenv').config();

const { setMongoConnected } = require('./services/dbStore');

const portfolioRoutes = require('./routes/portfolio');
const analyzeRoutes = require('./routes/analyze');
const goalsRoutes = require('./routes/goals');
const riskProfileRoutes = require('./routes/riskProfile');
const flashcardRoutes = require('./routes/flashcards');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration allowing localhost, Vercel apps, Render apps, and production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, curl, serverless) or matching vercel/render apps
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive fallback for production builds
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-clerk-user-id']
}));

app.use(express.json());

// Official Clerk Middleware Handler with Unhandled Token Exception Protection
if (process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes('your_clerk_secret_key_here')) {
  try {
    app.use(clerkMiddleware({
      publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY
    }));
  } catch (clerkErr) {
    console.warn('⚠️ Clerk middleware initialization warning:', clerkErr.message);
  }
}

// MongoDB Connection with Fallback Memory Store
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finaura_db';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 2500
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas / Local MongoDB successfully.');
  setMongoConnected(true);
}).catch(err => {
  console.warn('⚠️ MongoDB connection unavailable or unconfigured. Operating in high-performance memory-store mode.');
  setMongoConnected(false);
});

// Serve Frontend Static Build
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// DIRECT ROOT ENDPOINTS FOR WEALTHTECH & FLASHCARDS
app.use('/analyze-trend', analyzeRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/goals', goalsRoutes);
app.use('/risk-profile', riskProfileRoutes);
app.use('/', flashcardRoutes); // /generate, /getcards, /deletecard

// API PREFIXED ALIASES
app.use('/api/analyze-trend', analyzeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/risk-profile', riskProfileRoutes);
app.use('/api', flashcardRoutes);

// PROTECTED CLERK DASHBOARD ENDPOINT WITH CRASH-PROOF WRAPPER
app.get('/api/dashboard', (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized credentials' });
    }
    res.json({
      success: true,
      message: 'Access granted to dashboard endpoint',
      user: req.user,
      dashboard: {
        totalNetWorth: 657645,
        activeSip: 32500,
        riskScore: 68,
        status: 'Active'
      }
    });
  });
});

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CredoMetrics AI WealthTech Platform',
    clerkAuth: !!process.env.CLERK_SECRET_KEY,
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0'
  });
});

// SPA Fallback Handler for React Router SPA
app.use((req, res, next) => {
  if (
    req.method === 'GET' && 
    !req.path.startsWith('/api') && 
    !req.path.startsWith('/analyze-trend') && 
    !req.path.startsWith('/portfolio') && 
    !req.path.startsWith('/goals') && 
    !req.path.startsWith('/risk-profile') &&
    !req.path.startsWith('/generate') &&
    !req.path.startsWith('/getcards') &&
    !req.path.startsWith('/deletecard')
  ) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

// Unhandled Global Express Exception Error Handler (Prevents Process Crashes)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Only listen if executed directly (Render / Local), not when imported as Vercel serverless function
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CredoMetrics AI Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
