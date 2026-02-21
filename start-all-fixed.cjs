const { exec } = require('child_process');
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

async function main() {
  try {
    log('🎯 AUEZ Automated Startup', 'bold');
    log('=' .repeat(50), 'cyan');
    
    // Start backend server
    log('\n🚀 Starting backend server...', 'blue');
    exec('pm2 start server-pro.js --name auez-backend', { shell: true }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ Backend start failed: ${error.message}`, 'red');
        return;
      }
      log('✅ Backend started (auez-backend)', 'green');
      
      // Wait for server to start and URL to be generated
      setTimeout(() => {
        // Check for URL from file
        log('\n🌐 Step 2: Checking for public URL...', 'blue');
        
        try {
          if (fs.existsSync('c:/auez/current-url.txt')) {
            const url = fs.readFileSync('c:/auez/current-url.txt', 'utf8').trim();
            if (url && url.startsWith('http')) {
              log('\n📱 PUBLIC ACCESS URL:', 'cyan');
              log('🔗 ' + url, 'bold');
              log('\n📋 Use this URL on your iPhone or any device!', 'yellow');
            } else {
              log('\n⚠️  URL file exists but no valid URL found', 'yellow');
            }
          }
        } catch (error) {
          log(`❌ Error reading URL file: ${error.message}`, 'red');
        }
      }, 5000); // Wait 5 seconds for server to start
      
    });
      
    // Display results
    log('\n' + '=' .repeat(50), 'green');
    log('🎉 STARTUP COMPLETE!', 'bold');
    log('=' .repeat(50), 'green');
    
  } catch (error) {
    log(`\n❌ Startup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Startup interrupted by user', 'yellow');
  process.exit(0);
});
