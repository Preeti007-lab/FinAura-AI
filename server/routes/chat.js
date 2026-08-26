const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../services/aiService');

/**
 * POST /
 * Main endpoint for AI Chatbot interactions
 */
router.post('/', async (req, res) => {
  try {
    const { message, history, conversationHistory, userContext, riskProfile } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required.'
      });
    }

    const mergedHistory = history || conversationHistory || [];
    const mergedContext = {
      riskProfile: riskProfile || userContext?.riskProfile || { score: 68, category: 'Growth Investor' }
    };

    const result = await chatWithAI(message.trim(), mergedHistory, mergedContext);

    return res.json(result);
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your chat request.',
      message: err.message
    });
  }
});

module.exports = router;
