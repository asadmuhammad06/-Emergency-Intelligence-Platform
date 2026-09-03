@echo off
echo ========================================================
echo   🚨 CrisisMap — Pakistan Emergency Intelligence EOC
echo ========================================================
echo Cleaning up previous orphaned instances on ports 3001 and 5173...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3001, 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo Starting Backend Server on http://localhost:3001 ...
start "CrisisMap Backend (Port 3001)" cmd /k "cd server && node index.js"

echo Starting Frontend Web Dashboard on http://localhost:5173 ...
start "CrisisMap Frontend (Port 5173)" cmd /k "cd client && npm.cmd run dev"

echo.
echo CrisisMap is launching! Open http://localhost:5173 in your browser.
echo ========================================================
