const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { analyzeFinancialTrend } = require('../services/aiService');
const Analysis = require('../models/Analysis');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// POST /api/analyze-trend
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { queryText, customRiskScore } = req.body;
    if (!queryText || queryText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query text is required for AI analysis' });
    }

    const userId = req.user.id;
    const userRiskProfile = {
      score: customRiskScore || req.user.riskScore || 65,
      category: (customRiskScore || 65) > 75 ? 'Aggressive' : (customRiskScore || 65) > 50 ? 'Growth / Moderate' : 'Conservative'
    };

    const aiResult = await analyzeFinancialTrend(queryText, userRiskProfile);

    const record = {
      _id: 'ans_' + Date.now(),
      userId,
      queryText,
      assetName: queryText.substring(0, 30),
      hypeScore: aiResult.hypeScore,
      sentiment: aiResult.sentiment,
      riskLevel: aiResult.riskLevel,
      redFlags: aiResult.redFlags,
      factualSummary: aiResult.factualSummary,
      recommendation: aiResult.recommendation,
      riskSuitability: aiResult.riskSuitability,
      createdAt: new Date()
    };

    if (getMongoConnected()) {
      const doc = new Analysis(record);
      await doc.save();
    } else {
      memoryDb.analyses.unshift(record);
    }

    res.json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error('Error analyzing trend:', err);
    res.status(500).json({ success: false, message: 'Failed to process AI trend analysis' });
  }
});

// GET /api/analyze-trend/history -> Retrieve user past analyses
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let list = [];
    if (getMongoConnected()) {
      list = await Analysis.find({ userId }).sort({ createdAt: -1 }).limit(10);
    } else {
      list = memoryDb.analyses.filter(a => a.userId === userId || a.userId === 'demo_investor_99').slice(0, 10);
    }
    res.json({ success: true, history: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
});

module.exports = router;
