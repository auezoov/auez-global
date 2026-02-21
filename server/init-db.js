const mongoose = require('mongoose');
const Computer = require('./models/Computer');

// Initial computer data
const initialComputers = [
  { id: 'comp_001', status: 'свободен', price: 10 },
  { id: 'comp_002', status: 'свободен', price: 10 },
  { id: 'comp_003', status: 'занят', price: 15 },
  { id: 'comp_004', status: 'свободен', price: 10 },
  { id: 'comp_005', status: 'забронирован', price: 20 },
  { id: 'comp_006', status: 'свободен', price: 10 },
  { id: 'comp_007', status: 'свободен', price: 10 },
  { id: 'comp_008', status: 'занят', price: 15 },
  { id: 'comp_009', status: 'свободен', price: 10 },
  { id: 'comp_010', status: 'свободен', price: 10 },
  { id: 'comp_011', status: 'свободен', price: 10 },
  { id: 'comp_012', status: 'занят', price: 15 },
  { id: 'comp_013', status: 'свободен', price: 10 },
  { id: 'comp_014', status: 'свободен', price: 10 },
  { id: 'comp_015', status: 'свободен', price: 10 },
  { id: 'comp_016', status: 'свободен', price: 10 },
  { id: 'comp_017', status: 'свободен', price: 10 },
  { id: 'comp_018', status: 'свободен', price: 10 },
  { id: 'comp_019', status: 'свободен', price: 10 },
  { id: 'comp_020', status: 'свободен', price: 10 }
];

async function initializeDatabase() {
  try {
    const count = await Computer.countDocuments();
    if (count === 0) {
      await Computer.insertMany(initialComputers);
      console.log('✅ Initial computers data inserted');
    } else {
      console.log('ℹ️ Computers data already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

module.exports = initializeDatabase;
