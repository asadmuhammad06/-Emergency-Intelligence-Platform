#!/usr/bin/env bash
# CrisisMap — macOS & Linux Launcher
echo "============================================================"
echo " 🚨 CRISISMAP — PAKISTAN EMERGENCY INTELLIGENCE PLATFORM"
echo " Starting Backend (Port 3001) & Frontend (Port 5173)..."
echo "============================================================"

# Ensure dependencies are installed if missing
if [ ! -d "node_modules" ]; then
  echo "[1/3] Installing root dependencies..."
  npm install
fi

if [ ! -d "server/node_modules" ]; then
  echo "[2/3] Installing server dependencies..."
  (cd server && npm install)
fi

if [ ! -d "client/node_modules" ]; then
  echo "[3/3] Installing client dependencies..."
  (cd client && npm install)
fi

# Launch cross-platform development server
node scripts/dev.js

