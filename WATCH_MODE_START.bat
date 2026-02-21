@echo off
echo ====================================
echo 👁️ AUEZ WATCH MODE (DEVELOPMENT)
echo ====================================
echo.

echo 🔧 Step 1: Kill existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🔧 Step 2: Create logs directory...
if not exist logs mkdir logs

echo 🔧 Step 3: Stop existing PM2 processes...
call pm2 delete all 2>nul

echo 🔧 Step 4: Start in WATCH MODE...
call pm2 start ecosystem.config.js --env development
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PM2 start failed
    pause
    exit /b 1
)

echo 🔧 Step 5: Enable file watching...
call pm2 watch

echo.
echo ====================================
echo 👁️ WATCH MODE ACTIVATED!
echo ====================================
echo.

echo 📊 PM2 STATUS:
call pm2 status

echo.
echo 🔍 WATCH MODE FEATURES:
echo - Frontend auto-restarts on code changes
echo - Backend auto-restarts on server changes
echo - Real-time file monitoring enabled
echo - Hot reload for development
echo.
echo 📝 LOGS:
echo - Frontend: pm2 logs auez-frontend
echo - Backend: pm2 logs auez-backend
echo - Tunnel: pm2 logs auez-tunnel
echo.
echo 🔄 DEVELOPMENT COMMANDS:
echo - Restart all: pm2 restart all
echo - Restart frontend: pm2 restart auez-frontend
echo - View logs: pm2 logs
echo - Stop all: pm2 stop all
echo.
echo 🌐 LOCAL ACCESS:
echo - Laptop: http://localhost:5173
echo - Network: http://[YOUR_IP]:5173
echo - Public: https://auez-club.loca.lt
echo.
echo ====================================
echo 👁️ DEVELOPMENT MODE READY!
echo ====================================
pause
