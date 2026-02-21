import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safe configuration with fallbacks
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

console.log('🚀 Starting AUEZ Production Server...');
console.log('📁 Working directory:', process.cwd());
console.log('📂 Script directory:', __dirname);

// Initialize Express
const app = express();

// Safe static files serving with absolute paths
const distPath = path.resolve(process.cwd(), 'client', 'dist');
console.log('📦 Static files path:', distPath);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('✅ Static files configured');
} else {
  console.warn('⚠️  Dist folder not found at:', distPath);
}

// Safe SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.resolve(distPath, 'index.html');
  console.log('🔄 SPA fallback request:', req.path);
  console.log('📄 Serving file:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.warn('⚠️  Index file not found:', indexPath);
    res.status(404).send('Frontend not built. Run build command first.');
  }
});

// Safe database connection (non-blocking)
let db = null;
const initDatabase = async () => {
  try {
    console.log('🗄️  Initializing database...');
    const sqlite3 = await import('sqlite3');
    
    db = new sqlite3.default('./auez.db', (err) => {
      if (err) {
        console.warn('⚠️  Database connection failed:', err.message);
        console.log('🔄 Server will continue without database');
      } else {
        console.log('✅ Database connected successfully');
      }
    });
  } catch (err) {
    console.warn('⚠️  Database module not available:', err.message);
    console.log('🔄 Server will continue without database');
  }
};

// Initialize database in background (non-blocking)
setTimeout(initDatabase, 100);

// Safe environment loading
try {
  if (fs.existsSync('.env')) {
    console.log('📝 Loading .env file...');
    const { config } = await import('dotenv');
    config();
  } else {
    console.log('📝 No .env file found, using defaults');
  }
} catch (err) {
  console.warn('⚠️  Failed to load .env:', err.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: db ? 'connected' : 'disconnected'
  });
});

// Start server with error handling
const server = app.listen(PORT, HOST, () => {
  console.log('🎉 AUEZ PRODUCTION SERVER LIVE!');
  console.log('=' .repeat(50));
  console.log(`🌐 Server URL: http://${HOST}:${PORT}`);
  console.log(`📱 Mobile Access: http://localhost:${PORT}`);
  console.log('=' .repeat(50));
  console.log('✅ READY FOR TRAFFIC!');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
