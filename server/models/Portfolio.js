const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  assetClass: { 
    type: String, 
    enum: ['Equity/Stocks', 'Mutual Funds', 'Fixed Savings', 'Gold & Precious', 'Crypto/Alternate'], 
    required: true 
  },
  ticker: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  avgBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  investedValue: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  unrealizedProfit: { type: Number, default: 0 },
  profitPercentage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
