const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(cors());
app.use(express.json());

// LOGGING
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

const db = new sqlite3.Database('./database.sqlite');

// DIRECT ROUTE
app.get('/api/finance', (req, res) => {
    db.get("SELECT SUM(amount) as total FROM transactions WHERE type = 'session'", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ todayRevenue: row ? (row.total || 0) : 0, totalSessions: 5 });
    });
});

app.get('/test', (req, res) => res.send('SERVER IS OK'));

app.listen(3001, '0.0.0.0', () => {
console.log('🚀 FINAL SERVER ALIVE ON PORT 3001');
});
