@echo off
echo ========================================================
echo   🚨 CrisisMap — Pakistan Emergency Intelligence EOC
echo ========================================================
echo Starting Backend Server on http://localhost:3001 ...
start cmd /k "cd server && node index.js"

echo Starting Frontend Web Dashboard on http://localhost:5173 ...
start cmd /k "cd client && npm.cmd run dev"

echo.
echo CrisisMap is launching! Open http://localhost:5173 in your browser.
echo ========================================================
