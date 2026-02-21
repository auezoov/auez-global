const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const BOT_TOKEN = '8404137291:AAHEyIuigot3KraCJNgU5a5DQrg3d9asYbs';

// Validate Telegram auth data
function validateTelegramAuth(authData) {
  const { hash, ...dataCheck } = authData;
  
  // Create data check string
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map(key => `${key}=${dataCheck[key]}`)
    .join('\n');
  
  // Create secret key
  const secretKey = crypto.createHash('sha256')
    .update(BOT_TOKEN)
    .digest();
  
  // Calculate hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

// POST /api/auth/telegram
router.post('/', async (req, res) => {
  try {
    const authData = req.body;
    
    // Validate Telegram auth
    if (!validateTelegramAuth(authData)) {
      return res.status(400).json({ error: 'Invalid Telegram authentication' });
    }
    
    const { id, first_name, last_name, username } = authData;
    
    // Find or create user
    let user = await User.findOne({ telegramId: id });
    
    if (!user) {
      // Create new user
      user = new User({
        telegramId: id,
        firstName: first_name,
        lastName: last_name || '',
        username: username || '',
        phone: '', // Will be filled later if needed
        balance: 0,
        createdAt: new Date()
      });
      
      await user.save();
    } else {
      // Update user info
      user.firstName = first_name;
      user.lastName = last_name || '';
      user.username = username || '';
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        balance: user.balance
      }
    });
    
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
