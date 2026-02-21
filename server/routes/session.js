const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/session/active - Get active session for authenticated user
router.get('/active', authMiddleware, async (req, res) => {
  try {
    // Mock response for now
    res.json({ 
      success: false,
      session: null,
      message: "No active session"
    });
    
    // const activeSession = await Session.findOne({ 
    //   userId: req.user.userId,
    //   status: 'active'
    // }).populate('userId', 'phone');
    
    // res.json({ 
    //   success: !!activeSession,
    //   session: activeSession 
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/session/start - Start new session
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { computerId, duration } = req.body;
    
    // Check if user already has active session
    const existingSession = await Session.findOne({ 
      userId: req.user.userId,
      status: 'active'
    });
    
    if (existingSession) {
      return res.status(400).json({ error: 'User already has active session' });
    }
    
    const newSession = new Session({
      userId: req.user.userId,
      computerId,
      startTime: new Date(),
      cost: duration * 50, // 50 tenge per minute
      status: 'active'
    });
    
    await newSession.save();
    
    res.json({ 
      success: true,
      session: newSession 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/session/end/:sessionId - End session
router.post('/end/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ 
      _id: sessionId,
      userId: req.user.userId,
      status: 'active'
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.endTime = new Date();
    session.status = 'completed';
    await session.save();
    
    res.json({ 
      success: true,
      session 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint for backward compatibility (non-authenticated)
router.get('/legacy/active', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Mock active session data for backward compatibility
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

module.exports = router;
