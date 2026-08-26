const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  queryText: { type: String, required: true },
  assetName: { type: String, default: 'General Trend' },
  hypeScore: { type: Number, required: true }, // 0 to 100
  sentiment: { type: String, enum: ['Bullish Hype', 'Moderately Bullish', 'Neutral / Fact-based', 'High Risk / Pump & Dump', 'Bearish Caution'], required: true },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme Speculative'], required: true },
  redFlags: [{ type: String }],
  factualSummary: { type: String, required: true },
  recommendation: { type: String, required: true },
  riskSuitability: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
