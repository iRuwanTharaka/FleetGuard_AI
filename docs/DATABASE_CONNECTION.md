# Database connection — FleetGuard AI

## How the backend connects

- **Config:** `backend/src/config/database.js` uses the `pg` library and reads from `backend/.env`.
- **Connection:** The backend uses a connection pool and connects when the first API request needs the DB. If Postgres is down, those requests will fail with 500 or connection errors.

## Environment (backend/.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleetguard_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Set `DB_PASSWORD` to match your local PostgreSQL user.

## Setup steps

### 1. Install and start PostgreSQL

- **Windows:** Install from [postgresql.org](https://www.postgresql.org/download/windows/), start the service.
- **macOS:** `brew install postgresql@15` then `brew services start postgresql@15`
- **Linux:** `sudo apt install postgresql` (or equivalent), ensure the service is running.

### 2. Create database and schema

```bash
cd backend
npm run db:init
```

This creates `fleetguard_db` (if missing) and runs `database/schema.sql`.

### 3. Run Sprint 5 migration

```bash
npm run db:sprint5
```

### 4. Restart the backend

```bash
npm run dev
```

## Verify connection

The health endpoint (`GET /api/health`) does not use the DB. To verify the DB is connected:

```bash
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!","role":"driver"}'
```

If you get a JSON response with `"token"` and user data, the database is connected.
