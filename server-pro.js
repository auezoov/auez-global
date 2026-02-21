import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { WebSocketServer } from 'ws'
import http from 'http'
import { networkInterfaces } from 'os'
import fs from 'fs'

config()

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ port: 3002 })
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || '0.0.0.0'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const NODE_ENV = process.env.NODE_ENV || 'development'
const DB_PATH = process.env.DB_PATH || './auez.db'

// Get local IP address for mobile access
function getLocalIP() {
  const nets = networkInterfaces()
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

const LOCAL_IP = getLocalIP()

// ADD LOGGING to the top
app.use((req, res, next) => { 
  console.log('REQ:', req.method, req.url); 
  next(); 
});

// Triple logging
app.use((req, res, next) => { 
  console.log('!!! SERVER RECEIVED REQUEST:', req.url); 
  next(); 
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Add ngrok-skip-browser-warning header to all responses
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'any-value');
  next();
});

app.use(express.json())

// Serve static files from dist folder (production build)
app.use(express.static('dist'))

// Database setup
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log(`Connected to SQLite database at ${DB_PATH}`)
  }
})

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Club settings table
  db.run(`CREATE TABLE IF NOT EXISTS club_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT DEFAULT 'AUEZ Arena',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Transactions table for real finance data
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // PC statuses table
  db.run(`CREATE TABLE IF NOT EXISTS pc_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pc_id TEXT NOT NULL,
    zone TEXT NOT NULL,
    status TEXT NOT NULL,
    current_user TEXT,
    session_start DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Seed admin user if not exists
  db.get("SELECT COUNT(*) as count FROM users WHERE phone = '777'", (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err.message)
      return
    }
    
    if (row.count === 0) {
      const adminPassword = bcrypt.hashSync('123', 10)
      db.run(
        "INSERT INTO users (name, phone, password, balance, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
        ['Админ', '777', adminPassword, 5000],
        (err) => {
          if (err) {
            console.error('Error inserting admin user:', err.message)
          } else {
            console.log('✅ Admin user seeded: Админ / 777 / 123 (Balance: 5000 ₸)')
          }
        }
      )
    } else {
      console.log('✅ Admin user already exists')
    }
  })

  // Seed club settings if not exists
  db.get("SELECT COUNT(*) as count FROM club_settings", (err, row) => {
    if (err) {
      console.error('Error checking club settings:', err.message)
      return
    }
    
    if (row.count === 0) {
      db.run(
        "INSERT INTO club_settings (club_name) VALUES (?)",
        ['AUEZ Arena'],
        (err) => {
          if (err) {
            console.error('Error inserting club settings:', err.message)
          } else {
            console.log('✅ Club settings seeded: AUEZ Arena')
          }
        }
      )
    }
  })

  // Seed sample transactions if empty
  db.get("SELECT COUNT(*) as count FROM transactions", (err, row) => {
    if (err) {
      console.error('Error checking transactions:', err.message)
      return
    }
    
    if (row.count === 0) {
      const sampleTransactions = [
        ['session', 500, 'PC-001 session'],
        ['session', 800, 'PC-002 session'],
        ['session', 600, 'PC-003 session'],
        ['session', 1200, 'VIP-001 session'],
        ['session', 900, 'PC-004 session']
      ]

      const insertTransaction = (type, amount, description) => {
        db.run(
          "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
          [type, amount, description],
          (err) => {
            if (err) {
              console.error('Error inserting transaction:', err.message)
            }
          }
        )
      }

      sampleTransactions.forEach(([type, amount, description]) => {
        insertTransaction(type, amount, description)
      })
      
      console.log('✅ Sample transactions seeded')
    }
  })

  // Seed sample PCs if empty
  db.get("SELECT COUNT(*) as count FROM pc_statuses", (err, row) => {
    if (err) {
      console.error('Error checking pc_statuses table:', err.message)
      return
    }
    if (row.count === 0) {
      const samplePCs = [
        ['PC-001', 'general', 'available', null, null],
        ['PC-002', 'general', 'busy', 'Иван Петров', new Date().toISOString()],
        ['PC-003', 'general', 'available', null, null],
        ['PC-004', 'general', 'busy', 'Мария Иванова', new Date().toISOString()],
        ['PC-005', 'general', 'available', null, null],
        ['PC-006', 'general', 'available', null, null],
        ['PC-007', 'general', 'busy', 'Алексей Смирнов', new Date().toISOString()],
        ['PC-008', 'general', 'available', null, null],
        ['PC-009', 'general', 'available', null, null],
        ['PC-010', 'general', 'busy', 'Тимур Асанов', new Date().toISOString()],
        ['VIP-001', 'vip', 'available', null, null],
        ['VIP-002', 'vip', 'available', null, null]
      ]

      const insertPC = (pcId, zone, status, currentUser, sessionStart) => {
        db.run(
          "INSERT INTO pc_statuses (pc_id, zone, status, current_user, session_start) VALUES (?, ?, ?, ?, ?)",
          [pcId, zone, status, currentUser, sessionStart],
          (err) => {
            if (err) {
              console.error('Error inserting PC:', err.message)
            }
          }
        )
      }

      samplePCs.forEach(([pcId, zone, status, currentUser, sessionStart]) => {
        insertPC(pcId, zone, status, currentUser, sessionStart)
      })
      
      console.log('✅ Sample PC data seeded')
    }
  })
})

// API Router
const router = express.Router();

// Finance endpoint with real SQL query
router.get('/finance', (req, res) => {
  console.log('Finance API hit via router!')
  
  // Real SQL query for total revenue
  db.get("SELECT SUM(amount) as totalRevenue FROM transactions WHERE type = 'session'", (err, row) => {
    if (err) {
      console.error('Error querying finance data:', err.message)
      return res.status(500).json({ error: 'Database error' })
    }
    
    // Get active sessions count
    db.get("SELECT COUNT(*) as activeSessions FROM pc_statuses WHERE status = 'busy'", (err, sessionRow) => {
      if (err) {
        console.error('Error querying active sessions:', err.message)
        return res.status(500).json({ error: 'Database error' })
      }
      
      const totalRevenue = row.totalRevenue || 0
      const activeSessions = sessionRow.activeSessions || 0
      
      res.json({ 
        todayRevenue: totalRevenue,
        totalSessions: activeSessions,
        popularPC: 'PC-001',
        newCustomers: 5
      })
    })
  })
})

// Enhanced authentication with role-based access
router.post('/auth/login', (req, res) => {
  console.log('Enhanced login API hit!', req.body)
  const { username, password, role } = req.body
  
  // Admin credentials - admin/admin
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign(
      { id: 1, username: 'admin', role: 'admin', name: 'Administrator' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({ 
      success: true, 
      user: { id: 1, username: 'admin', role: 'admin', name: 'Administrator' }, 
      token,
      redirect: 'control-panel'
    })
  }
  
  // Client credentials - client/client  
  if (username === 'client' && password === 'client') {
    const token = jwt.sign(
      { id: 2, username: 'client', role: 'client', name: 'Client User' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({ 
      success: true, 
      user: { id: 2, username: 'client', role: 'client', name: 'Client User' }, 
      token,
      redirect: 'dashboard'
    })
  }
  
  // Legacy 777/123 for demo (admin role)
  if (username === '777' && password === '123') {
    const token = jwt.sign(
      { id: 1, username: '777', role: 'admin', name: 'Golden User' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({ 
      success: true, 
      user: { id: 1, username: '777', role: 'admin', name: 'Golden User' }, 
      token,
      redirect: 'control-panel'
    })
  }
  
  res.status(401).json({ success: false, error: 'Invalid credentials' })
})

// Middleware to verify JWT and role
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Role-based access control
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Requires ${role} role.` })
    }
    next()
  }
}

// Admin-only endpoints
router.get('/admin/panel', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Admin Control Panel',
    user: req.user
  })
})

// Client endpoints
router.get('/client/dashboard', authenticateToken, requireRole('client'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Client Dashboard',
    user: req.user
  })
})

// Login endpoint (legacy compatibility)
router.post('/login', (req, res) => {
  console.log('Login API hit via router!', req.body)
  const { phone, password } = req.body
  
  // Hardcoded login for 777 / 123
  if (phone === '777' && password === '123') {
    const token = jwt.sign(
      { id: 1, name: 'Админ', phone: '777', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({ 
      success: true, 
      user: { name: 'Админ', phone: '777', balance: 5000, role: 'admin' }, 
      token 
    })
  }
  
  res.status(401).json({ success: false, error: 'Invalid credentials' })
})

// Club settings endpoints
router.get('/club-settings', (req, res) => {
  console.log('Club settings API hit!')
  
  db.get("SELECT club_name FROM club_settings ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error('Error querying club settings:', err.message)
      return res.status(500).json({ error: 'Database error' })
    }
    
    res.json({ 
      clubName: row ? row.club_name : 'AUEZ Arena'
    })
  })
})

router.post('/club-settings', (req, res) => {
  console.log('Update club settings API hit!', req.body)
  const { clubName } = req.body
  
  if (!clubName) {
    return res.status(400).json({ error: 'Club name is required' })
  }
  
  db.run(
    "UPDATE club_settings SET club_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
    [clubName],
    (err) => {
      if (err) {
        console.error('Error updating club settings:', err.message)
        return res.status(500).json({ error: 'Database error' })
      }
      
      res.json({ 
        success: true, 
        clubName 
      })
    }
  )
})

// Call Admin endpoint
router.post('/admin/call', (req, res) => {
  console.log('Call Admin API hit!', req.body)
  const { message } = req.body
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }
  
  // Log the admin call (in production, this could send notifications)
  const timestamp = new Date().toISOString()
  console.log(`🚨 ADMIN CALL: ${message} at ${timestamp}`)
  
  // Store in database for tracking
  db.run(
    "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
    ['admin_call', 0, `Admin call: ${message}`],
    (err) => {
      if (err) {
        console.error('Error logging admin call:', err.message)
      }
    }
  )
  
  res.json({ 
    success: true, 
    message: 'Administrator notified successfully',
    timestamp 
  })
})

// Shop endpoints
router.get('/shop/items', (req, res) => {
  console.log('Shop items API hit!')
  
  try {
    const shopItems = [
      { id: 1, name: 'Наушники', price: 200, category: 'accessories', available: true },
      { id: 2, name: 'Напиток', price: 500, category: 'beverages', available: true },
      { id: 3, name: 'Снеки', price: 300, category: 'food', available: true },
      { id: 4, name: 'Веб-камера', price: 800, category: 'accessories', available: true },
      { id: 5, name: 'Микрофон', price: 1200, category: 'accessories', available: true }
    ]
    
    res.json({ success: true, items: shopItems })
  } catch (error) {
    console.error('Shop items error:', error)
    res.json({ success: false, items: [] })
  }
})

router.post('/shop/purchase', (req, res) => {
  console.log('Shop purchase API hit!', req.body)
  const { userId, itemId, quantity = 1 } = req.body
  
  if (!userId || !itemId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' })
  }
  
  // Get item details (simplified - in production this would query DB)
  const shopItems = {
    1: { name: 'Наушники', price: 200 },
    2: { name: 'Напиток', price: 500 },
    3: { name: 'Снеки', price: 300 },
    4: { name: 'Веб-камера', price: 800 },
    5: { name: 'Микрофон', price: 1200 }
  }
  
  const item = shopItems[itemId]
  if (!item) {
    return res.status(404).json({ error: 'Item not found' })
  }
  
  const totalCost = item.price * quantity
  
  // Get user balance
  db.get("SELECT balance FROM users WHERE id = ? OR phone = ?", [userId, userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.balance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    
    // Process purchase
    db.run("UPDATE users SET balance = balance - ? WHERE id = ? OR phone = ?", [totalCost, userId, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Transaction failed' })
      }
      
      // Record transaction
      db.run(
        "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
        ['purchase', totalCost, `Purchased ${quantity}x ${item.name}`],
        (err) => {
          if (err) {
            console.error('Error recording transaction:', err.message)
          }
        }
      )
      
      res.json({
        success: true,
        item: item.name,
        quantity,
        totalCost,
        newBalance: user.balance - totalCost
      })
    })
  })
})

// Tariffs endpoint
router.get('/tariffs', (req, res) => {
  console.log('Tariffs API hit!')
  
  try {
    const tariffs = [
      { id: 1, name: 'Базовый', duration: 60, price: 500, description: '1 час игрового времени' },
      { id: 2, name: 'Стандарт', duration: 180, price: 1500, description: '3 часа со скидкой' },
      { id: 3, name: 'Премиум', duration: 540, price: 4500, description: '9 часов, лучшая цена' },
      { id: 4, name: 'VIP', duration: 720, price: 6000, description: '12 часов VIP-зона' },
      { id: 5, name: 'Ночной', duration: 480, price: 2000, description: '8 часов (ночь)' }
    ]
    
    res.json({ success: true, tariffs })
  } catch (error) {
    console.error('Tariffs error:', error)
    res.json({ success: false, tariffs: [] })
  }
})

// Balance top-up endpoint
router.post('/balance/topup', (req, res) => {
  console.log('Balance top-up API hit!', req.body)
  const { userId, amount } = req.body
  
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid user ID and amount are required' })
  }
  
  // Add balance to user
  db.run("UPDATE users SET balance = balance + ? WHERE id = ? OR phone = ?", [amount, userId, userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Top-up failed' })
    }
    
    // Record transaction
    db.run(
      "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
      ['topup', amount, `Balance top-up for user ${userId}`],
      (err) => {
        if (err) {
          console.error('Error recording transaction:', err.message)
        }
      }
    )
    
    // Get new balance
    db.get("SELECT balance FROM users WHERE id = ? OR phone = ?", [userId, userId], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Failed to get updated balance' })
      }
      
      res.json({
        success: true,
        amount,
        newBalance: user.balance
      })
    })
  })
})

// User balance endpoint
router.get('/user/balance', (req, res) => {
  console.log('User balance API hit!', req.query)
  const { username } = req.query
  
  try {
    if (!username) {
      return res.json({ success: false, balance: 0, error: 'Username is required' })
    }
    
    // For demo user 777, return high balance
    if (username === '777') {
      return res.json({ success: true, balance: 77777 })
    }
    
    // Get user balance from database
    db.get("SELECT balance FROM users WHERE id = ? OR phone = ?", [username, username], (err, user) => {
      if (err || !user) {
        // Return default balance for demo purposes
        return res.json({ success: true, balance: 5000 })
      }
      
      res.json({ success: true, balance: user.balance })
    })
  } catch (error) {
    console.error('Balance error:', error)
    res.json({ success: false, balance: 0 })
  }
})

// Session endpoints
router.post('/session/start', (req, res) => {
  console.log('Session start API hit!', req.body)
  const { userId, duration = 1 } = req.body
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }
  
  const cost = duration * 500 // 500 per hour
  
  // Get user balance
  db.get("SELECT balance FROM users WHERE id = ? OR phone = ?", [userId, userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.balance < cost) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    
    // Deduct balance
    db.run("UPDATE users SET balance = balance - ? WHERE id = ? OR phone = ?", [cost, userId, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Payment failed' })
      }
      
      // Record transaction
      db.run(
        "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
        ['session', cost, `Session started for user ${userId}, ${duration} hour(s)`],
        function(err) {
          if (err) {
            console.error('Error recording transaction:', err.message)
          }
          
          const sessionData = {
            success: true,
            sessionId: this.lastID,
            cost,
            newBalance: user.balance - cost,
            userId,
            duration: duration * 3600, // Convert to seconds
            startTime: new Date().toISOString()
          }
          
          // Broadcast real-time session update
          broadcast('session_started', sessionData)
          
          res.json(sessionData)
        }
      )
    })
  })
})

router.get('/session/active', (req, res) => {
  console.log('Active session API hit!', req.query)
  const { userId } = req.query
  
  // For demo, return a mock session
  if (userId === '1') {
    return res.json({
      success: true,
      session: {
        id: 1,
        remaining: 3600, // 1 hour in seconds
        started: new Date().toISOString()
      }
    })
  }
  
  res.json({ success: false, session: null })
})

// Health check endpoint
router.get('/health', (req, res) => {
  try {
    res.json({ 
      success: true, 
      status: 'healthy',
      server: 'AUEZ Global',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      status: 'error',
      message: 'Health check failed'
    })
  }
})

// Heartbeat endpoint
router.get('/heartbeat', (req, res) => {
  try {
    res.json({ 
      success: true, 
      status: 'online', 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.json({ 
      success: false, 
      status: 'error', 
      message: 'Server error',
      timestamp: new Date().toISOString()
    })
  }
})

// Mount API router
app.use('/api', router)

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: '.' })
})

// 404 handler
app.use((req, res) => {
  console.log('404 HIT on:', req.url)
  res.status(404).send('Route not found on this server instance')
})

// WebSocket Server for Real-time Sync
wss.on('connection', (ws) => {
  console.log('📱 WebSocket client connected')
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      console.log('📨 WebSocket received:', data)
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(data))
        }
      })
    } catch (error) {
      console.error('❌ WebSocket message error:', error)
    }
  })
  
  ws.on('close', () => {
    console.log('📱 WebSocket client disconnected')
  })
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error)
  })
})

// Broadcast function for server updates
function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload })
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

// Start server
server.listen(PORT, HOST, async () => {
  console.log('\n🚀 AUEZ GLOBAL SERVER STARTED!')
  console.log('=' .repeat(50))
  console.log(`🌐 SERVER MODE: ${NODE_ENV.toUpperCase()}`)
  console.log(`📡 BACKEND SERVER: http://${HOST}:${PORT}`)
  console.log(`📱 MOBILE ACCESS: http://${LOCAL_IP}:5173`)
  console.log(`🔌 WEBSOCKET: ws://${LOCAL_IP}:3002`)
  console.log('=' .repeat(50))
  console.log('📊 AVAILABLE ENDPOINTS:')
  console.log(`   - Finance: http://${LOCAL_IP}:${PORT}/api/finance`)
  console.log(`   - Health: http://${LOCAL_IP}:${PORT}/api/health`)
  console.log(`   - Login: http://${LOCAL_IP}:${PORT}/api/auth/login`)
  console.log(`   - Shop: http://${LOCAL_IP}:${PORT}/api/shop/items`)
  console.log(`   - Tariffs: http://${LOCAL_IP}:${PORT}/api/tariffs`)
  console.log('=' .repeat(50))
  console.log('📋 LOGIN CREDENTIALS:')
  console.log('   - Admin: admin/admin (Control Panel)')
  console.log('   - Client: client/client (Dashboard)')
  console.log('   - Demo: 777/123 (Golden User)')
  console.log('=' .repeat(50))
  console.log('📱 IPHONE ACCESS:')
  console.log(`   OPEN SAFARI → http://${LOCAL_IP}:5173`)
  console.log(`   WEBSOCKET → ws://${LOCAL_IP}:3002`)
  console.log('\n✅ READY FOR MOBILE TESTING!');
  console.log('\n📝 For external access, run: npm run tunnel');
  console.log('🌐 This will start Ngrok tunnel on port 3001');
  
  console.log('\n🎉 SERVER READY!');
})
