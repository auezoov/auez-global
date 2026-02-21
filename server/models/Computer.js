const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['свободен', 'занят', 'забронирован'],
    default: 'свободен'
  },
  price: {
    type: Number,
    required: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Computer', computerSchema);
