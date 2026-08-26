const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Goal = require('../models/Goal');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// Helper function to calculate SIP details & projections
function calculateSipRecommendation(targetAmount, targetYears, currentAmount = 0, expectedReturnRate = 12, stepUpPct = 5) {
  const months = targetYears * 12;
  const monthlyRate = expectedReturnRate / 12 / 100;
  
  // Future value of current principal
  const futureCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
  const remainingTarget = Math.max(0, targetAmount - futureCurrent);

  // Exact SIP required formula (FV of Annuity)
  let monthlySip = 0;
  if (remainingTarget > 0 && months > 0) {
    if (monthlyRate > 0) {
      monthlySip = (remainingTarget * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlySip = remainingTarget / months;
    }
  }

  // Risk-adjusted asset allocation strategy based on investment tenure
  let equity = 70;
  let debt = 20;
  let gold = 10;

  if (targetYears <= 3) {
    // Short term goal: preserve capital
    equity = 25;
    debt = 65;
    gold = 10;
  } else if (targetYears <= 7) {
    // Medium term goal: balanced growth
    equity = 60;
    debt = 30;
    gold = 10;
  } else {
    // Long term goal: wealth accumulation
    equity = 80;
    debt = 10;
    gold = 10;
  }

  // Build 10-point projection curve for visualization
  const projectionCurve = [];
  let investedSum = currentAmount;
  let corpusVal = currentAmount;
  let currentMonthlySip = monthlySip;

  for (let year = 1; year <= targetYears; year++) {
    for (let m = 1; m <= 12; m++) {
      corpusVal = (corpusVal + currentMonthlySip) * (1 + monthlyRate);
      investedSum += currentMonthlySip;
    }
    projectionCurve.push({
      year: `Yr ${year}`,
      invested: Math.round(investedSum),
      estimatedWealth: Math.round(corpusVal),
      targetGoal: Math.round(targetAmount)
    });
    // Step-up annual increase
    currentMonthlySip *= (1 + (stepUpPct / 100));
  }

  return {
    monthlySipRequired: Math.round(monthlySip),
    totalTarget: targetAmount,
    projectedCorpus: Math.round(corpusVal),
    riskAdjustedAllocation: { equity, debt, gold },
    projectionCurve
  };
}

// GET /api/goals -> Retrieve user goals with SIP projections
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let list = [];

    if (getMongoConnected()) {
      list = await Goal.find({ userId });
    } else {
      list = memoryDb.goals.filter(g => g.userId === userId || g.userId === 'demo_investor_99');
    }

    const enhancedGoals = list.map(g => {
      const rec = calculateSipRecommendation(
        g.targetAmount,
        g.targetYears,
        g.currentAmount || 0,
        g.expectedReturnRate || 12,
        g.stepUpPercentage || 5
      );

      return {
        ...g.toObject ? g.toObject() : g,
        monthlySipRequired: rec.monthlySipRequired,
        riskAdjustedAllocation: rec.riskAdjustedAllocation,
        projectionCurve: rec.projectionCurve,
        progressPercentage: Math.min(100, parseFloat(((g.currentAmount / g.targetAmount) * 100).toFixed(1)))
      };
    });

    res.json({ success: true, goals: enhancedGoals });
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch goals' });
  }
});

// POST /api/goals -> Create or update financial goal milestone
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, targetAmount, currentAmount, targetYears, expectedReturnRate, stepUpPercentage } = req.body;

    if (!title || !targetAmount || !targetYears) {
      return res.status(400).json({ success: false, message: 'Title, target amount, and timeline are required' });
    }

    const tgtAmt = Number(targetAmount);
    const currAmt = Number(currentAmount) || 0;
    const tgtYrs = Number(targetYears);
    const expReturn = Number(expectedReturnRate) || 12;
    const stepUp = Number(stepUpPercentage) || 5;

    const rec = calculateSipRecommendation(tgtAmt, tgtYrs, currAmt, expReturn, stepUp);

    const newGoal = {
      _id: 'goal_' + Date.now(),
      userId,
      title,
      category: category || 'Wealth Accumulation',
      targetAmount: tgtAmt,
      currentAmount: currAmt,
      targetYears: tgtYrs,
      expectedReturnRate: expReturn,
      stepUpPercentage: stepUp,
      monthlySipRequired: rec.monthlySipRequired,
      riskAdjustedAllocation: rec.riskAdjustedAllocation,
      createdAt: new Date()
    };

    if (getMongoConnected()) {
      const doc = new Goal(newGoal);
      await doc.save();
    } else {
      memoryDb.goals.unshift(newGoal);
    }

    res.status(201).json({
      success: true,
      message: 'Goal created and SIP path calculated successfully',
      goal: {
        ...newGoal,
        projectionCurve: rec.projectionCurve,
        progressPercentage: Math.min(100, parseFloat(((currAmt / tgtAmt) * 100).toFixed(1)))
      }
    });
  } catch (err) {
    console.error('Error saving goal:', err);
    res.status(500).json({ success: false, message: 'Failed to save financial goal' });
  }
});

// DELETE /api/goals/:id -> Remove financial goal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoConnected()) {
      await Goal.findByIdAndDelete(id);
    } else {
      memoryDb.goals = memoryDb.goals.filter(g => g._id !== id);
    }
    res.json({ success: true, message: 'Goal removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
});

module.exports = router;
