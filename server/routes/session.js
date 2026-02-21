const express = require('express');
const router = express.Router();

// GET /api/session/active - Get active session
router.get('/active', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Mock active session data
    const activeSession = {
      userId: parseInt(userId),
      sessionId: `session_${Date.now()}`,
      startTime: new Date(),
      status: 'active',
      computerId: 'comp_001',
      remainingTime: 45 * 60, // 45 minutes in seconds
      totalCost: 450
    };

    res.json(activeSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/session/end - End active session
router.post('/end', async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    
    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId and sessionId are required' });
    }

    // Mock session end
    res.json({
      success: true,
      message: 'Session ended successfully',
      finalCost: 450,
      duration: 45
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
