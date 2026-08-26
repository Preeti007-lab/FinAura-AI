const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const { memoryDb, getMongoConnected } = require('../services/dbStore');

// GET /api/portfolio -> Consolidated holdings, Net worth, Spend analytics
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let holdings = [];
    let transactions = [];

    if (getMongoConnected()) {
      holdings = await Portfolio.find({ userId });
      transactions = await Transaction.find({ userId }).sort({ date: -1 });
    } else {
      holdings = memoryDb.portfolios.filter(p => p.userId === userId || p.userId === 'demo_investor_99');
      transactions = memoryDb.transactions.filter(t => t.userId === userId || t.userId === 'demo_investor_99');
    }

    // Calculate Net Worth & Total Invested
    const totalInvested = holdings.reduce((sum, item) => sum + (item.investedValue || 0), 0);
    const totalCurrent = holdings.reduce((sum, item) => sum + (item.currentValue || 0), 0);
    const totalGain = totalCurrent - totalInvested;
    const overallReturnPct = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;

    // Calculate Asset Allocation Breakdown
    const assetBreakdownMap = {};
    holdings.forEach(item => {
      const cls = item.assetClass || 'Other';
      assetBreakdownMap[cls] = (assetBreakdownMap[cls] || 0) + item.currentValue;
    });

    const assetAllocation = Object.keys(assetBreakdownMap).map(cls => ({
      name: cls,
      value: assetBreakdownMap[cls],
      percentage: totalCurrent > 0 ? parseFloat(((assetBreakdownMap[cls] / totalCurrent) * 100).toFixed(1)) : 0
    }));

    // Calculate Spending Analytics by Category
    const spendCategoryMap = {};
    let totalMonthlySpend = 0;
    transactions.filter(t => t.type === 'expense').forEach(t => {
      spendCategoryMap[t.category] = (spendCategoryMap[t.category] || 0) + t.amount;
      totalMonthlySpend += t.amount;
    });

    const spendingAnalytics = Object.keys(spendCategoryMap).map(cat => ({
      category: cat,
      amount: spendCategoryMap[cat],
      percentage: totalMonthlySpend > 0 ? parseFloat(((spendCategoryMap[cat] / totalMonthlySpend) * 100).toFixed(1)) : 0
    }));

    res.json({
      success: true,
      summary: {
        totalNetWorth: totalCurrent,
        totalInvested,
        totalGain,
        overallReturnPct: parseFloat(overallReturnPct),
        monthlySpend: totalMonthlySpend
      },
      assetAllocation,
      holdings,
      spendingAnalytics,
      recentTransactions: transactions.slice(0, 10)
    });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio data' });
  }
});

// POST /api/portfolio/add -> Add asset holding or transaction
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, name, assetClass, ticker, quantity, avgBuyPrice, currentPrice, amount, category, title } = req.body;

    if (type === 'transaction') {
      const newTx = {
        _id: 'tx_' + Date.now(),
        userId,
        title: title || name || 'Expense/Investment',
        category: category || 'SIP / Investment',
        amount: Number(amount) || 0,
        type: req.body.txType || 'expense',
        date: new Date()
      };

      if (getMongoConnected()) {
        const doc = new Transaction(newTx);
        await doc.save();
      } else {
        memoryDb.transactions.unshift(newTx);
      }
      return res.status(201).json({ success: true, message: 'Transaction added successfully', item: newTx });
    }

    // Default: Add Portfolio Investment Holding
    const qty = Number(quantity) || 1;
    const buyPrice = Number(avgBuyPrice) || Number(currentPrice) || 100;
    const currPrice = Number(currentPrice) || buyPrice;
    const invested = qty * buyPrice;
    const currentVal = qty * currPrice;
    const profit = currentVal - invested;
    const profitPct = invested > 0 ? parseFloat(((profit / invested) * 100).toFixed(2)) : 0;

    const newHolding = {
      _id: 'port_' + Date.now(),
      userId,
      name: name || 'New Asset',
      assetClass: assetClass || 'Equity/Stocks',
      ticker: ticker ? ticker.toUpperCase() : 'ASSET',
      quantity: qty,
      avgBuyPrice: buyPrice,
      currentPrice: currPrice,
      investedValue: invested,
      currentValue: currentVal,
      unrealizedProfit: profit,
      profitPercentage: profitPct,
      lastUpdated: new Date()
    };

    if (getMongoConnected()) {
      const doc = new Portfolio(newHolding);
      await doc.save();
    } else {
      memoryDb.portfolios.unshift(newHolding);
    }

    res.status(201).json({ success: true, message: 'Investment added to portfolio successfully', item: newHolding });
  } catch (err) {
    console.error('Error adding to portfolio:', err);
    res.status(500).json({ success: false, message: 'Failed to add portfolio item' });
  }
});

// DELETE /api/portfolio/:id -> Remove asset holding
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoConnected()) {
      await Portfolio.findByIdAndDelete(id);
    } else {
      memoryDb.portfolios = memoryDb.portfolios.filter(p => p._id !== id);
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
});

module.exports = router;
