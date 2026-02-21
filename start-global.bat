@echo off
echo ====================================
echo AUEZ GLOBAL LAUNCH SCRIPT
echo ====================================
echo.

echo Starting Backend Server...
start "AUEZ Backend" cmd /k "cd /d %~dp0 && node server-pro.js"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "AUEZ Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ====================================
echo SYSTEM STARTED SUCCESSFULLY!
echo ====================================
echo.
echo CREDENTIALS:
echo - Admin: admin/admin (Control Panel)
echo - Client: client/client (Dashboard)  
echo - Demo: 777/123 (Golden User)
echo.
echo BACKEND: http://localhost:3001
echo FRONTEND: http://localhost:5173
echo.
echo Press any key to open browser...
pause >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ====================================
echo AUEZ IS RUNNING GLOBAL!
echo Ready for iPhone access when deployed.
echo ====================================
pause
