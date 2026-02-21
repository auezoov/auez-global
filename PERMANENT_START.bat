@echo off
echo ====================================
echo 🚀 AUEZ 24/7 PERMANENT DEPLOYMENT
echo ====================================
echo.

echo 🔧 Step 1: Kill existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🔧 Step 2: Install PM2 globally...
call npm install -g pm2
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PM2 installation failed
    pause
    exit /b 1
)

echo 🔧 Step 3: Install LocalTunnel...
call npm install -g localtunnel
if %ERRORLEVEL% NEQ 0 (
    echo ❌ LocalTunnel installation failed
    pause
    exit /b 1
)

echo 🔧 Step 4: Create logs directory...
if not exist logs mkdir logs

echo 🔧 Step 5: Stop existing PM2 processes...
call pm2 delete all 2>nul

echo 🔧 Step 6: Start permanent services with PM2...
call pm2 start ecosystem.config.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PM2 start failed
    pause
    exit /b 1
)

echo 🔧 Step 7: Save PM2 configuration...
call pm2 save
call pm2 startup
call pm2 install pm2-windows-startup

echo.
echo ====================================
echo ✅ AUEZ 24/7 SYSTEM STARTED!
echo ====================================
echo.

echo 📊 PM2 STATUS:
call pm2 status

echo.
echo 🌐 PUBLIC ACCESS URL:
echo 📱 https://auez-club.loca.lt
echo.
echo 🔐 LOGIN CREDENTIALS:
echo - Admin: admin/admin
echo - Client: client/client  
echo - Demo: 777/123
echo.
echo 📱 IPHONE INSTRUCTIONS:
echo 1. Open Safari on iPhone
echo 2. Go to: https://auez-club.loca.lt
echo 3. Login with credentials above
echo 4. Access from ANYWHERE in the world!
echo.
echo 🔄 AUTO-RESTART ENABLED:
echo - Backend auto-restarts on crashes
echo - Frontend auto-restarts on code changes
echo - Tunnel auto-restarts on disconnection
echo - PM2 auto-starts on Windows boot
echo.
echo 📊 MONITORING:
echo - Check status: pm2 status
echo - View logs: pm2 logs
echo - Restart: pm2 restart all
echo - Stop: pm2 stop all
echo.
echo ====================================
echo 🌍 AUEZ IS GLOBAL 24/7!
echo ====================================
pause
