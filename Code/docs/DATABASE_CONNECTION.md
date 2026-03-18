# Database connection — FleetGuard AI

## Current status

**The database is not connected** until PostgreSQL is running and the schema has been applied.

- **Backend config:** `backend/src/config/database.js` uses the `pg` library and reads from `backend/.env`.
- **Connection:** The backend does **not** connect at startup; it uses a **connection pool** and connects when the first API request needs the DB (e.g. login, vehicles). If Postgres is down, those requests will fail with 500 or connection errors.

---

## How the backend connects

1. **Config** — `backend/src/config/database.js`:
   - Creates a `pg.Pool` with: `host`, `port`, `database`, `user`, `password` from `process.env`.
   - Pool is used by all routes (auth, vehicles, inspections, etc.).

2. **Env** — `backend/.env`:
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_NAME=fleetguard_db`
   - `DB_USER=postgres`
   - `DB_PASSWORD=postgres`

3. **First use** — When any route runs a query (e.g. `pool.query(...)`), `pg` opens a connection to Postgres. If Postgres is not running, you get `ECONNREFUSED`.

---

## How to get the database fully connected

### Step 1: Start PostgreSQL

**Option A — Docker (recommended)**

```bash
cd "/Users/bethmij/Downloads/FleetGuard AI Design Brief"
docker compose up -d
```

Uses the same credentials as above (`postgres` / `postgres`).

**Option B — Local install**

- macOS: `brew install postgresql@15` then `brew services start postgresql@15`
- Set `DB_PASSWORD` in `backend/.env` to match your local Postgres user.

### Step 2: Create database and schema

```bash
cd "/Users/bethmij/Downloads/FleetGuard AI Design Brief/backend"
npm run db:init
```

This script:

- Connects to the default `postgres` database.
- Creates the database `fleetguard_db` if it does not exist.
- Connects to `fleetguard_db` and runs `database/schema.sql` (all tables and indexes).

### Step 3: Restart the backend

Restart the Node server so it uses the pool against the now-existing database:

```bash
cd backend
npm run dev
```

---

## Verify connection

- **Health endpoint** (`GET /api/health`) does **not** use the DB; it can return 200 even when Postgres is down.
- To verify the DB is connected, call an endpoint that uses it, e.g. register or login:

```bash
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!","role":"driver"}' \
  | head -1
```

If you get a JSON response with `"token"` and user data, the database is connected and working.

---

## Summary

| Item              | Status / How |
|-------------------|--------------|
| Is DB connected?  | No — until Postgres is running and `npm run db:init` has been run. |
| How does backend connect? | Via `pg` pool in `backend/src/config/database.js`, using `backend/.env`. |
| How to get fully connected? | Start Postgres → run `npm run db:init` → restart backend. |
