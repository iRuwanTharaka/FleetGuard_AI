/**
 * Verifies Sprint 4 manager endpoints.
 * Run: node scripts/verify-sprint4.cjs
 */
const http = require('http');

const BASE = 'http://localhost:3001';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    const url = new URL(BASE + (fullPath.startsWith('/api') ? fullPath : '/api' + fullPath));
    const opts = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers.Authorization = `Bearer ${token}`;
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('=== Sprint 4 Verification ===\n');

  // 1. Health
  const health = await request('GET', '/health');
  console.log('1. GET /api/health:', health.status === 200 ? 'OK' : 'FAIL', health.data?.status || health.data);

  // 2. Register manager
  const reg = await request('POST', '/auth/register', {
    name: 'Test Manager',
    email: `manager-${Date.now()}@test.com`,
    password: 'Test123!',
    role: 'manager',
  });
  if (reg.status !== 201) {
    console.log('2. Register manager: FAIL', reg.data);
    return;
  }
  const token = reg.data?.token;
  console.log('2. Register manager: OK');

  // 3. Dashboard stats
  const stats = await request('GET', '/manager/dashboard/stats', null, token);
  console.log('3. GET /manager/dashboard/stats:', stats.status === 200 ? 'OK' : 'FAIL', stats.status);
  if (stats.status === 200) {
    console.log('   -> total_vehicles:', stats.data?.total_vehicles, '| pending_reviews:', stats.data?.pending_reviews);
  }

  // 4. Health distribution
  const healthDist = await request('GET', '/manager/fleet/health-distribution', null, token);
  console.log('4. GET /manager/fleet/health-distribution:', healthDist.status === 200 ? 'OK' : 'FAIL');

  // 5. Recent alerts
  const alerts = await request('GET', '/manager/recent-alerts', null, token);
  console.log('5. GET /manager/recent-alerts:', alerts.status === 200 ? 'OK' : 'FAIL');

  // 6. Manager inspections
  const insp = await request('GET', '/manager/inspections?page=1&limit=5', null, token);
  console.log('6. GET /manager/inspections:', insp.status === 200 ? 'OK' : 'FAIL');

  // 7. Vehicle inspection history (if we have vehicles)
  const vehicles = await request('GET', '/vehicles', null, token);
  if (vehicles.status === 200 && vehicles.data?.vehicles?.length > 0) {
    const vId = vehicles.data.vehicles[0].id;
    const hist = await request('GET', `/vehicles/${vId}/inspection-history`, null, token);
    console.log('7. GET /vehicles/:id/inspection-history:', hist.status === 200 ? 'OK' : 'FAIL');
  } else {
    console.log('7. GET /vehicles/:id/inspection-history: SKIP (no vehicles)');
  }

  console.log('\n=== Verification complete ===');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
