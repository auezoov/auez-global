const express = require('express');
const router = express.Router();

// GET /api/finance - Get financial data
router.get('/', async (req, res) => {
  try {
    // Mock financial data
    const financeData = {
      dailyRevenue: 12500,
      weeklyRevenue: 87500,
      monthlyRevenue: 350000,
      activeComputers: 12,
      totalComputers: 20,
      occupancyRate: 60,
      recentTransactions: [
        {
          id: 'txn_001',
          userId: 1,
          computerId: 'comp_001',
          duration: 45,
          cost: 450,
          timestamp: new Date(),
          status: 'completed'
        },
        {
          id: 'txn_002',
          userId: 2,
          computerId: 'comp_005',
          duration: 30,
          cost: 300,
          timestamp: new Date(Date.now() - 3600000),
          status: 'completed'
        }
      ],
      expenses: {
        rent: 50000,
        electricity: 15000,
        internet: 5000,
        staff: 80000
      }
    };

    res.json(financeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/finance/transaction - Record new transaction
router.post('/transaction', async (req, res) => {
  try {
    const { userId, computerId, duration, cost, paymentMethod } = req.body;
    
    if (!userId || !computerId || !duration || !cost) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock transaction recording
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      computerId,
      duration,
      cost,
      paymentMethod: paymentMethod || 'cash',
      timestamp: new Date(),
      status: 'completed'
    };

    res.json({
      success: true,
      transaction,
      message: 'Transaction recorded successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
