const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning Vite cache...');

const viteCachePath = path.join(__dirname, 'client', 'node_modules', '.vite');

try {
  if (fs.existsSync(viteCachePath)) {
    fs.rmSync(viteCachePath, { recursive: true, force: true });
    console.log('✅ Vite cache cleared successfully');
  } else {
    console.log('ℹ️ Vite cache not found - no cleanup needed');
  }
} catch (error) {
  console.error('❌ Error clearing Vite cache:', error.message);
}

console.log('🚀 Starting development servers...');

// After cleanup, start the dev servers
const { spawn } = require('child_process');

let serverStarted = false;
let clientStarted = false;

// Start server
const server = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// Start client
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  shell: true,
  stdio: 'inherit'
});

// Handle successful starts
server.on('spawn', () => {
  serverStarted = true;
  console.log('✅ Server process started');
});

client.on('spawn', () => {
  clientStarted = true;
  console.log('✅ Client process started');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
});

// Handle errors and exits
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

client.on('error', (err) => {
  console.error('❌ Client error:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

client.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Client exited with code ${code}`);
    process.exit(code);
  }
});

// Check if both processes started successfully
setTimeout(() => {
  if (!serverStarted || !clientStarted) {
    console.error('❌ Failed to start one or both processes');
    process.exit(1);
  } else {
    console.log('✅ Both servers started successfully');
  }
}, 3000);
