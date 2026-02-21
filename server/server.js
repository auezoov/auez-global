const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const computerRoutes = require('./routes/computers');
const sessionRoutes = require('./routes/session');
const financeRoutes = require('./routes/finance');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const initializeDatabase = require('./init-db');

// Load environment variables
require('./env.js');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://auez-global.vercel.app', 'https://auezoov.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:5173/auez-global'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/computers', computerRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:183349@cluster0.xkfg5yg.mongodb.net/auezdb')
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
})
.catch(err => console.error('❌ DB Error:', err));
