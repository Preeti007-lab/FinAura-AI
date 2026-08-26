const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { setMongoConnected } = require('./services/dbStore');

const portfolioRoutes = require('./routes/portfolio');
const analyzeRoutes = require('./routes/analyze');
const goalsRoutes = require('./routes/goals');
const riskProfileRoutes = require('./routes/riskProfile');
const flashcardRoutes = require('./routes/flashcards');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-clerk-user-id']
}));
app.use(express.json());

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

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FinAura AI WealthTech Platform',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0'
  });
});

// SPA Fallback Handler for any non-API GET requests
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

// Only listen if executed directly (Render / Local), not when imported as Vercel serverless function
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 FinAura AI Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
