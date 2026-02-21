const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  computerId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // в минутах
  },
  totalCost: {
    type: Number
  },
  status: {
    type: String,
    enum: ['активно', 'завершено', 'отменено'],
    default: 'активно'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
