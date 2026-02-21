const express = require('express');
const router = express.Router();
const Computer = require('../models/Computer');
const Booking = require('../models/Booking');

// GET /api/computers - Get all computers
router.get('/', async (req, res) => {
  try {
    const computers = await Computer.find();
    res.json(computers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/computers/:id - Update computer status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['свободен', 'занят', 'забронирован'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const computer = await Computer.findOneAndUpdate(
      { id: req.params.id },
      { 
        status,
        lastUpdate: new Date()
      },
      { new: true, upsert: true }
    );

    res.json(computer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/computers/:id/book - Create booking and update computer status
router.post('/:id/book', async (req, res) => {
  try {
    const { userId, duration } = req.body;
    
    if (!userId || !duration) {
      return res.status(400).json({ error: 'userId and duration are required' });
    }

    // Check if computer is available
    const computer = await Computer.findOne({ id: req.params.id });
    if (!computer) {
      return res.status(404).json({ error: 'Computer not found' });
    }
    
    if (computer.status !== 'свободен') {
      return res.status(400).json({ error: 'Computer is not available' });
    }

    // Calculate cost
    const totalCost = computer.price * duration;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Create booking
    const booking = new Booking({
      computerId: req.params.id,
      userId,
      startTime,
      endTime,
      duration,
      totalCost,
      status: 'активно'
    });

    await booking.save();

    // Update computer status
    await Computer.findOneAndUpdate(
      { id: req.params.id },
      { 
        status: 'занят',
        lastUpdate: new Date()
      }
    );

    res.json({
      success: true,
      booking: {
        id: booking._id,
        computerId: req.params.id,
        userId,
        startTime,
        endTime,
        duration,
        totalCost,
        status: 'активно'
      },
      computer: {
        id: req.params.id,
        status: 'занят',
        price: computer.price
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/computers/:id/bookings - Get booking history for a computer
router.get('/:id/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ computerId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
