# FleetGuard AI — Backend

Node.js + Express + PostgreSQL API for Sprint 1 (Auth) and Sprint 2 (Vehicles, Inspections, Photos).

## 1. Create database and run schema

**Option A — Docker (recommended)**

From repo root:

```bash
docker compose up -d
```

Wait ~5s for Postgres to be ready, then from repo root:

```bash
cd backend && npm install && npm run db:init
```

`backend/.env` is set to `DB_PASSWORD=postgres` to match Docker.

**Option B — Local PostgreSQL**

Ensure PostgreSQL is running, then set `DB_PASSWORD` in `backend/.env` and run:

```bash
cd backend
npm install
npm run db:init
```

Init script creates `fleetguard_db` (if missing) and runs `database/schema.sql`.

## 2. Run the API

```bash
cd backend
npm run dev
```

API: **http://localhost:3001**  
Health: **http://localhost:3001/api/health**

## 3. Frontend

From repo root:

```bash
npm install
npm run dev
```

Frontend: **http://localhost:5173**  
Uses `VITE_API_URL=http://localhost:3001/api` from root `.env`.

## Quick test

```bash
# From repo root (after backend + frontend deps installed)
npm run verify
```

This will: create DB if needed, run schema, start the API, hit `/api/health`, run register + login, then stop the API. Then start manually:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```
