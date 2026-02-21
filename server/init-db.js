const mongoose = require('mongoose');
const Computer = require('./models/Computer');

// Initial computer data - 20 computers total
const initialComputers = [
  // Standard Zone (Computers 1-15) - $10/hr
  { id: 'comp_001', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_002', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_003', status: 'занят', price: 10, zone: 'Standard Zone' },
  { id: 'comp_004', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_005', status: 'забронирован', price: 10, zone: 'Standard Zone' },
  { id: 'comp_006', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_007', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_008', status: 'занят', price: 10, zone: 'Standard Zone' },
  { id: 'comp_009', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_010', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_011', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_012', status: 'занят', price: 10, zone: 'Standard Zone' },
  { id: 'comp_013', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_014', status: 'свободен', price: 10, zone: 'Standard Zone' },
  { id: 'comp_015', status: 'свободен', price: 10, zone: 'Standard Zone' },
  
  // VIP Zone (Computers 16-20) - $20/hr
  { id: 'comp_016', status: 'свободен', price: 20, zone: 'VIP Zone' },
  { id: 'comp_017', status: 'свободен', price: 20, zone: 'VIP Zone' },
  { id: 'comp_018', status: 'свободен', price: 20, zone: 'VIP Zone' },
  { id: 'comp_019', status: 'свободен', price: 20, zone: 'VIP Zone' },
  { id: 'comp_020', status: 'свободен', price: 20, zone: 'VIP Zone' }
];

async function initializeDatabase() {
  try {
    const count = await Computer.countDocuments();
    if (count === 0) {
      await Computer.insertMany(initialComputers);
      console.log('✅ Initial computers data inserted - 20 computers (15 Standard, 5 VIP)');
    } else {
      console.log('ℹ️ Computers data already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

module.exports = initializeDatabase;
