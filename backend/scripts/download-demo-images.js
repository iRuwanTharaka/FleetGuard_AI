/**
 * Downloads demo images for FleetGuard (vehicles, inspection photos, damage).
 * Saves to backend/uploads/demo/ so seed-demo.js can reference them.
 * Uses real stock photos (Unsplash/Pexels-style URLs) and Picsum fallbacks.
 * Run: node scripts/download-demo-images.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));
const DEMO_DIR = path.join(UPLOAD_DIR, 'demo');

// Exact 8 inspection photo types (schema + AI PHOTO_LABELS): front, rear, left, right, interior, dashboard, odometer, damage.
// Real Unsplash photos: car angles + clear dent/crash for damage so it's easy to identify.
// Format: https://images.unsplash.com/photo-<timestamp>-<hash>?w=800
const IMAGES = {
  // ---- Vehicle fleet (5 cars) ----
  'vehicle-1.jpg': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
  'vehicle-2.jpg': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  'vehicle-3.jpg': 'https://images.unsplash.com/photo-1502877338530-7667bfa8246e?w=800',
  'vehicle-4.jpg': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  'vehicle-5.jpg': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
  // ---- 8 required inspection photos ----
  'front.jpg': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',           // Front View – car front
  'rear.jpg': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',            // Rear View – car rear
  'left.jpg': 'https://images.unsplash.com/photo-1502877338530-7667bfa8246e?w=800',         // Left Side – car left profile
  'right.jpg': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',           // Right Side – car right profile
  'interior.jpg': 'https://images.unsplash.com/photo-1732399962053-07138c18370e?w=800',     // Interior – cabin, steering wheel, seats
  'dashboard.jpg': 'https://images.unsplash.com/photo-1645095117583-541b1de184a2?w=800',    // Dashboard – steering + speedometer
  'odometer.jpg': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',      // Odometer / Additional – gauge close-up
  'damage.jpg': 'https://images.unsplash.com/photo-1760804462351-212877c1d4e5?w=800',       // Damage – white car damaged bumper (dent/scratch)
  'damage2.jpg': 'https://images.unsplash.com/photo-1666094240666-66530dde9101?w=800',       // Damage alt – smashed front (crash, very obvious)
};

function download(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      const redirect = res.statusCode >= 300 && res.statusCode < 400 && res.headers.location;
      if (redirect) {
        download(redirect).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DEMO_DIR)) fs.mkdirSync(DEMO_DIR, { recursive: true });

  console.log('Downloading demo images to', DEMO_DIR);
  let ok = 0;
  for (const [filename, url] of Object.entries(IMAGES)) {
    const filepath = path.join(DEMO_DIR, filename);
    try {
      const buf = await download(url);
      if (buf.length < 500) {
        throw new Error('Response too small (likely not an image)');
      }
      fs.writeFileSync(filepath, buf);
      console.log('  OK', filename);
      ok++;
    } catch (err) {
      console.warn('  SKIP', filename, err.message || err);
      // Fallback: Picsum deterministic image
      const seed = filename.replace(/\.[^.]+$/, '').replace(/-/g, '');
      const fallback = `https://picsum.photos/seed/${seed}/800/600`;
      try {
        const buf = await download(fallback);
        fs.writeFileSync(filepath, buf);
        console.log('  OK (picsum)', filename);
        ok++;
      } catch (e2) {
        console.error('  FAIL', filename, e2.message);
      }
    }
  }

  // Minimal signature placeholder (1x1 PNG then overwrite with a real tiny signature PNG)
  const signaturePath = path.join(DEMO_DIR, 'signature.png');
  if (!fs.existsSync(signaturePath)) {
    const minimalPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(signaturePath, minimalPng);
    console.log('  OK signature.png (placeholder)');
    ok++;
  }

  console.log('Done.', ok, 'files in', DEMO_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
