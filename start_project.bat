@echo off
title CLUB SYSTEM AUTORUN SCRIPT
color 0A
echo ========================================
echo    CLUB SYSTEM AUTORUN SCRIPT
echo ========================================
echo.

echo [1/4] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/4] Cleaning database...
if exist database.sqlite (
    del /F /Q database.sqlite >nul 2>&1
    echo Database cleaned successfully
) else (
    echo No database file found
)
timeout /t 1 >nul

echo [3/4] Starting Backend Server...
start "AUEZ Backend" cmd /k "cd /d %~dp0 && node server.cjs"
timeout /t 3 >nul

echo [4/4] Starting Frontend Server...
start "AUEZ Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 >nul

echo.
echo ========================================
echo       CLUB SYSTEM STARTING...
echo ========================================
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:5173
echo.
echo Waiting for server initialization...
timeout /t 5 >nul

echo.
echo BOSS, IT IS DONE. JUST CLICK LOGIN.
echo.
pause
