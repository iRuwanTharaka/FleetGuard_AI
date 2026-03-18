# FleetGuard AI

AI-powered vehicle inspection and fleet management for Sri Lankan travel agencies.

## Running the project

### 1. Install dependencies

```bash
npm i
cd backend && npm i
```

### 2. PostgreSQL (local)

Install PostgreSQL 15+ and ensure it's running:

- **Windows:** [PostgreSQL installer](https://www.postgresql.org/download/windows/)
- **macOS:** `brew install postgresql@15` then `brew services start postgresql@15`
- **Linux:** `sudo apt install postgresql postgresql-contrib` (or equivalent)

### 3. Database setup

Create `backend/.env` with your PostgreSQL credentials (or `DATABASE_URL` for Neon), then:

```bash
cd backend
npm run db:init
npm run db:sprint5
npm run db:seed
```

### 3b. Demo data (optional)

To fill the app with realistic demo data (vehicles with photos & GPS, inspections, damage detections, smart assignment, manager reviews). Run after DB setup and migrations (`db:init` and `npm run db:migrate`, or `db:init` + `db:sprint5` + `db:sprint6`):

```bash
cd backend
npm run demo
```

This downloads real car/interior/damage images into `backend/uploads/demo/` and seeds users, vehicles, inspections, damage records, and notifications. You can then log in as:

| Role    | Email                         | Password  |
|---------|-------------------------------|-----------|
| Driver  | driver1@demo.fleetguard.com   | Demo123!  |
| Manager | manager1@demo.fleetguard.com  | Demo123!  |
| Admin   | admin@demo.fleetguard.com     | Demo123!  |

(Same password for driver2, driver3, manager2.)

### 4. Start backend

```bash
cd backend
npm run dev
```

Backend runs at http://localhost:3001

### 5. Start frontend

```bash
npm run dev
```

Frontend runs at http://localhost:5173

---

## API keys

| Key | Where | Purpose |
|-----|-------|---------|
| **VITE_GOOGLE_MAPS_API_KEY** | Root `.env` | Map View + Smart Assignment address geocoding. Enable **Maps JavaScript API** and **Geocoding API** in [Google Cloud Console](https://console.cloud.google.com). |
| **GOOGLE_CLIENT_ID** | `backend/.env` | Google Sign-In (optional). Create OAuth 2.0 credentials in Google Cloud Console. |
| **GOOGLE_CLIENT_SECRET** | `backend/.env` | Google Sign-In (optional). Same OAuth credentials. |
| **VITE_GOOGLE_CLIENT_ID** | Root `.env` | Google Sign-In on frontend (optional). Same as GOOGLE_CLIENT_ID. |
| **JWT_SECRET** | `backend/.env` | Auth tokens. Use any long random string. |
| **EMAIL_USER** / **EMAIL_PASS** | `backend/.env` | Password reset emails (optional). Use Gmail App Password. |

**Minimum to run:** PostgreSQL + `JWT_SECRET` in `backend/.env`.  
**For Map View + Smart Assignment:** Add `VITE_GOOGLE_MAPS_API_KEY` to root `.env`.
