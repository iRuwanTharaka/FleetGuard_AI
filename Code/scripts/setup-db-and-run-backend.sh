#!/bin/bash
# Run this after PostgreSQL 15 is installed and running (e.g. brew services start postgresql@15).
# Ensures PostgreSQL tools are in PATH, creates DB/schema, then starts the backend.
#
# Usage:
#   cd "/Users/bethmij/Downloads/FleetGuard AI Design Brief"
#   ./scripts/setup-db-and-run-backend.sh
#
# If psql is not found, run first: source ~/.zshrc   (or open a new terminal)
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# PostgreSQL 15 (keg-only) — add to PATH
export PATH="/usr/local/opt/postgresql@15/bin:/opt/homebrew/opt/postgresql@15/bin:$PATH"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Add PostgreSQL to PATH:"
  echo '  export PATH="/usr/local/opt/postgresql@15/bin:$PATH"'
  echo "Or open a new terminal (PATH is in ~/.zshrc)."
  exit 1
fi

echo "=== Checking Postgres ==="
if ! pg_isready -h localhost -p 5432 -U "$USER" 2>/dev/null; then
  echo "Postgres not ready. Start it with: brew services start postgresql@15"
  exit 1
fi
echo "✓ Postgres is running"

echo ""
echo "=== Database & schema ==="
cd "$ROOT/backend"

# Create database if missing
psql -h localhost -p 5432 -U "$USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='fleetguard_db'" 2>/dev/null | grep -q 1 || \
  psql -h localhost -p 5432 -U "$USER" -d postgres -c "CREATE DATABASE fleetguard_db;" 2>/dev/null

# Apply schema
psql -h localhost -p 5432 -U "$USER" -d fleetguard_db -f "$ROOT/database/schema.sql" 2>/dev/null && echo "✓ Schema applied" || true

# Backend .env: use current user (Homebrew default), no password
if [ -n "$USER" ]; then
  if [ -f .env ]; then
    sed -i.bak "s/^DB_USER=.*/DB_USER=$USER/" .env 2>/dev/null || true
    sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=/" .env 2>/dev/null || true
  fi
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo ""
echo "=== Starting backend ==="
npm install --silent 2>/dev/null || npm install
echo "Backend at http://localhost:3001 (Ctrl+C to stop)"
npm run dev
