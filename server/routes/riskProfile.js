const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// Helper to compute risk score from survey answers
function computeRiskScore(answers) {
  let score = 50; // base score

  // 1. Horizon
  if (answers.horizon === 'long') score += 15;
  else if (answers.horizon === 'medium') score += 5;
  else if (answers.horizon === 'short') score -= 15;

  // 2. Reaction to Market Dip
  if (answers.dipReaction === 'buy') score += 20;
  else if (answers.dipReaction === 'hold') score += 5;
  else if (answers.dipReaction === 'sell') score -= 20;

  // 3. Knowledge
  if (answers.knowledge === 'advanced') score += 10;
  else if (answers.knowledge === 'intermediate') score += 5;
  else if (answers.knowledge === 'beginner') score -= 5;

  // 4. Primary Objective
  if (answers.objective === 'aggressive') score += 15;
  else if (answers.objective === 'balanced') score += 5;
  else if (answers.objective === 'preservation') score -= 15;

  // Clamp 1 to 100
  score = Math.max(10, Math.min(98, score));

  let category = 'Balanced / Moderate Growth';
  if (score < 40) category = 'Conservative Capital Preserver';
  else if (score < 65) category = 'Balanced / Moderate Growth';
  else if (score < 85) category = 'Growth / Moderate-Aggressive';
  else category = 'High-Beta / Aggressive Wealth Builder';

  return { score, category };
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
      answers: { horizon: 'long', dipReaction: 'buy', knowledge: 'intermediate', objective: 'balanced' }
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

    const { score, category } = computeRiskScore(answers);

    const updatedProfile = {
      score,
      category,
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
