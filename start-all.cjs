const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting AUEZ Backend with PM2 and Ngrok...\n');

// Clean up old PM2 processes
console.log('🧹 Cleaning up old PM2 processes...');
exec('pm2 delete all', (error, stdout, stderr) => {
  if (error) {
    console.log('⚠️ No existing PM2 processes to clean');
  } else {
    console.log('✅ Old PM2 processes cleaned');
  }
  
  // Start the backend server with PM2
  console.log('🚀 Starting backend server with PM2...');
  exec('pm2 start server-pro.js --name auez-backend', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to start PM2 process:', error);
      process.exit(1);
    }
    
    console.log('✅ PM2 process started: auez-backend');
    console.log('⏳ Waiting for Ngrok tunnel to be established...\n');
    
    // Poll for tunnel_url.txt
    const checkTunnelUrl = () => {
      try {
        if (fs.existsSync('tunnel_url.txt')) {
          const tunnelUrl = fs.readFileSync('tunnel_url.txt', 'utf8').trim();
          if (tunnelUrl && tunnelUrl.startsWith('https://')) {
            console.log('🎉 SUCCESS! Ngrok tunnel is ready!');
            console.log('=' .repeat(60));
            console.log(`🌐 PUBLIC URL: ${tunnelUrl}`);
            console.log('=' .repeat(60));
            console.log('📱 Your backend is now accessible via the URL above');
            console.log('💾 URL saved in: tunnel_url.txt');
            console.log('🔧 PM2 process: auez-backend');
            console.log('📊 PM2 status: pm2 status');
            console.log('🛑 To stop: pm2 stop auez-backend');
            console.log('=' .repeat(60));
            return;
          }
        }
        
        // If URL not ready, check again
        setTimeout(checkTunnelUrl, 2000);
      } catch (error) {
        console.error('❌ Error checking tunnel URL:', error.message);
        setTimeout(checkTunnelUrl, 2000);
      }
    };
    
    // Start polling after a short delay
    setTimeout(checkTunnelUrl, 3000);
  });
});
