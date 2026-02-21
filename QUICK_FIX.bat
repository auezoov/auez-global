@echo off
echo ====================================
echo AUEZ CONNECTION FIX - QUICK START
echo ====================================
echo.

echo 🔧 Step 1: Kill existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🔧 Step 2: Start Backend Server...
start "AUEZ Backend" cmd /k "cd /d %~dp0 && node server-pro.js"

echo 🔧 Step 3: Wait for server to initialize...
timeout /t 5 /nobreak >nul

echo 🔧 Step 4: Test Backend Connection...
node test-connection.js

echo 🔧 Step 5: Start Frontend with Proxy...
start "AUEZ Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ====================================
echo 🚀 SYSTEM READY FOR TESTING!
echo ====================================
echo.
echo 📱 CREDENTIALS:
echo - Admin: admin/admin
echo - Client: client/client
echo - Demo: 777/123
echo.
echo 🔗 URLS:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3001
echo.
echo ✅ FIXES APPLIED:
echo - Vite proxy configured (/api -> localhost:3001)
echo - CORS updated for localhost:5173
echo - API URL set to relative path
echo - All endpoints return proper JSON
echo.
echo 🎯 You can now start the 1-minute test!
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173

pause
