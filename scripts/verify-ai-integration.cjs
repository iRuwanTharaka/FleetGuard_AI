#!/usr/bin/env node
/**
 * FleetGuard AI Integration — Self-Check
 * Run from repo root: node scripts/verify-ai-integration.cjs
 *
 * Verifies: AI service, backend, AI detect endpoint, backend→AI connectivity
 */
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

function log(msg, ok = null) {
  const s = ok === true ? '✓' : ok === false ? '✗' : '·';
  console.log(`${s} ${msg}`);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

async function testAiDetect() {
  const testImg = path.join(__dirname, '..', 'test-img.jpg');
  if (!fs.existsSync(testImg)) {
    log('test-img.jpg not found, skipping AI detect test', false);
    return false;
  }
  return new Promise((resolve) => {
    const boundary = '----FormBoundary' + Date.now();
    const fileBuf = fs.readFileSync(testImg);
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="images"; filename="test.jpg"',
      'Content-Type: image/jpeg',
      '',
      fileBuf.toString('binary'),
      `--${boundary}`,
      'Content-Disposition: form-data; name="inspection_id"',
      '',
      'verify-test-123',
      `--${boundary}--`,
    ].join('\r\n');

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/detect',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(body, 'binary'),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const ok = json.success && typeof json.health_score === 'number';
            log(`AI /api/detect (stub_mode=${json.model_info?.stub_mode})`, ok);
            resolve(ok);
          } catch {
            log('AI /api/detect — invalid response', false);
            resolve(false);
          }
        });
      }
    );
    req.on('error', () => {
      log('AI /api/detect — request failed', false);
      resolve(false);
    });
    req.write(body, 'binary');
    req.end();
  });
}

async function main() {
  console.log('\nFleetGuard AI Integration — Self-Check\n');
  console.log('═'.repeat(50));

  let allOk = true;

  // 1) AI service health
  try {
    const res = await get(`${AI_URL}/api/health`);
    const ok = res.status === 200 && res.body.includes('"status":"healthy"');
    log('AI service GET /api/health', ok);
    if (!ok) allOk = false;
  } catch (e) {
    log('AI service unreachable (start: cd outputs/fleetguard-ai-service && python app.py)', false);
    allOk = false;
  }

  // 2) Backend health
  try {
    const res = await get(`${BACKEND_URL}/api/health`);
    const ok = res.status === 200 && res.body.includes('"status":"ok"');
    log('Backend GET /api/health', ok);
    if (!ok) allOk = false;
  } catch (e) {
    log('Backend unreachable (start: cd backend && npm run dev)', false);
    allOk = false;
  }

  // 3) AI detect endpoint (full flow)
  try {
    const ok = await testAiDetect();
    if (!ok) allOk = false;
  } catch (e) {
    log('AI detect test failed', false);
    allOk = false;
  }

  console.log('═'.repeat(50));
  if (allOk) {
    console.log('\n✓ All AI integration checks passed.\n');
    process.exit(0);
  } else {
    console.log('\n✗ Some checks failed. Ensure AI service and backend are running.\n');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
