@echo off
echo ====================================
echo 📱 AUEZ MOBILE CONTROL LAUNCH
echo ====================================
echo.

echo 🔧 Step 1: Kill existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🔧 Step 2: Start Backend Server...
start "AUEZ Backend" cmd /k "cd /d %~dp0 && node server-pro.js"

echo 🔧 Step 3: Wait for server to initialize...
timeout /t 5 /nobreak >nul

echo 🔧 Step 4: Get Local IP Address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do set LOCAL_IP=%%a
echo 📡 Local IP: %LOCAL_IP%

echo 🔧 Step 5: Start Frontend with Network Access...
start "AUEZ Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ====================================
echo 📱 MOBILE CONTROL READY!
echo ====================================
echo.
echo 🌐 ACCESS URLS:
echo - Laptop: http://localhost:5173
echo - iPhone:  http://%LOCAL_IP%:5173
echo.
echo 🔌 WebSocket: ws://%LOCAL_IP%:3002
echo.
echo 🔐 LOGIN CREDENTIALS:
echo - Admin: admin/admin (Control Panel)
echo - Client: client/client (Dashboard)
echo - Demo: 777/123 (Golden User)
echo.
echo 📱 IPHONE INSTRUCTIONS:
echo 1. Open Safari on your iPhone
echo 2. Type: http://%LOCAL_IP%:5173
echo 3. Login with credentials above
echo 4. Test 1-minute session from laptop
echo 5. Watch real-time sync on iPhone!
echo.
echo ====================================
echo 🚀 READY FOR BED TESTING!
echo ====================================
echo.
echo Opening browser on laptop...
start http://localhost:5173

echo.
echo ✅ Test from your bed now!
echo 📱 Use: http://%LOCAL_IP%:5173
pause
