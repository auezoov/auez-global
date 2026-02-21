const ngrok = require('ngrok');
const fs = require('fs');

// Simple colors for output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function startNgrokTunnel() {
  try {
    log('🚀 Starting Ngrok tunnel...', 'blue');
    
    // Start ngrok tunnel programmatically
    const url = await ngrok.connect({
      proto: 'http',
      addr: 3000,
      authtoken: '39yTyR2S9EywLutDAofQSdvGcDN_4iBw1p7mpd3uuw2zzzgxD'
    });
    
    log('✅ Ngrok tunnel established!', 'green');
    log(`🌐 Public URL: ${url}`, 'cyan');
    
    // Save URL to file for other processes to read
    fs.writeFileSync('c:/auez/tunnel_url.txt', url.trim(), 'utf8');
    log('💾 URL saved to tunnel_url.txt', 'green');
    
    return url;
    
  } catch (error) {
    log(`❌ Ngrok tunnel failed: ${error.message}`, 'red');
    throw error;
  }
}

// Keep the tunnel alive
process.on('SIGINT', async () => {
  log('\n🛑 Shutting down Ngrok tunnel...', 'yellow');
  try {
    await ngrok.kill();
    log('✅ Ngrok tunnel closed', 'green');
  } catch (error) {
    log(`❌ Error closing Ngrok: ${error.message}`, 'red');
  }
  process.exit(0);
});

// Export for PM2 usage
if (require.main === module) {
  startNgrokTunnel();
}
