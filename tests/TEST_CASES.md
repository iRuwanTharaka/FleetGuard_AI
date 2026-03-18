<!--
@module     Testing Related
@author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
@description This file is part of the test suite of FleetGuard AI.
@date       2026-02-24
-->

# FleetGuard Full Test Cases (JUnit-Style Coverage)

## Backend Tests (Jest)

Run: `cd backend && npm test`  
Coverage: `cd backend && npm run test:coverage`

### 1. Health Check (`health.test.js`)
| Test | Description |
|------|-------------|
| GET /api/health returns ok status | Returns 200, status: ok, service name |

### 2. Auth (`auth.test.js`)
| Test | Description |
|------|-------------|
| POST /api/auth/register - driver | Registers driver, returns 201 + token |
| POST /api/auth/register - manager | Registers manager, returns 201 |
| POST /api/auth/register - 409 | Email exists returns 409 |
| POST /api/auth/register - 400 | Invalid email returns 400 |
| POST /api/auth/register - 400 | Short password returns 400 |
| POST /api/auth/register - 400 | Invalid role returns 400 |
| POST /api/auth/login - success | Valid credentials return token |
| POST /api/auth/login - 401 | Invalid credentials return 401 |
| POST /api/auth/login - 401 | Wrong password return 401 |
| POST /api/auth/login - 400 | Missing email returns 400 |
| GET /api/auth/me - 401 | No token returns 401 |
| GET /api/auth/me - 401 | Invalid token returns 401 |
| GET /api/auth/me - 200 | Valid token returns user |

### 3. Users / Drivers (`users.test.js`)
| Test | Description |
|------|-------------|
| GET /api/users/drivers | Manager gets drivers list |
| GET /api/users/drivers - 401 | No token returns 401 |
| GET /api/users/drivers - 403 | Driver role returns 403 |
| POST /api/users/drivers | Manager creates driver |
| POST /api/users/drivers - 400 | Short password returns 400 |
| POST /api/users/drivers - 409 | Email exists returns 409 |
| GET /api/users/drivers/:id | Get driver by id |
| GET /api/users/drivers/:id - 404 | Not found returns 404 |
| PUT /api/users/drivers/:id | Update driver |
| PUT /api/users/drivers/:id - 404 | Not found returns 404 |
| DELETE /api/users/drivers/:id | Soft delete driver |
| DELETE /api/users/drivers/:id - 404 | Not found returns 404 |

### 4. Vehicles (`vehicles.test.js`)
| Test | Description |
|------|-------------|
| GET /api/vehicles | Returns vehicles list |
| GET /api/vehicles - 401 | No token returns 401 |
| GET /api/vehicles/available | Returns available vehicles |
| GET /api/vehicles/:id | Get vehicle by id |
| GET /api/vehicles/:id - 404 | Not found returns 404 |
| POST /api/vehicles | Create vehicle |
| PUT /api/vehicles/:id | Update vehicle |

### 5. Manager (`manager.test.js`)
| Test | Description |
|------|-------------|
| GET /api/manager/dashboard/stats | Returns dashboard stats |
| GET /api/manager/dashboard/stats - 403 | Driver returns 403 |
| GET /api/manager/inspections-summary | Returns inspections summary |
| GET /api/manager/analytics/health-trend | Returns health trend data |

### 6. Driver (`driver.test.js`)
| Test | Description |
|------|-------------|
| GET /api/driver/stats | Returns driver stats |
| GET /api/driver/stats - 403 | Manager returns 403 |

### 7. Inspections (`inspections.test.js`)
| Test | Description |
|------|-------------|
| GET /api/inspections/my | Driver gets own inspections |
| GET /api/inspections/my - 401 | No token returns 401 |
| GET /api/inspections | Manager gets all inspections |

### 8. Notifications (`notifications.test.js`)
| Test | Description |
|------|-------------|
| GET /api/notifications | Returns notifications |
| PATCH /api/notifications/:id/read | Mark as read |
| PATCH /api/notifications/read-all | Mark all as read |

### 9. Middleware (`middleware.test.js`)
| Test | Description |
|------|-------------|
| verifyToken - valid | Calls next with user |
| verifyToken - no token | Returns 401 |
| verifyToken - invalid | Returns 401 |
| requireRole - has role | Calls next |
| requireRole - lacks role | Returns 403 |
| requireRole - no user | Returns 401 |

---

## Frontend Tests (Vitest)

Run: `npm test` or `npm run test:coverage`

### 1. Utils - healthScore (`healthScore.test.ts`)
| Test | Description |
|------|-------------|
| healthColor - >= 80 | Returns #70AD47 |
| healthColor - 60-79 | Returns #FFC000 |
| healthColor - < 60 | Returns #C00000 |
| healthLabel - Good/Fair/Poor | Correct labels |
| healthFromDamages | Calculates from severity |

---

## API Integration Tests

Run: `npm run test:api` (requires backend on :3001)

Tests: Health, Register, Login, Get Me, Dashboard stats, Drivers, Vehicles, Driver stats, Inspections my, Notifications, Preferences, Analytics.

---

## Test Commands Summary

```bash
# Backend (Jest)
cd backend && npm test
cd backend && npm run test:coverage

# Frontend (Vitest)
npm test
npm run test:coverage

# API integration
npm run test:api
```

---

## Coverage Targets

- **Backend**: 60%+ (branches, functions, lines, statements)
- **Frontend**: Utils, hooks, services covered
- **API**: All main endpoints exercised
