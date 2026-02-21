const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const verificationCodes = new Map();

router.post('/request-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const code = '1234';
    verificationCodes.set(phone, code);
    
    console.log(`Verification code for ${phone}: ${code}`);
    
    res.json({ message: 'Code sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code required' });
    }

    const storedCode = verificationCodes.get(phone);
    if (storedCode !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    verificationCodes.delete(phone);

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, phone: user.phone, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
