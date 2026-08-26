const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['SIP / Investment', 'Shopping & Tech', 'Housing & Bills', 'Food & Dining', 'Travel & Fuel', 'Income / Dividend'],
    required: true
  },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['expense', 'income', 'investment'], default: 'expense' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
