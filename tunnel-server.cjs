const lt = require('localtunnel')
const express = require('express')
const path = require('path')

const app = express()

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Start tunnel for frontend (port 5173)
async function startTunnel() {
  console.log('🚀 Starting LocalTunnel for AUEZ Global...')
  
  try {
    // Frontend tunnel
    const frontendTunnel = await lt(5173, { 
      subdomain: 'auez-club',
      host: 'https://loca.lt',
      'bypass-tunnel-reminder': true,
      local_host: '127.0.0.1',
      local_https: false,
      allow_invalid_cert: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'bypass-tunnel-reminder': 'true'
      }
    })
    
    console.log('✅ FRONTEND TUNNEL READY!')
    console.log(`🌐 PUBLIC URL: ${frontendTunnel.url}`)
    console.log('📱 Use this URL on your iPhone from anywhere!')
    console.log('=' .repeat(50))
    
    // Keep tunnel alive
    frontendTunnel.on('close', () => {
      console.log('❌ Frontend tunnel closed, restarting...')
      setTimeout(startTunnel, 5000)
    })
    
    // Health check server
    const healthServer = app.listen(8080, () => {
      console.log('🔍 Health check server running on port 8080')
    })
    
    return frontendTunnel
    
  } catch (error) {
    console.error('❌ Tunnel error:', error.message)
    console.log('🔄 Retrying in 10 seconds...')
    setTimeout(startTunnel, 10000)
  }
}

// Start the tunnel
startTunnel()
