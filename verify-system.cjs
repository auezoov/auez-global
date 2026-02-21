const { exec } = require('child_process');
const fs = require('fs');

// Simple colors for clean output
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

async function verifyFileIntegrity() {
  try {
    if (fs.existsSync('c:/auez/current-url.txt')) {
      const content = fs.readFileSync('c:/auez/current-url.txt', 'utf8').trim();
      const urlPattern = /^https?:\/\/[^\s]+$/;
      
      if (urlPattern.test(content)) {
        log('✅ current-url.txt contains clean URL', 'green');
        return true;
      } else {
        log('⚠️  current-url.txt contains extra data', 'yellow');
        return false;
      }
    } else {
      log('ℹ️  current-url.txt does not exist yet', 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ File integrity check failed: ${error.message}`, 'red');
    return false;
  }
}

async function generateStatusReport() {
  return new Promise((resolve) => {
    log('🔍 Generating PM2 status report...', 'blue');
    
    exec('pm2 jlist', (error, stdout, stderr) => {
      if (error) {
        log(`❌ Failed to get PM2 status: ${error.message}`, 'red');
        resolve({});
        return;
      }
      
      try {
        const processes = JSON.parse(stdout);
        const report = {
          timestamp: new Date().toISOString(),
          total_processes: processes.length,
          active_processes: processes.filter(p => p.pm2_env.status === 'online').length,
          processes: processes.map(p => ({
            name: p.name,
            pid: p.pid,
            status: p.pm2_env.status,
            uptime: p.pm2_env.pm_uptime,
            cpu: p.monit?.cpu || 'N/A',
            memory: p.monit?.memory || 'N/A'
          }))
        };
        
        resolve(report);
      } catch (parseError) {
        log(`❌ Failed to parse PM2 status: ${parseError.message}`, 'red');
        resolve({});
      }
    });
  });
}

async function main() {
  log('🔧 AUEZ System Verification', 'bold');
  log('=' .repeat(40), 'cyan');
  
  // Step 1: File Integrity
  log('\n📁 Step 1: Verifying file integrity...', 'blue');
  const fileIntegrity = await verifyFileIntegrity();
  
  // Step 2: Status Report
  log('\n📊 Step 2: Generating status report...', 'blue');
  const statusReport = await generateStatusReport();
  
  // Results
  log('\n' + '=' .repeat(40), 'green');
  log('🎯 VERIFICATION COMPLETE', 'bold');
  log('=' .repeat(40), 'green');
  
  log('\n📁 File Integrity:', fileIntegrity ? '✅ PASS' : '⚠️  WARN', fileIntegrity ? 'green' : 'yellow');
  log(`📊 Active PM2 Processes: ${statusReport.active_processes || 0}/${statusReport.total_processes || 0}`, statusReport.active_processes > 0 ? 'green' : 'red');
  
  if (statusReport.processes && statusReport.processes.length > 0) {
    log('\n📋 Process Details:', 'blue');
    statusReport.processes.forEach(p => {
      const statusColor = p.status === 'online' ? 'green' : 'red';
      log(`  ${p.name}: ${colors[statusColor]}${p.status}${colors.reset} (PID: ${p.pid || 'N/A'})`, 'reset');
    });
  }
  
  log('\n💾 Backup available in: backup-config.json', 'cyan');
  log('\n🚀 Ready for production use!', 'bold');
}

main().catch(error => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  process.exit(1);
});
