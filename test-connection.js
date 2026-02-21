// Quick connection test
const http = require('http');

console.log('🔍 Testing API connections...');

// Test backend server
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/heartbeat',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ Backend Response:', json);
    } catch (e) {
      console.log('❌ Backend JSON Error:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Backend Connection Error:', e.message);
});

req.end();

// Test frontend proxy (if running)
setTimeout(() => {
  console.log('\n🔍 Testing frontend proxy...');
  
  const proxyOptions = {
    hostname: 'localhost',
    port: 5173,
    path: '/api/heartbeat',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = http.request(proxyOptions, (res) => {
    console.log(`✅ Frontend Proxy Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('✅ Frontend Proxy Response:', json);
      } catch (e) {
        console.log('❌ Frontend Proxy JSON Error:', e.message);
        console.log('Raw response:', data);
      }
    });
  });

  proxyReq.on('error', (e) => {
    console.log('❌ Frontend Proxy Connection Error:', e.message);
    console.log('💡 Make sure frontend is running on port 5173');
  });

  proxyReq.end();
}, 1000);
