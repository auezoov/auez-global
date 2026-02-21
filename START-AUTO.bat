@echo off
title AUEZ Automated Startup
color 0A

echo.
echo ========================================
echo    AUEZ AUTOMATED STARTUP
echo ========================================
echo.

REM Change to project directory
cd /d C:\auez

REM Verify we're in the right directory
if not exist start-all.cjs (
    echo ERROR: start-all.cjs not found in C:\auez
    pause
    exit /b 1
)

REM Run the startup script
node start-all-fixed.cjs

pause
