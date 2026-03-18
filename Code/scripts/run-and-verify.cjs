#!/usr/bin/env node
/**
 * Run this after: docker compose up -d (or start Postgres) and npm install in backend + root.
 * From repo root: node scripts/run-and-verify.cjs
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');
const BACKEND_ENV = path.join(BACKEND, '.env');

function log(msg, ok = null) {
  const s = ok === true ? '✓' : ok === false ? '✗' : '·';
  console.log(`${s} ${msg}`);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  console.log('FleetGuard AI — run & verify\n');

  // 1) Backend .env
  if (!fs.existsSync(BACKEND_ENV)) {
    log('backend/.env missing', false);
    process.exit(1);
  }
  log('backend/.env exists', true);

  // 2) DB init (optional; may fail if Postgres not running)
  const initDb = spawn('node', [path.join(BACKEND, 'scripts', 'init-db.js')], {
    cwd: BACKEND,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PATH: process.env.PATH },
  });
  let initOk = false;
  initDb.stdout?.on('data', (d) => process.stdout.write(d));
  initDb.stderr?.on('data', (d) => process.stderr.write(d));
  await new Promise((r) => initDb.on('close', (code) => { initOk = code === 0; r(); }));
  if (initOk) {
    log('Database init (db:init) succeeded', true);
  } else {
    log('Database init failed (is Postgres running? docker compose up -d)', false);
  }

  // 3) Start backend
  const server = spawn('node', [path.join(BACKEND, 'server.js')], {
    cwd: BACKEND,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PATH: process.env.PATH },
  });
  server.stdout?.on('data', (d) => process.stdout.write(d));
  server.stderr?.on('data', (d) => process.stderr.write(d));

  await new Promise((r) => setTimeout(r, 2500));

  let healthOk = false;
  try {
    const res = await get('http://localhost:3001/api/health');
    healthOk = res.status === 200 && res.body.includes('"status":"ok"');
  } catch (_) {}

  if (healthOk) {
    log('Backend health check GET /api/health', true);
  } else {
    log('Backend health check failed (is port 3001 free?)', false);
  }

  // 4) Quick auth test
  let authOk = false;
  if (healthOk) {
    try {
      const post = (path, body) => new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
          hostname: 'localhost',
          port: 3001,
          path,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
        }, (res) => {
          let b = '';
          res.on('data', (c) => (b += c));
          res.on('end', () => resolve({ status: res.statusCode, body: b }));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });
      const reg = await post('/api/auth/register', {
        name: 'Verify User',
        email: 'verify@run.test',
        password: 'Password123!',
        role: 'driver',
      });
      if (reg.status === 201) {
        const login = await post('/api/auth/login', { email: 'verify@run.test', password: 'Password123!' });
        authOk = login.status === 200 && login.body.includes('"token"');
      }
    } catch (_) {}
  }
  if (authOk) {
    log('Auth flow (register + login)', true);
  } else {
    log('Auth flow skipped or failed', false);
  }

  server.kill('SIGTERM');
  console.log('\nDone. Start manually: backend: npm run dev (in backend/), frontend: npm run dev (in root).');
}

main().catch((e) => { console.error(e); process.exit(1); });
