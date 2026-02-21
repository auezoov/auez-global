import express from 'express'
import cors from 'cors'

const app = express()

app.use((req, res, next) => { console.log('!!! SERVER RECEIVED REQUEST:', req.url); next(); });
app.use(cors());
app.use(express.json());

// THE ONLY API ROUTER
const router = express.Router();
router.get('/finance', (req, res) => res.json({ todayRevenue: 50000, totalSessions: 10 }));
router.post('/login', (req, res) => res.json({ success: true, token: 'fake', user: {phone: '777'} }));
app.use('/api', router); // This makes it /api/finance

// DEBUGGER
app.use((req, res) => {
  console.log('404 HIT on:', req.url);
  res.status(404).send('Route not found on this server instance');
});

app.get('/', (req, res) => res.send('BASE SERVER IS ALIVE'));

app.listen(4000, '0.0.0.0', () => {
  console.log(' MINIMAL SERVER running on port 4000');
  console.log(' Finance: http://127.0.0.1:4000/api/finance');
  console.log(' Login: http://127.0.0.1:4000/api/login');
});
