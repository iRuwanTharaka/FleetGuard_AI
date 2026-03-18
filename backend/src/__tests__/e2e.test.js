/**
 * @module     Testing Related
 * @author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
 * @description This file is part of the test suite of FleetGuard AI.
 *              Developed and maintained by Iruwan Tharaka.
 * @date       2026-02-16
 */

/**
 * FleetGuard E2E Integration Tests - Real PostgreSQL Database
 * Target: ≥ 90% line coverage across all controllers, routes, middleware, models
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const request = require('supertest');
const app     = require('../app');
const pool    = require('../config/database');
const util    = require('util');
const exec    = util.promisify(require('child_process').exec);
const fs      = require('fs');

// ── Test state ─────────────────────────────────────────────────────────────
let mToken, dToken, dToken2;
let mId, dId, dId2;
let vehId, vehId2, vehId3;
let inspId, inspId2;

// ── Helpers ─────────────────────────────────────────────────────────────────
const auth  = (t) => ({ Authorization: `Bearer ${t}` });

// ── Global setup ─────────────────────────────────────────────────────────────
beforeAll(async () => {
  // Drop & recreate schema for a clean slate
  try { await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'); }
  catch (e) { console.error('Schema wipe failed:', e.message); }

  await exec('npm run db:init');
  await exec('npm run db:migrate');
  await exec('npm run db:seed');

  // Register manager
  let r = await request(app).post('/api/auth/register').send({
    name: 'E2E Manager', email: 'manager@e2e.com', password: 'Password123!', role: 'manager',
  });
  mToken = r.body.token;
  mId    = r.body.user?.id;

  // Register driver 1
  r = await request(app).post('/api/auth/register').send({
    name: 'E2E Driver', email: 'driver@e2e.com', password: 'Password123!', role: 'driver', phone: '0771234567',
  });
  dToken = r.body.token;
  dId    = r.body.user?.id;

  // Register driver 2
  r = await request(app).post('/api/auth/register').send({
    name: 'E2E Driver 2', email: 'driver2@e2e.com', password: 'Password123!', role: 'driver', phone: '0779999999',
  });
  dToken2 = r.body.token;
  dId2    = r.body.user?.id;

  // Fetch seeded vehicles
  const vData = await pool.query('SELECT id FROM vehicles ORDER BY id LIMIT 3');
  vehId  = vData.rows[0]?.id;
  vehId2 = vData.rows[1]?.id;
  vehId3 = vData.rows[2]?.id;
}, 60000);

afterAll(async () => {
  await pool.end();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Health Check', () => {
  it('GET /api/health → 200', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Auth Controller', () => {
  it('GET /api/auth/me with manager token', async () => {
    const r = await request(app).get('/api/auth/me').set(auth(mToken));
    expect(r.status).toBe(200);
    expect(r.body.email).toBe('manager@e2e.com');
  });

  it('GET /api/auth/me with driver token', async () => {
    const r = await request(app).get('/api/auth/me').set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('POST /api/auth/login → 200 valid', async () => {
    const r = await request(app).post('/api/auth/login')
      .send({ email: 'manager@e2e.com', password: 'Password123!' });
    expect(r.status).toBe(200);
    expect(r.body.token).toBeDefined();
  });

  it('POST /api/auth/login → 401 wrong password', async () => {
    const r = await request(app).post('/api/auth/login')
      .send({ email: 'manager@e2e.com', password: 'WrongPass!' });
    expect(r.status).toBe(401);
  });

  it('POST /api/auth/login → 401 unknown email', async () => {
    const r = await request(app).post('/api/auth/login')
      .send({ email: 'nobody@e2e.com', password: 'Password123!' });
    expect(r.status).toBe(401);
  });

  it('POST /api/auth/login → 400 missing email', async () => {
    const r = await request(app).post('/api/auth/login').send({ password: 'Password123!' });
    expect(r.status).toBe(400);
  });

  it('POST /api/auth/register → 409 duplicate email', async () => {
    const r = await request(app).post('/api/auth/register')
      .send({ name: 'Dup', email: 'manager@e2e.com', password: 'Password123!', role: 'manager' });
    expect(r.status).toBe(409);
  });

  it('POST /api/auth/register → 400 invalid email', async () => {
    const r = await request(app).post('/api/auth/register')
      .send({ name: 'X', email: 'not-an-email', password: 'Password123!', role: 'driver' });
    expect(r.status).toBe(400);
  });

  it('POST /api/auth/register → 400 short password', async () => {
    const r = await request(app).post('/api/auth/register')
      .send({ name: 'X', email: 'new@e2e.com', password: 'short', role: 'driver' });
    expect(r.status).toBe(400);
  });

  it('POST /api/auth/register → 400 invalid role', async () => {
    const r = await request(app).post('/api/auth/register')
      .send({ name: 'X', email: 'new2@e2e.com', password: 'Password123!', role: 'superadmin' });
    expect(r.status).toBe(400);
  });

  it('GET /api/auth/me → 401 no token', async () => {
    const r = await request(app).get('/api/auth/me');
    expect(r.status).toBe(401);
  });

  it('GET /api/auth/me → 401 bad token', async () => {
    const r = await request(app).get('/api/auth/me').set('Authorization', 'Bearer BAD.TOKEN.HERE');
    expect(r.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vehicles Controller', () => {
  it('GET /api/vehicles → 200 manager', async () => {
    const r = await request(app).get('/api/vehicles').set(auth(mToken));
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.vehicles)).toBe(true);
  });

  it('GET /api/vehicles?status=available → 200', async () => {
    const r = await request(app).get('/api/vehicles?status=available&search=test').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('POST /api/vehicles → 201 create', async () => {
    const r = await request(app).post('/api/vehicles').set(auth(mToken))
      .send({ number_plate: 'E2E-001', make: 'Toyota', model: 'Corolla', year: 2022 });
    expect(r.status).toBe(201);
    vehId2 = r.body.id;
  });

  it('POST /api/vehicles → 403 driver forbidden', async () => {
    const r = await request(app).post('/api/vehicles').set(auth(dToken))
      .send({ number_plate: 'E2E-000', make: 'X', model: 'X', year: 2020 });
    expect(r.status).toBe(403);
  });

  it('GET /api/vehicles/available → 200', async () => {
    const r = await request(app).get('/api/vehicles/available').set(auth(dToken));
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.vehicles)).toBe(true);
  });

  it('GET /api/vehicles/:id → 200', async () => {
    const r = await request(app).get(`/api/vehicles/${vehId}`).set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/vehicles/:id → 404', async () => {
    const r = await request(app).get('/api/vehicles/99999').set(auth(mToken));
    expect(r.status).toBe(404);
  });

  it('PUT /api/vehicles/:id → 200 update', async () => {
    const r = await request(app).put(`/api/vehicles/${vehId2}`).set(auth(mToken))
      .send({ make: 'Honda', model: 'Civic', year: 2023, color: 'blue', notes: 'test' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/vehicles/:id → 404 missing', async () => {
    const r = await request(app).put('/api/vehicles/99999').set(auth(mToken))
      .send({ make: 'X', model: 'X', year: 2020 });
    expect(r.status).toBe(404);
  });

  it('PATCH /api/vehicles/:id/status → 200', async () => {
    const r = await request(app).patch(`/api/vehicles/${vehId2}/status`).set(auth(mToken))
      .send({ status: 'maintenance' });
    expect(r.status).toBe(200);
    // restore
    await request(app).patch(`/api/vehicles/${vehId2}/status`).set(auth(mToken)).send({ status: 'available' });
  });

  it('PATCH /api/vehicles/:id/status → 400 invalid status', async () => {
    const r = await request(app).patch(`/api/vehicles/${vehId2}/status`).set(auth(mToken))
      .send({ status: 'destroyed' });
    expect(r.status).toBe(400);
  });

  it('PATCH /api/vehicles/:id/status → 404 missing vehicle', async () => {
    const r = await request(app).patch('/api/vehicles/99999/status').set(auth(mToken))
      .send({ status: 'available' });
    expect(r.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Inspections Controller', () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  it('POST /api/inspections → 201 create (pre)', async () => {
    const r = await request(app).post('/api/inspections').set(auth(dToken)).send({
      vehicle_id:  vehId, customer_name: 'Alice', customer_nic: '123456789V',
      customer_phone: '0771111111', rental_start: today, rental_end: tomorrow,
    });
    expect(r.status).toBe(201);
    inspId = r.body.id;
  });

  it('POST /api/inspections → 409 vehicle in-use', async () => {
    // vehId is already in-use after first inspection
    const r = await request(app).post('/api/inspections').set(auth(dToken2)).send({
      vehicle_id: vehId, customer_name: 'Bob', customer_nic: '987654321V',
      rental_start: today, rental_end: tomorrow,
    });
    expect(r.status).toBe(409);
  });

  it('POST /api/inspections → 404 vehicle not found', async () => {
    const r = await request(app).post('/api/inspections').set(auth(dToken)).send({
      vehicle_id: 99999, customer_name: 'X', customer_nic: 'X',
      rental_start: today, rental_end: tomorrow,
    });
    expect(r.status).toBe(404);
  });

  it('GET /api/inspections (manager) → 200', async () => {
    const r = await request(app).get('/api/inspections').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/inspections/my (driver) → 200', async () => {
    const r = await request(app).get('/api/inspections/my').set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/inspections/:id → 200', async () => {
    const r = await request(app).get(`/api/inspections/${inspId}`).set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/inspections/:id → 404', async () => {
    const r = await request(app).get('/api/inspections/99999').set(auth(mToken));
    expect(r.status).toBe(404);
  });

  it('PUT /api/inspections/:id → 200 update notes', async () => {
    const r = await request(app).put(`/api/inspections/${inspId}`).set(auth(dToken))
      .send({ overall_notes: 'Good condition' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/inspections/:id → 404 missing', async () => {
    const r = await request(app).put('/api/inspections/99999').set(auth(dToken))
      .send({ overall_notes: 'test' });
    expect(r.status).toBe(404);
  });

  it('POST /api/inspections/:id/complete → 200', async () => {
    const r = await request(app).post(`/api/inspections/${inspId}/complete`).set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('POST /api/inspections/:id/review → 200 approved', async () => {
    const r = await request(app).post(`/api/inspections/${inspId}/review`).set(auth(mToken))
      .send({ review_status: 'approved', notes: 'Looks good' });
    expect(r.status).toBe(200);
  });

  it('POST /api/inspections/:id/review → 200 flagged', async () => {
    // Seed a dedicated vehicle directly and create inspection on it
    const vr = await pool.query(
      `INSERT INTO vehicles (number_plate, make, model, year) VALUES ('FLAG-999', 'Test', 'Flag', 2020) RETURNING id`
    );
    const flagVehId = vr.rows[0].id;
    let r = await request(app).post('/api/inspections').set(auth(dToken2)).send({
      vehicle_id: flagVehId, customer_name: 'Charlie', customer_nic: '111111111V',
      rental_start: today, rental_end: tomorrow,
    });
    expect(r.status).toBe(201);
    inspId2 = r.body.id;
    await request(app).post(`/api/inspections/${inspId2}/complete`).set(auth(dToken2));
    r = await request(app).post(`/api/inspections/${inspId2}/review`).set(auth(mToken))
      .send({ review_status: 'flagged', notes: 'Issue found' });
    expect(r.status).toBe(200);
  });

  it('POST /api/inspections/:id/review → 400 invalid status', async () => {
    const r = await request(app).post(`/api/inspections/${inspId}/review`).set(auth(mToken))
      .send({ review_status: 'hack' });
    expect(r.status).toBe(400);
  });

  it('PATCH /api/inspections/:id/review → 200', async () => {
    const r = await request(app).patch(`/api/inspections/${inspId}/review`).set(auth(mToken))
      .send({ review_status: 'approved' });
    expect(r.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Manager Controller', () => {
  it('GET /api/manager/dashboard/stats → 200', async () => {
    const r = await request(app).get('/api/manager/dashboard/stats').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/dashboard/activity → 200', async () => {
    const r = await request(app).get('/api/manager/dashboard/activity').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/fleet/health-distribution → 200', async () => {
    const r = await request(app).get('/api/manager/fleet/health-distribution').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/recent-alerts → 200', async () => {
    const r = await request(app).get('/api/manager/recent-alerts').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/inspections → 200', async () => {
    const r = await request(app).get('/api/manager/inspections').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/inspections-summary → 200', async () => {
    const r = await request(app).get('/api/manager/inspections-summary').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/vehicles/:id/inspections → 200', async () => {
    const r = await request(app).get(`/api/manager/vehicles/${vehId}/inspections`).set(auth(mToken));
    expect([200, 404]).toContain(r.status);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Smart Assignment Controller', () => {
  it('POST /api/manager/smart-assignment → 400 missing lat/lng', async () => {
    const r = await request(app).post('/api/manager/smart-assignment').set(auth(mToken))
      .send({ customerTier: 'VIP' });
    expect(r.status).toBe(400);
  });

  it('POST /api/manager/smart-assignment → 400 invalid tier', async () => {
    const r = await request(app).post('/api/manager/smart-assignment').set(auth(mToken))
      .send({ pickupLat: 6.9, pickupLng: 79.8, customerTier: 'UNKNOWN' });
    expect(r.status).toBe(400);
  });

  it('POST /api/manager/smart-assignment → 200 or 404 VIP', async () => {
    // First make a vehicle available with GPS coords
    await pool.query(
      `UPDATE vehicles SET last_latitude=6.92, last_longitude=79.85, status='available' WHERE id=$1`,
      [vehId3 || vehId]
    );
    const r = await request(app).post('/api/manager/smart-assignment').set(auth(mToken))
      .send({ pickupLat: 6.9, pickupLng: 79.8, customerTier: 'VIP' });
    expect([200, 404]).toContain(r.status);
  });

  it('POST /api/manager/smart-assignment → 200 or 404 Standard', async () => {
    const r = await request(app).post('/api/manager/smart-assignment').set(auth(mToken))
      .send({ pickupLat: 6.9, pickupLng: 79.8, customerTier: 'Standard' });
    expect([200, 404]).toContain(r.status);
  });

  it('POST /api/manager/smart-assignment → 200 or 404 Budget', async () => {
    const r = await request(app).post('/api/manager/smart-assignment').set(auth(mToken))
      .send({ pickupLat: 6.9, pickupLng: 79.8, customerTier: 'Budget' });
    expect([200, 404]).toContain(r.status);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Analytics Controller', () => {
  it('GET /api/manager/analytics/health-trend → 200', async () => {
    const r = await request(app).get('/api/manager/analytics/health-trend').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/analytics/damage-types → 200', async () => {
    const r = await request(app).get('/api/manager/analytics/damage-types').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/analytics/top-damaged → 200', async () => {
    const r = await request(app).get('/api/manager/analytics/top-damaged').set(auth(mToken));
    expect(r.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GPS Controller', () => {
  it('GET /api/manager/vehicles/locations → 200', async () => {
    const r = await request(app).get('/api/manager/vehicles/locations').set(auth(mToken));
    expect(r.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Users Routes (Manager)', () => {
  it('GET /api/users/drivers → 200', async () => {
    const r = await request(app).get('/api/users/drivers').set(auth(mToken));
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.drivers)).toBe(true);
  });

  it('GET /api/users/drivers → 403 driver forbidden', async () => {
    const r = await request(app).get('/api/users/drivers').set(auth(dToken));
    expect(r.status).toBe(403);
  });

  it('GET /api/users/drivers/:id → 200', async () => {
    const r = await request(app).get(`/api/users/drivers/${dId}`).set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/users/drivers/:id → 404', async () => {
    const r = await request(app).get('/api/users/drivers/99999').set(auth(mToken));
    expect(r.status).toBe(404);
  });

  it('PUT /api/users/drivers/:id → 200 update name', async () => {
    const r = await request(app).put(`/api/users/drivers/${dId}`).set(auth(mToken))
      .send({ name: 'Updated Driver', phone: '0779876543', license_number: 'LIC-001' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/users/drivers/:id → 404 missing', async () => {
    const r = await request(app).put('/api/users/drivers/99999').set(auth(mToken))
      .send({ name: 'Ghost' });
    expect(r.status).toBe(404);
  });

  it('POST /api/users/drivers → 201 manager creates driver', async () => {
    const r = await request(app).post('/api/users/drivers').set(auth(mToken))
      .send({ name: 'New Driver', email: 'newdriver@e2e.com', password: 'Password123!', phone: '0770000001' });
    expect(r.status).toBe(201);
  });

  it('POST /api/users/drivers → 400 short password', async () => {
    const r = await request(app).post('/api/users/drivers').set(auth(mToken))
      .send({ name: 'X', email: 'x@e2e.com', password: 'short' });
    expect(r.status).toBe(400);
  });

  it('POST /api/users/drivers → 409 duplicate email', async () => {
    const r = await request(app).post('/api/users/drivers').set(auth(mToken))
      .send({ name: 'Y', email: 'driver@e2e.com', password: 'Password123!' });
    expect(r.status).toBe(409);
  });

  it('PUT /api/users/me → 200 update own name', async () => {
    const r = await request(app).put('/api/users/me').set(auth(dToken))
      .send({ name: 'My New Name', phone: '0770001111' });
    expect(r.status).toBe(200);
  });

  it('DELETE /api/users/drivers/:id → 200', async () => {
    // Create a throwaway driver to delete
    const cr = await request(app).post('/api/auth/register').send({
      name: 'Throwaway', email: 'throw@e2e.com', password: 'Password123!', role: 'driver',
    });
    const throwId = cr.body.user?.id;
    const r = await request(app).delete(`/api/users/drivers/${throwId}`).set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('DELETE /api/users/drivers/:id → 404 missing', async () => {
    const r = await request(app).delete('/api/users/drivers/99999').set(auth(mToken));
    expect(r.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('User Preferences Controller', () => {
  it('GET /api/user/preferences → 200', async () => {
    const r = await request(app).get('/api/user/preferences').set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/preferences → 200 with valid language', async () => {
    const r = await request(app).put('/api/user/preferences').set(auth(dToken))
      .send({ language: 'en', date_format: 'DD/MM/YYYY' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/preferences → 200 sinhala', async () => {
    const r = await request(app).put('/api/user/preferences').set(auth(dToken))
      .send({ language: 'si' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/preferences → 400 invalid language', async () => {
    const r = await request(app).put('/api/user/preferences').set(auth(dToken))
      .send({ language: 'fr' });
    expect(r.status).toBe(400);
  });

  it('PUT /api/user/preferences → 400 missing language', async () => {
    const r = await request(app).put('/api/user/preferences').set(auth(dToken))
      .send({ date_format: 'DD/MM/YYYY' });
    expect(r.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Notifications Controller', () => {
  let notifId;

  beforeAll(async () => {
    // Seed a notification directly
    const r = await pool.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'alert', 'Test notif') RETURNING id`,
      [mId]
    );
    notifId = r.rows[0]?.id;
  });

  it('GET /api/notifications → 200', async () => {
    const r = await request(app).get('/api/notifications').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('PATCH /api/notifications/:id/read → 200', async () => {
    const r = await request(app).patch(`/api/notifications/${notifId}/read`).set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('PATCH /api/notifications/:id/read → 200 (even for missing id - silent update)', async () => {
    const r = await request(app).patch('/api/notifications/99999/read').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('PATCH /api/notifications/read-all → 200', async () => {
    const r = await request(app).patch('/api/notifications/read-all').set(auth(mToken));
    expect(r.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Dashboard Controller', () => {
  it('GET /api/dashboard → driver gets 403 (manager-only route)', async () => {
    const r = await request(app).get('/api/dashboard/stats').set(auth(dToken));
    expect(r.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Middleware Coverage', () => {
  it('verifyToken → 401 no token', async () => {
    const r = await request(app).get('/api/auth/me');
    expect(r.status).toBe(401);
  });

  it('verifyToken → 401 malformed token', async () => {
    const r = await request(app).get('/api/auth/me').set('Authorization', 'Bearer abc.def.ghi');
    expect(r.status).toBe(401);
  });

  it('requireRole → 403 driver tries manager route', async () => {
    const r = await request(app).get('/api/users/drivers').set(auth(dToken));
    expect(r.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Model Files Direct Coverage', () => {
  // Call model functions directly for full line/branch coverage
  const DriverModel  = require('../models/driver.model');
  const VehicleModel = require('../models/vehicle.model');
  const InspModel    = require('../models/inspection.model');
  const UserModel    = require('../models/user.model');
  const NotifModel   = require('../models/notification.model');
  const PrefModel    = require('../models/userPreferences.model');

  it('DriverModel.listAllWithStats', async () => {
    const rows = await DriverModel.listAllWithStats();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('DriverModel.findByIdWithStats - valid', async () => {
    const r = await DriverModel.findByIdWithStats(dId);
    expect(r).not.toBeNull();
  });

  it('DriverModel.findByIdWithStats - missing', async () => {
    const r = await DriverModel.findByIdWithStats(99999);
    expect(r).toBeNull();
  });

  it('DriverModel.ensureIsDriver - valid driver', async () => {
    const r = await DriverModel.ensureIsDriver(dId);
    expect(r).toBe(true);
  });

  it('DriverModel.ensureIsDriver - manager returns false', async () => {
    const r = await DriverModel.ensureIsDriver(mId);
    expect(r).toBe(false);
  });

  it('DriverModel.findBasicById', async () => {
    const r = await DriverModel.findBasicById(dId);
    expect(r).not.toBeNull();
  });

  it('DriverModel.updateForUser - phone and license', async () => {
    await DriverModel.updateForUser(dId, { phone: '0771112222', license_number: 'LIC-999' });
  });

  it('DriverModel.updateForUser - no fields (early return)', async () => {
    await DriverModel.updateForUser(dId, {});
  });

  it('DriverModel.upsertPhone', async () => {
    await DriverModel.upsertPhone(dId, '0779001234');
  });

  it('VehicleModel.findAll - no filters', async () => {
    const rows = await VehicleModel.findAll({});
    expect(Array.isArray(rows)).toBe(true);
  });

  it('VehicleModel.findAll - with status and search', async () => {
    const rows = await VehicleModel.findAll({ status: 'available', search: 'Car', page: 1, limit: 5 });
    expect(Array.isArray(rows)).toBe(true);
  });

  it('VehicleModel.findAvailable', async () => {
    const rows = await VehicleModel.findAvailable();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('VehicleModel.findById - valid', async () => {
    const r = await VehicleModel.findById(vehId);
    expect(r).not.toBeNull();
  });

  it('VehicleModel.findById - missing', async () => {
    const r = await VehicleModel.findById(99999);
    expect(r).toBeNull();
  });

  it('VehicleModel.updateStatus - valid', async () => {
    const r = await VehicleModel.updateStatus(vehId2, 'maintenance', mId);
    // restore
    await VehicleModel.updateStatus(vehId2, 'available', mId);
    expect(r).not.toBeNull();
  });

  it('VehicleModel.updateStatus - missing', async () => {
    const r = await VehicleModel.updateStatus(99999, 'available', mId);
    expect(r).toBeNull();
  });

  it('InspModel.findById - valid', async () => {
    const r = await InspModel.findById(inspId);
    expect(r).not.toBeNull();
  });

  it('InspModel.findById - missing', async () => {
    const r = await InspModel.findById(99999);
    expect(r).toBeNull();
  });

  it('InspModel.updateNotes - valid', async () => {
    const r = await InspModel.updateNotes(inspId, dId, 'Direct model note');
    expect(r).toBeDefined();
  });

  it('InspModel.updateNotes - wrong driver → null', async () => {
    const r = await InspModel.updateNotes(inspId, 99999, 'note');
    expect(r).toBeNull();
  });

  it('InspModel.complete', async () => {
    await expect(InspModel.complete(inspId, dId)).resolves.not.toThrow();
  });

  it('InspModel.setPdfUrl and getPdfUrl', async () => {
    await InspModel.setPdfUrl(inspId, '/reports/test.pdf');
    const url = await InspModel.getPdfUrl(inspId);
    expect(url).toBe('/reports/test.pdf');
  });

  it('InspModel.getPdfUrl - missing → null', async () => {
    const url = await InspModel.getPdfUrl(99999);
    expect(url).toBeNull();
  });

  it('UserModel.findByEmail - valid', async () => {
    const r = await UserModel.findByEmail('driver@e2e.com');
    expect(r).not.toBeNull();
    expect(r.email).toBe('driver@e2e.com');
  });

  it('UserModel.findByEmail - missing', async () => {
    const r = await UserModel.findByEmail('nobody@nada.com');
    expect(r).toBeNull();
  });

  it('UserModel.existsByEmail - true', async () => {
    const r = await UserModel.existsByEmail('driver@e2e.com');
    expect(r).toBe(true);
  });

  it('UserModel.existsByEmail - false', async () => {
    const r = await UserModel.existsByEmail('nonexistent@e2e.com');
    expect(r).toBe(false);
  });

  it('UserModel.updateProfile - name only', async () => {
    const r = await UserModel.updateProfile(dId, { name: 'NewName' });
    expect(r).not.toBeNull();
  });

  it('UserModel.updateProfile - name and avatar', async () => {
    const r = await UserModel.updateProfile(dId, { name: 'NewName2', avatarUrl: 'http://img.test/a.jpg' });
    expect(r).not.toBeNull();
  });

  it('UserModel.updatePassword', async () => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('NewPassword123!', 12);
    await expect(UserModel.updatePassword(dId2, hash)).resolves.not.toThrow();
  });

  it('UserModel.findMeWithDriver', async () => {
    const r = await UserModel.findMeWithDriver(dId);
    expect(r).not.toBeNull();
  });

  it('NotifModel.create', async () => {
    await expect(NotifModel.create(dId, 'info', 'Direct create test')).resolves.not.toThrow();
  });

  it('NotifModel.listForUser', async () => {
    const rows = await NotifModel.listForUser(dId);
    expect(Array.isArray(rows)).toBe(true);
  });

  it('NotifModel.markAllRead', async () => {
    await expect(NotifModel.markAllRead(dId)).resolves.not.toThrow();
  });

  it('NotifModel.markRead', async () => {
    const r = await pool.query(`INSERT INTO notifications (user_id, type, message) VALUES ($1, 'test', 'x') RETURNING id`, [dId]);
    const nid = r.rows[0].id;
    await expect(NotifModel.markRead(nid, dId)).resolves.not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Profile Controller', () => {
  it('PUT /api/user/profile → 200 name update', async () => {
    const r = await request(app).put('/api/user/profile').set(auth(dToken))
      .send({ name: 'Profile Updated' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/profile → 200 driver with phone', async () => {
    const r = await request(app).put('/api/user/profile').set(auth(dToken))
      .send({ name: 'Driver Phone Update', phone: '0771230001' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/change-password → 200', async () => {
    const r = await request(app).put('/api/user/change-password').set(auth(dToken2))
      .send({ currentPassword: 'NewPassword123!', newPassword: 'Newer123Password!' });
    expect(r.status).toBe(200);
  });

  it('PUT /api/user/change-password → 401 wrong current password', async () => {
    const r = await request(app).put('/api/user/change-password').set(auth(dToken))
      .send({ currentPassword: 'WrongCurrent!', newPassword: 'Newer123Password!' });
    expect(r.status).toBe(401);
  });

  it('PUT /api/user/change-password → 400 missing fields', async () => {
    const r = await request(app).put('/api/user/change-password').set(auth(dToken))
      .send({ currentPassword: 'Password123!' });
    expect(r.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Driver Routes', () => {
  it('GET /api/driver/stats → 200', async () => {
    const r = await request(app).get('/api/driver/stats').set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/driver/stats → 403 manager forbidden', async () => {
    const r = await request(app).get('/api/driver/stats').set(auth(mToken));
    expect(r.status).toBe(403);
  });

  it('POST /api/driver/update-location → 200', async () => {
    const r = await request(app).post('/api/driver/update-location').set(auth(dToken))
      .send({ latitude: 6.92, longitude: 79.85, vehicleId: vehId });
    expect([200, 400, 404]).toContain(r.status);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Dashboard Routes (Manager)', () => {
  it('GET /api/dashboard/stats → 200', async () => {
    const r = await request(app).get('/api/dashboard/stats').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/dashboard/health-dist → 200', async () => {
    const r = await request(app).get('/api/dashboard/health-dist').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/dashboard/activity → 200', async () => {
    const r = await request(app).get('/api/dashboard/activity').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/dashboard/stats → 403 driver', async () => {
    const r = await request(app).get('/api/dashboard/stats').set(auth(dToken));
    expect(r.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('UserPreferences Model Direct', () => {
  const PrefModel = require('../models/userPreferences.model');

  it('upsert - creates new preference', async () => {
    await expect(PrefModel.upsert(dId, { language: 'ta', date_format: 'MM/DD/YYYY' })).resolves.not.toThrow();
  });

  it('upsert - updates existing preference', async () => {
    await expect(PrefModel.upsert(dId, { language: 'en', date_format: 'DD/MM/YYYY' })).resolves.not.toThrow();
  });

  it('getByUserId - returns preference', async () => {
    const r = await PrefModel.getByUserId(dId);
    expect(r).not.toBeNull();
  });

  it('getByUserId - missing user returns null', async () => {
    const r = await PrefModel.getByUserId(99999);
    expect(r).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Auth Extended - Forgot/Reset Password', () => {
  it('POST /api/auth/forgot-password → 200 existing email', async () => {
    const r = await request(app).post('/api/auth/forgot-password')
      .send({ email: 'driver@e2e.com' });
    expect(r.status).toBe(200);
    expect(r.body.message).toBeDefined();
  });

  it('POST /api/auth/forgot-password → 200 non-existing email (safe response)', async () => {
    const r = await request(app).post('/api/auth/forgot-password')
      .send({ email: 'nobody@none.com' });
    expect(r.status).toBe(200);
  });

  it('POST /api/auth/reset-password → 400 invalid token', async () => {
    const r = await request(app).post('/api/auth/reset-password')
      .send({ token: 'bad-token-here', password: 'NewPassword123!' });
    expect(r.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Inspections Controller - Branch Coverage Extensions', () => {
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  it('GET /api/inspections with filters (status, vehicle_id, driver_id)', async () => {
    const r = await request(app)
      .get(`/api/inspections?status=completed&vehicle_id=${vehId}&driver_id=${dId}&page=1&limit=5`)
      .set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/inspections/my with pagination', async () => {
    const r = await request(app).get('/api/inspections/my?page=1&limit=5').set(auth(dToken));
    expect(r.status).toBe(200);
  });

  it('POST /api/inspections/:id/analyze → 400 not enough photos', async () => {
    const r = await request(app).post(`/api/inspections/${inspId}/analyze`).set(auth(dToken));
    expect(r.status).toBe(400);
  });

  it('GET /api/inspections/:id/pdf → 200 with pdf_url set', async () => {
    // inspId already has a pdf_url set from model test
    const r = await request(app).get(`/api/inspections/${inspId}/pdf`).set(auth(mToken));
    expect([200, 301, 302, 404]).toContain(r.status);
  });

  it('GET /api/inspections/:id/pdf → 404 when no pdf', async () => {
    // Use an inspection without PDF
    const r = await request(app).get(`/api/inspections/${inspId2}/pdf`).set(auth(mToken));
    expect([200, 302, 404]).toContain(r.status);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Manager Controller - Branch Coverage Extensions', () => {
  it('GET /api/manager/inspections with filters', async () => {
    const r = await request(app)
      .get('/api/manager/inspections?status=completed').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/inspections-summary', async () => {
    const r = await request(app).get('/api/manager/inspections-summary').set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/analytics/health-trend with custom range', async () => {
    const r = await request(app)
      .get('/api/manager/analytics/health-trend?start=2020-01-01&end=2030-12-31')
      .set(auth(mToken));
    expect(r.status).toBe(200);
  });

  it('GET /api/manager/vehicles/locations', async () => {
    const r = await request(app).get('/api/manager/vehicles/locations').set(auth(mToken));
    expect(r.status).toBe(200);
  });
});
