const { spawn } = require('child_process');

console.log('🚀 Starting Ngrok tunnel...');

const ngrok = spawn('ngrok', ['http', '3001'], {
  stdio: 'inherit',
  shell: true
});

ngrok.on('close', (code) => {
  console.log(`Ngrok process exited with code ${code}`);
});

ngrok.on('error', (err) => {
  console.error('Failed to start Ngrok:', err);
});
