const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// Comprehensive helper to evaluate risk tolerance, horizon, and goals
function computeRiskScore(answers) {
  let score = 50; // Base score

  // 1. Goal Type Assessment
  if (answers.goalType === 'retirement') score += 10;
  else if (answers.goalType === 'growth') score += 15;
  else if (answers.goalType === 'home') score += 0;
  else if (answers.goalType === 'preservation') score -= 15;

  // 2. Investment Time Horizon
  if (answers.horizon === 'long') score += 15;
  else if (answers.horizon === 'medium') score += 5;
  else if (answers.horizon === 'short') score -= 15;

  // 3. Reaction to 25% Market Dip
  if (answers.dipReaction === 'buy') score += 20;
  else if (answers.dipReaction === 'hold') score += 5;
  else if (answers.dipReaction === 'sell') score -= 20;

  // 4. Income Stability
  if (answers.incomeStability === 'stable') score += 10;
  else if (answers.incomeStability === 'moderate') score += 5;
  else if (answers.incomeStability === 'variable') score -= 10;

  // 5. Financial Knowledge Level
  if (answers.knowledge === 'advanced') score += 10;
  else if (answers.knowledge === 'intermediate') score += 5;
  else if (answers.knowledge === 'beginner') score -= 5;

  // Clamp score between 10 and 98
  score = Math.max(10, Math.min(98, score));

  // Determine Risk Category, Asset Allocation, Max Drawdown & Personalized Assessment
  let category = 'Balanced / Moderate Growth';
  let recommendedAllocation = { equity: 50, debt: 35, gold: 10, liquid: 5 };
  let maxDrawdown = '-15%';
  let personalizedAssessment = '';

  if (score < 40) {
    category = 'Conservative Capital Preserver';
    recommendedAllocation = { equity: 25, debt: 55, gold: 10, liquid: 10 };
    maxDrawdown = '-8%';
    personalizedAssessment = 'Priority is capital protection and low volatility. Focus on high-quality debt mutual funds, sovereign gold bonds, and high-yield liquid buffers to ensure peace of mind.';
  } else if (score < 65) {
    category = 'Balanced / Moderate Growth';
    recommendedAllocation = { equity: 55, debt: 30, gold: 10, liquid: 5 };
    maxDrawdown = '-14%';
    personalizedAssessment = 'A balanced blend of steady equity growth and debt stability. Suitable for medium-term goals like home purchases or education funds with manageable drawdown cushions.';
  } else if (score < 85) {
    category = 'Growth / Moderate-Aggressive';
    recommendedAllocation = { equity: 75, debt: 15, gold: 5, liquid: 5 };
    maxDrawdown = '-22%';
    personalizedAssessment = 'Optimized for long-term compound wealth accumulation. Capable of enduring short-term market volatility to capture long-term equity market CAGR.';
  } else {
    category = 'High-Beta / Aggressive Wealth Builder';
    recommendedAllocation = { equity: 85, debt: 5, gold: 5, liquid: 5 };
    maxDrawdown = '-30%';
    personalizedAssessment = 'Designed for high risk tolerance and long-term financial freedom goals. Maximizes equity exposure across mid-cap, flexi-cap, and tech sector SIPs to compound wealth rapidly.';
  }

  return {
    score,
    category,
    recommendedAllocation,
    maxDrawdown,
    personalizedAssessment
  };
}

// GET /api/risk-profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let userRecord = null;

    if (getMongoConnected()) {
      userRecord = await User.findOne({ email: req.user.email });
    } else {
      userRecord = memoryDb.users[userId] || memoryDb.users['demo_investor_99'];
    }

    const profile = userRecord?.riskProfile || {
      score: 68,
      category: 'Growth / Moderate-Aggressive',
      recommendedAllocation: { equity: 75, debt: 15, gold: 5, liquid: 5 },
      maxDrawdown: '-22%',
      personalizedAssessment: 'Optimized for long-term compound wealth accumulation. Capable of enduring short-term market volatility to capture long-term equity market CAGR.',
      answers: { goalType: 'retirement', horizon: 'long', dipReaction: 'buy', incomeStability: 'stable', knowledge: 'intermediate' }
    };

    res.json({ success: true, riskProfile: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch risk profile' });
  }
});

// POST /api/risk-profile -> Submit survey questionnaire & update score
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ success: false, message: 'Survey answers are required' });
    }

    const { score, category, recommendedAllocation, maxDrawdown, personalizedAssessment } = computeRiskScore(answers);

    const updatedProfile = {
      score,
      category,
      recommendedAllocation,
      maxDrawdown,
      personalizedAssessment,
      answers,
      updatedAt: new Date()
    };

    if (getMongoConnected()) {
      await User.findOneAndUpdate(
        { email: req.user.email },
        { riskProfile: updatedProfile },
        { upsert: true, new: true }
      );
    } else {
      if (!memoryDb.users[userId]) {
        memoryDb.users[userId] = { id: userId, email: req.user.email, name: req.user.name };
      }
      memoryDb.users[userId].riskProfile = updatedProfile;
    }

    res.json({
      success: true,
      message: 'Risk profile score updated successfully',
      riskProfile: updatedProfile
    });
  } catch (err) {
    console.error('Error updating risk profile:', err);
    res.status(500).json({ success: false, message: 'Failed to update risk profile' });
  }
});

module.exports = router;
