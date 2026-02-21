const mongoose = require('mongoose');
require('dotenv').config();

// Computer Schema
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

const Computer = mongoose.model('Computer', computerSchema);

// Booking Schema
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

const Booking = mongoose.model('Booking', bookingSchema);

async function initializeDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Очистка существующих данных
    await Computer.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Создание 20 компьютеров
    const computers = [];
    for (let i = 1; i <= 20; i++) {
      const computer = new Computer({
        id: `PC-${i.toString().padStart(2, '0')}`,
        status: 'свободен',
        price: 150 + (i % 5) * 50, // Цена от 150 до 350
        lastUpdate: new Date()
      });
      computers.push(computer);
    }

    await Computer.insertMany(computers);
    console.log('💻 Created 20 computers');

    // Создание тестовых бронирований
    const bookings = [
      {
        computerId: 'PC-01',
        userId: 'user-001',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 час назад
        duration: 60,
        totalCost: 150,
        status: 'завершено'
      },
      {
        computerId: 'PC-05',
        userId: 'user-002',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
        endTime: null,
        duration: null,
        totalCost: null,
        status: 'активно'
      }
    ];

    await Booking.insertMany(bookings);
    console.log('📅 Created sample bookings');

    console.log('\n🎉 Database initialized successfully!');
    console.log('📊 Database: computer_club');
    console.log('💻 Collections: computers, bookings');
    console.log('🔢 Computers: 20');
    console.log('📅 Bookings: 2');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

initializeDatabase();
