const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development servers...');

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
