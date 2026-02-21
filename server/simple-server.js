const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5173/auez-global'],
  credentials: true
}));
app.use(express.json());

// Mock data
const computers = [
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date()
  });
});

app.get('/api/computers', (req, res) => {
  res.json(computers);
});

app.patch('/api/computers/:id', (req, res) => {
  const { status } = req.body;
  const computer = computers.find(c => c.id === req.params.id);
  if (computer) {
    computer.status = status;
    res.json(computer);
  } else {
    res.status(404).json({ error: 'Computer not found' });
  }
});

app.get('/api/session/active', (req, res) => {
  const { userId } = req.query;
  res.json({
    userId: parseInt(userId) || 1,
    sessionId: `session_${Date.now()}`,
    startTime: new Date(),
    status: 'active',
    computerId: 'comp_001',
    remainingTime: 45 * 60,
    totalCost: 450
  });
});

app.get('/api/finance', (req, res) => {
  res.json({
    dailyRevenue: 12500,
    weeklyRevenue: 87500,
    monthlyRevenue: 350000,
    activeComputers: 12,
    totalComputers: 20,
    occupancyRate: 60,
    recentTransactions: [
      {
        id: 'txn_001',
        userId: 1,
        computerId: 'comp_001',
        duration: 45,
        cost: 450,
        timestamp: new Date(),
        status: 'completed'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
