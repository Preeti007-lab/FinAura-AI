const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  category: { type: String, default: 'General Knowledge' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);
