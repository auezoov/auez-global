import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

console.log('--- TRAP ROUTE REGISTERED ---')
app.get('/test', (req, res) => {
  console.log('TRAP ROUTE HIT!')
  res.send('SERVER IS ALIVE')
})

console.log('--- FINANCE ROUTE REGISTERED ---')
app.get('/api/finance', (req, res) => {
  console.log('Finance API hit!')
  res.json({
    todayRevenue: 50000,
    totalSessions: 10,
    popularPC: 'PC-001',
    newCustomers: 5
  })
})

console.log('--- LOGIN ROUTE REGISTERED ---')
app.post('/api/login', (req, res) => {
  console.log('Login API hit!', req.body)
  const { phone, password } = req.body
  
  if (phone === '777' && password === '123') {
    return res.json({
      token: 'fake-jwt-token',
      user: {
        id: 1,
        name: 'Админ',
        phone: '777',
        balance: 5000
      }
    })
  }
  
  res.status(401).json({ error: 'Invalid credentials' })
})

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`)
  console.log(`📊 Test: http://localhost:${PORT}/test`)
  console.log(`💰 Finance: http://localhost:${PORT}/api/finance`)
})
