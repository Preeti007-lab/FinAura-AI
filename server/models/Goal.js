const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Emergency Fund', 'House Down Payment', 'Early Retirement', 'Child Education', 'Wealth Accumulation', 'Dream Car'],
    default: 'Wealth Accumulation'
  },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetYears: { type: Number, required: true },
  monthlySipRequired: { type: Number, default: 0 },
  expectedReturnRate: { type: Number, default: 12 },
  stepUpPercentage: { type: Number, default: 5 },
  riskAdjustedAllocation: {
    equity: { type: Number, default: 60 },
    debt: { type: Number, default: 30 },
    gold: { type: Number, default: 10 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
