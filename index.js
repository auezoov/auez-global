import express from 'express';
import path from 'path';
const app = express();
app.use(express.static('dist'));
app.get('/api/status', (req, res) => res.json({ status: 'ready' }));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});
export default app;
