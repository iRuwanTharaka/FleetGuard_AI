#!/bin/bash
# Run backend + frontend and verify. Usage: ./scripts/start-and-verify.sh
# Requires: Node.js, npm. Optional: Docker for Postgres.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "FleetGuard AI — starting backend & frontend"
echo ""

# Check node
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install from https://nodejs.org or run: nvm use (if using nvm)"
  exit 1
fi
echo "✓ Node $(node -v)"

# Optional: start Postgres with Docker
if command -v docker >/dev/null 2>&1 && ! docker info >/dev/null 2>&1; then
  echo "Docker not running — skipping Postgres. Start it manually if needed."
elif command -v docker >/dev/null 2>&1; then
  echo "Starting Postgres (Docker)..."
  docker compose up -d
  sleep 3
fi

# Backend deps + DB init
echo ""
echo "Backend: install & init DB..."
cd "$ROOT/backend"
npm install --silent 2>/dev/null || npm install
npm run db:init 2>/dev/null || { echo "DB init failed (start Postgres and run: npm run db:init)"; }
cd "$ROOT"

# Start backend in background
echo ""
echo "Starting backend on http://localhost:3001 ..."
(cd "$ROOT/backend" && npm run dev) > "$ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to listen
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null | grep -q 200; then
    echo "✓ Backend is up"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "Backend did not start. Check backend/backend.log"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi
done

# Frontend deps
echo ""
echo "Frontend: install..."
npm install --silent 2>/dev/null || npm install

# Start frontend in background
echo ""
echo "Starting frontend on http://localhost:5173 ..."
npm run dev > "$ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for Vite to be ready
sleep 5
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null | grep -q 200; then
    echo "✓ Frontend is up"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "Frontend may still be starting. Check frontend.log"
  fi
done

echo ""
echo "=========================================="
echo "Backend:  http://localhost:3001"
echo "Health:   http://localhost:3001/api/health"
echo "Frontend: http://localhost:5173"
echo "=========================================="
echo ""
echo "Logs: backend.log, frontend.log"
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Quick health check
HEALTH=$(curl -s http://localhost:3001/api/health 2>/dev/null || echo "{}")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "Backend health check: OK"
else
  echo "Backend health check: failed"
fi
