/**
 * @module     Testing Related
 * @author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
 * @description This file is part of the test suite of FleetGuard AI.
 *              Developed and maintained by Iruwan Tharaka.
 * @date       2026-02-20
 */

/**
 * FleetGuard API Test Runner
 * Run: node tests/run-api-tests.js
 * Requires: backend running on http://localhost:3001
 */
const BASE = 'http://localhost:3001/api';

async function request(method, path, body = null, token = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function run() {
  const results = { passed: 0, failed: 0, errors: [] };

  function ok(name, condition, msg) {
    if (condition) {
      results.passed++;
      console.log(`  ✓ ${name}`);
    } else {
      results.failed++;
      results.errors.push(`${name}: ${msg}`);
      console.log(`  ✗ ${name}: ${msg}`);
    }
  }

  console.log('\n=== FleetGuard API Tests ===\n');

  // 1. Health
  try {
    const h = await request('GET', '/health');
    ok('Health check', h.status === 200 && h.data?.status === 'ok', `status=${h.status}`);
  } catch (e) {
    ok('Health check', false, e.message);
  }

  // 2. Register (if needed) + Login
  let managerToken = null;
  let driverToken = null;
  const testManagerEmail = `manager-${Date.now()}@test.fleetguard.lk`;
  const testDriverEmail = `driver-${Date.now()}@test.fleetguard.lk`;

  try {
    const regM = await request('POST', '/auth/register', {
      name: 'Test Manager',
      email: testManagerEmail,
      password: 'Test123!@#',
      role: 'manager',
    });
    if (regM.status === 201 && regM.data?.token) {
      managerToken = regM.data.token;
      ok('Register manager', true);
    } else {
      const loginM = await request('POST', '/auth/login', {
        email: testManagerEmail,
        password: 'Test123!@#',
      });
      if (loginM.status === 200 && loginM.data?.token) {
        managerToken = loginM.data.token;
        ok('Login manager', true);
      } else {
        ok('Auth manager', false, 'Register/login failed');
      }
    }
  } catch (e) {
    ok('Auth manager', false, e.message);
  }

  try {
    const regD = await request('POST', '/auth/register', {
      name: 'Test Driver',
      email: testDriverEmail,
      password: 'Test123!@#',
      role: 'driver',
    });
    if (regD.status === 201 && regD.data?.token) {
      driverToken = regD.data.token;
      ok('Register driver', true);
    } else {
      const loginD = await request('POST', '/auth/login', {
        email: testDriverEmail,
        password: 'Test123!@#',
      });
      if (loginD.status === 200 && loginD.data?.token) {
        driverToken = loginD.data.token;
        ok('Login driver', true);
      } else {
        ok('Auth driver', false, 'Register/login failed');
      }
    }
  } catch (e) {
    ok('Auth driver', false, e.message);
  }

  // 3. Get Me
  if (managerToken) {
    try {
      const me = await request('GET', '/auth/me', null, managerToken);
      ok('Get Me (manager)', me.status === 200 && me.data?.email, `status=${me.status}`);
    } catch (e) {
      ok('Get Me (manager)', false, e.message);
    }
  }

  // 4. Manager Dashboard Stats
  if (managerToken) {
    try {
      const stats = await request('GET', '/manager/dashboard/stats', null, managerToken);
      ok('Manager dashboard stats', stats.status === 200 && typeof stats.data?.total_vehicles === 'number', `status=${stats.status}`);
    } catch (e) {
      ok('Manager dashboard stats', false, e.message);
    }
  }

  // 5. List Drivers
  if (managerToken) {
    try {
      const drivers = await request('GET', '/users/drivers', null, managerToken);
      ok('List drivers', drivers.status === 200 && Array.isArray(drivers.data?.drivers), `status=${drivers.status}`);
    } catch (e) {
      ok('List drivers', false, e.message);
    }
  }

  // 6. Vehicles
  if (managerToken) {
    try {
      const vehicles = await request('GET', '/vehicles', null, managerToken);
      ok('List vehicles', vehicles.status === 200 && Array.isArray(vehicles.data?.vehicles), `status=${vehicles.status}`);
    } catch (e) {
      ok('List vehicles', false, e.message);
    }
  }

  // 7. Driver stats
  if (driverToken) {
    try {
      const stats = await request('GET', '/driver/stats', null, driverToken);
      ok('Driver stats', stats.status === 200, `status=${stats.status}`);
    } catch (e) {
      ok('Driver stats', false, e.message);
    }
  }

  // 8. Inspections my
  if (driverToken) {
    try {
      const insp = await request('GET', '/inspections/my?page=1', null, driverToken);
      ok('Inspections my', insp.status === 200 && Array.isArray(insp.data?.inspections), `status=${insp.status}`);
    } catch (e) {
      ok('Inspections my', false, e.message);
    }
  }

  // 9. Notifications
  if (managerToken) {
    try {
      const notif = await request('GET', '/notifications', null, managerToken);
      ok('Notifications', notif.status === 200, `status=${notif.status}`);
    } catch (e) {
      ok('Notifications', false, e.message);
    }
  }

  // 10. User preferences
  if (managerToken) {
    try {
      const prefs = await request('GET', '/user/preferences', null, managerToken);
      ok('User preferences', prefs.status === 200, `status=${prefs.status}`);
    } catch (e) {
      ok('User preferences', false, e.message);
    }
  }

  // 11. Analytics
  if (managerToken) {
    try {
      const analytics = await request('GET', '/manager/analytics/health-trend?days=7', null, managerToken);
      ok('Analytics health-trend', analytics.status === 200, `status=${analytics.status}`);
    } catch (e) {
      ok('Analytics health-trend', false, e.message);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  if (results.errors.length) {
    console.log('\nErrors:', results.errors);
  }
  process.exit(results.failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error('Test runner failed:', e);
  process.exit(1);
});
