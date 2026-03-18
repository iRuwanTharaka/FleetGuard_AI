#!/bin/bash
# Install PostgreSQL (via Homebrew) and run the FleetGuard backend.
#
# Run this in your own terminal (so you can enter your password if needed):
#   cd "/Users/bethmij/Downloads/FleetGuard AI Design Brief"
#   ./scripts/install-postgres-and-run-backend.sh
#
# If you use Docker instead, you don't need Homebrew:
#   docker compose up -d
#   cd backend && npm run db:init && npm run dev
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "=== 1. Homebrew ==="
if ! command -v brew >/dev/null 2>&1; then
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
fi
if ! command -v brew >/dev/null 2>&1; then
  echo "Installing Homebrew (you will be asked for your password)..."
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
fi
echo "✓ $(brew --version | head -1)"

echo ""
echo "=== 2. PostgreSQL ==="
if ! brew list postgresql@15 >/dev/null 2>&1; then
  echo "Installing PostgreSQL 15..."
  brew install postgresql@15
fi
# Keg-only: add to PATH so psql/pg_isready are found
export PATH="/usr/local/opt/postgresql@15/bin:/opt/homebrew/opt/postgresql@15/bin:$PATH"
echo "✓ PostgreSQL 15 installed"

echo ""
echo "=== 3. Start PostgreSQL ==="
brew services start postgresql@15 2>/dev/null || true
echo "Waiting for Postgres to accept connections..."
for i in {1..25}; do
  if pg_isready -h localhost -p 5432 -U "$USER" 2>/dev/null; then
    echo "✓ Postgres is running (user: $USER)"
    break
  fi
  if [ $i -eq 25 ]; then
    echo "Postgres did not start in time. Try: brew services start postgresql@15"
    echo "Then add to your shell (e.g. ~/.zshrc): export PATH=\"/usr/local/opt/postgresql@15/bin:\$PATH\""
    exit 1
  fi
  sleep 1
done

echo ""
echo "=== 4. Database & schema ==="
cd "$ROOT/backend"
# Ensure psql is in PATH for schema steps
export PATH="/usr/local/opt/postgresql@15/bin:/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Homebrew default: superuser = $USER, no password. Create DB and run schema as $USER.
create_db() {
  psql -h localhost -p 5432 -U "$USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='fleetguard_db'" 2>/dev/null | grep -q 1
}
if ! create_db; then
  psql -h localhost -p 5432 -U "$USER" -d postgres -c "CREATE DATABASE fleetguard_db;" 2>/dev/null || true
fi
psql -h localhost -p 5432 -U "$USER" -d fleetguard_db -f "$ROOT/database/schema.sql" 2>/dev/null || true

# Backend .env must use the same user. Homebrew = $USER with no password.
if [ -n "$USER" ]; then
  sed -i.bak "s/^DB_USER=.*/DB_USER=$USER/" .env 2>/dev/null || true
  sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=/" .env 2>/dev/null || true
fi

# Ensure schema was applied
if psql -h localhost -p 5432 -U "$USER" -d fleetguard_db -tAc "SELECT 1 FROM users LIMIT 1" 2>/dev/null; then
  echo "✓ Schema already applied"
elif psql -h localhost -p 5432 -U "$USER" -d fleetguard_db -f "$ROOT/database/schema.sql" 2>/dev/null; then
  echo "✓ Schema applied"
else
  npm run db:init 2>/dev/null || echo "Run manually: npm run db:init"
fi

echo ""
echo "=== 5. Backend ==="
npm install --silent 2>/dev/null || npm install
echo "Starting backend at http://localhost:3001 (Ctrl+C to stop)"
npm run dev
