const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: 'Investor' },
  avatar: { type: String, default: '' },
  riskProfile: {
    score: { type: Number, default: 65 }, // 1 to 100
    category: { type: String, default: 'Growth / Moderate-Aggressive' }, // Conservative, Balanced, Growth, Aggressive
    answers: { type: Object, default: {} },
    updatedAt: { type: Date, default: Date.now }
  },
  netWorthGoal: { type: Number, default: 10000000 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
