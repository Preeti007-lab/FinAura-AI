const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');
const { generateFlashcards } = require('../services/aiService');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// POST /generate -> Generate AI flashcards & store in DB
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, count } = req.body;
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ success: false, message: 'Topic is required to generate flashcards' });
    }

    const userId = req.user.id;
    const cardCount = Math.max(1, Math.min(6, Number(count) || 3));

    // Generate flashcards using Groq AI / AI Engine
    const generatedItems = await generateFlashcards(topic, cardCount);

    const createdCards = [];
    for (const item of generatedItems) {
      const cardDoc = {
        _id: 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        userId,
        topic: topic.trim(),
        question: item.question,
        answer: item.answer,
        difficulty: item.difficulty || 'Medium',
        createdAt: new Date()
      };

      if (getMongoConnected()) {
        const doc = new Flashcard(cardDoc);
        await doc.save();
      } else {
        memoryDb.flashcards.unshift(cardDoc);
      }
      createdCards.push(cardDoc);
    }

    res.status(201).json({
      success: true,
      message: `Successfully generated ${createdCards.length} flashcards for "${topic}"`,
      cards: createdCards
    });
  } catch (err) {
    console.error('Error in /generate:', err);
    res.status(500).json({ success: false, message: 'Failed to generate flashcards' });
  }
});

// GET /getcards -> Retrieve all stored flashcards for user
router.get('/getcards', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let cards = [];

    if (getMongoConnected()) {
      cards = await Flashcard.find({ userId }).sort({ createdAt: -1 });
    } else {
      cards = memoryDb.flashcards.filter(c => c.userId === userId || c.userId === 'demo_investor_99');
    }

    res.json({
      success: true,
      count: cards.length,
      cards
    });
  } catch (err) {
    console.error('Error in /getcards:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve flashcards' });
  }
});

// POST /deletecard -> Delete a specific flashcard by cardId
router.post('/deletecard', authMiddleware, async (req, res) => {
  try {
    const { cardId, id } = req.body;
    const targetId = cardId || id;

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'cardId is required to delete' });
    }

    if (getMongoConnected()) {
      await Flashcard.findByIdAndDelete(targetId);
    } else {
      memoryDb.flashcards = memoryDb.flashcards.filter(c => c._id !== targetId);
    }

    res.json({
      success: true,
      message: 'Flashcard deleted successfully',
      deletedId: targetId
    });
  } catch (err) {
    console.error('Error in /deletecard:', err);
    res.status(500).json({ success: false, message: 'Failed to delete flashcard' });
  }
});

// DELETE /deletecard/:id fallback
router.delete('/deletecard/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoConnected()) {
      await Flashcard.findByIdAndDelete(id);
    } else {
      memoryDb.flashcards = memoryDb.flashcards.filter(c => c._id !== id);
    }
    res.json({ success: true, message: 'Flashcard deleted successfully', deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete flashcard' });
  }
});

module.exports = router;
