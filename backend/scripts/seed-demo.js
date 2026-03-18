/**
 * Seeds FleetGuard with realistic demo data: users, drivers, managers,
 * vehicles (with photos + GPS), inspections, photos, damage detections,
 * signatures, reviews, notifications. Run after migrations and download-demo-images.
 *
 * Demo login: driver1@demo.fleetguard.com / Demo123!  (same for driver2, driver3, manager1, manager2, admin@demo.fleetguard.com)
 *
 * Usage: node scripts/seed-demo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DEMO_PASSWORD = 'Demo123!';
const DEMO_DIR = '/uploads/demo';

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'fleetguard_db',
    };

async function main() {
  const client = new Client(config);
  await client.connect();

  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);

  try {
    // ─── 1. Users (drivers, managers, admin) ─────────────────────
    const userEmails = [
      ['Nimal Perera', 'driver1@demo.fleetguard.com', 'driver'],
      ['Kamal Silva', 'driver2@demo.fleetguard.com', 'driver'],
      ['Sunil Fernando', 'driver3@demo.fleetguard.com', 'driver'],
      ['Anjali Jayawardena', 'manager1@demo.fleetguard.com', 'manager'],
      ['Ruwan Dias', 'manager2@demo.fleetguard.com', 'manager'],
      ['Fleet Admin', 'admin@demo.fleetguard.com', 'admin'],
    ];

    const userIds = {};
    for (const [name, email, role] of userEmails) {
      const r = await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET password_hash = $3, name = $1, role = $4
         RETURNING id`,
        [name, email, hash, role]
      );
      userIds[email] = r.rows[0].id;
    }

    const driver1 = userIds['driver1@demo.fleetguard.com'];
    const driver2 = userIds['driver2@demo.fleetguard.com'];
    const driver3 = userIds['driver3@demo.fleetguard.com'];
    const manager1 = userIds['manager1@demo.fleetguard.com'];
    const manager2 = userIds['manager2@demo.fleetguard.com'];

    // ─── 2. Drivers & Managers rows ─────────────────────────────
    for (const [email, license, phone] of [
      ['driver1@demo.fleetguard.com', 'B1234567', '+94771234567'],
      ['driver2@demo.fleetguard.com', 'B2345678', '+94772345678'],
      ['driver3@demo.fleetguard.com', 'B3456789', '+94773456789'],
    ]) {
      await client.query(
        `INSERT INTO drivers (user_id, license_number, phone) VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET license_number = $2, phone = $3`,
        [userIds[email], license, phone]
      );
    }
    for (const [email, dept] of [
      ['manager1@demo.fleetguard.com', 'Operations'],
      ['manager2@demo.fleetguard.com', 'Fleet'],
    ]) {
      await client.query(
        `INSERT INTO managers (user_id, department) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET department = $2`,
        [userIds[email], dept]
      );
    }

    // ─── 3. Vehicles (ensure 5 with photo_url and GPS) ──────────
    const vehicleSeed = path.join(__dirname, '..', '..', 'database', 'migrations', '000_seed_vehicles.sql');
    if (fs.existsSync(vehicleSeed)) {
      await client.query(fs.readFileSync(vehicleSeed, 'utf8'));
    }

    await client.query(`
      INSERT INTO vehicles (number_plate, make, model, year, color, vehicle_type, health_score, status, last_latitude, last_longitude, last_location_update)
      VALUES
        ('WP-AB 4567', 'Toyota', 'Vitz', 2021, 'Red', 'car', 94, 'available', 6.9271, 79.8612, NOW() - INTERVAL '45 mins'),
        ('CP-CD 7890', 'Honda', 'Grace', 2020, 'Pearl White', 'car', 87, 'available', 7.2906, 80.6337, NOW() - INTERVAL '2 hours')
      ON CONFLICT (number_plate) DO NOTHING
    `);

    const vRows = await client.query(
      `SELECT id, number_plate FROM vehicles ORDER BY id LIMIT 5`
    );
    const vehicleIds = vRows.rows.map((r) => r.id);
    const photoUrls = [
      `${DEMO_DIR}/vehicle-1.jpg`,
      `${DEMO_DIR}/vehicle-2.jpg`,
      `${DEMO_DIR}/vehicle-3.jpg`,
      `${DEMO_DIR}/vehicle-4.jpg`,
      `${DEMO_DIR}/vehicle-5.jpg`,
    ];
    const lats = [6.9271, 7.2906, 6.0535, 8.3114, 6.827];
    const lngs = [79.8612, 80.6337, 80.221, 80.4037, 79.8773];
    for (let i = 0; i < vehicleIds.length; i++) {
      const hoursAgo = `${i + 1} hours`;
      await client.query(
        `UPDATE vehicles SET photo_url = $1, last_latitude = $2, last_longitude = $3, last_location_update = NOW() - $4::INTERVAL WHERE id = $5`,
        [photoUrls[i % photoUrls.length], lats[i], lngs[i], hoursAgo, vehicleIds[i]]
      );
    }

    // ─── 4. Inspections (pre + post, mix statuses) ─────────────────
    const inspections = [
      { vehicle_id: vehicleIds[0], driver_id: driver1, customer_name: 'Samantha Wickramasinghe', customer_nic: '901234567V', customer_phone: '0771234567', rental_start: '2025-03-01', rental_end: '2025-03-05', type: 'pre', status: 'reviewed', health_score: 92, manager_id: manager1, review_status: 'approved' },
      { vehicle_id: vehicleIds[0], driver_id: driver1, customer_name: 'Samantha Wickramasinghe', customer_nic: '901234567V', customer_phone: '0771234567', rental_start: '2025-03-01', rental_end: '2025-03-05', type: 'post', status: 'reviewed', health_score: 85, manager_id: manager1, review_status: 'flagged' },
      { vehicle_id: vehicleIds[1], driver_id: driver2, customer_name: 'Rajesh Kumar', customer_nic: '892345678V', customer_phone: '0772345678', rental_start: '2025-03-08', rental_end: '2025-03-12', type: 'pre', status: 'completed', health_score: 88, manager_id: null, review_status: 'pending' },
      { vehicle_id: vehicleIds[2], driver_id: driver1, customer_name: 'Nadeesha Gunawardena', customer_nic: '883456789V', customer_phone: '0773456789', rental_start: '2025-03-10', rental_end: '2025-03-15', type: 'pre', status: 'reviewed', health_score: 78, manager_id: manager2, review_status: 'approved' },
      { vehicle_id: vehicleIds[2], driver_id: driver1, customer_name: 'Nadeesha Gunawardena', customer_nic: '883456789V', customer_phone: '0773456789', rental_start: '2025-03-10', rental_end: '2025-03-15', type: 'post', status: 'reviewed', health_score: 72, manager_id: manager2, review_status: 'approved' },
      { vehicle_id: vehicleIds[3], driver_id: driver3, customer_name: 'Chamari Atapattu', customer_nic: '874567890V', customer_phone: '0774567890', rental_start: '2025-03-12', rental_end: '2025-03-14', type: 'pre', status: 'in_progress', health_score: null, manager_id: null, review_status: 'pending' },
    ];

    const inspectionIds = [];
    for (const i of inspections) {
      const r = await client.query(
        `INSERT INTO inspections (vehicle_id, driver_id, customer_name, customer_nic, customer_phone, rental_start, rental_end, inspection_type, status, health_score, manager_id, review_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [i.vehicle_id, i.driver_id, i.customer_name, i.customer_nic, i.customer_phone, i.rental_start, i.rental_end, i.type, i.status, i.health_score, i.manager_id, i.review_status]
      );
      inspectionIds.push(r.rows[0].id);
    }

    // ─── 5. Inspection photos (8 types per inspection) ───────────
    const photoTypes = ['front', 'rear', 'left', 'right', 'interior', 'dashboard', 'odometer', 'damage'];
    const photoFiles = ['front.jpg', 'rear.jpg', 'left.jpg', 'right.jpg', 'interior.jpg', 'dashboard.jpg', 'odometer.jpg', 'damage.jpg'];
    const photoIdsByInspection = {};

    for (let idx = 0; idx < inspectionIds.length; idx++) {
      const inspectionId = inspectionIds[idx];
      photoIdsByInspection[inspectionId] = [];
      for (let t = 0; t < photoTypes.length; t++) {
        const fileUrl = `${DEMO_DIR}/${photoFiles[t]}`;
        const r = await client.query(
          `INSERT INTO inspection_photos (inspection_id, photo_type, file_url, file_name) VALUES ($1, $2, $3, $4) RETURNING id`,
          [inspectionId, photoTypes[t], fileUrl, photoFiles[t]]
        );
        photoIdsByInspection[inspectionId].push({ type: photoTypes[t], id: r.rows[0].id });
      }
    }

    // ─── 6. Damage detections (on inspections 1, 2, 4, 5 – post/pre with damage) ───
    const damageTypes = ['scratch', 'dent', 'paint_chip', 'crack', 'scuff'];
    const severities = ['low', 'medium', 'high'];
    const inspectionsWithDamage = [0, 1, 3, 4];
    for (const inspIdx of inspectionsWithDamage) {
      const inspectionId = inspectionIds[inspIdx];
      const photos = photoIdsByInspection[inspectionId];
      const damagePhoto = photos.find((p) => p.type === 'damage');
      const rearPhoto = photos.find((p) => p.type === 'rear');
      const frontPhoto = photos.find((p) => p.type === 'front');
      const photoId = (damagePhoto || rearPhoto || frontPhoto).id;
      const count = inspIdx === 1 ? 3 : inspIdx === 4 ? 2 : 1;
      for (let d = 0; d < count; d++) {
        await client.query(
          `INSERT INTO damage_detections (inspection_id, photo_id, damage_type, severity, confidence, bbox_json)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            inspectionId,
            photoId,
            damageTypes[d % damageTypes.length],
            severities[d % 3],
            (85 + Math.floor(Math.random() * 14)).toFixed(2),
            JSON.stringify({ x: 100 + d * 80, y: 120, w: 150, h: 100 }),
          ]
        );
      }
    }

    // ─── 7. Digital signatures (completed/reviewed inspections) ─────
    const sigUrl = `${DEMO_DIR}/signature.png`;
    for (const inspectionId of inspectionIds.slice(0, 5)) {
      await client.query(
        `INSERT INTO digital_signatures (inspection_id, signer_type, signature_url) VALUES ($1, 'driver', $2)`,
        [inspectionId, sigUrl]
      );
      await client.query(
        `INSERT INTO digital_signatures (inspection_id, signer_type, signature_url) VALUES ($1, 'customer', $2)`,
        [inspectionId, sigUrl]
      );
    }

    // ─── 8. Inspection reviews (manager) ───────────────────────────
    for (let i = 0; i < inspections.length; i++) {
      const insp = inspections[i];
      if (insp.manager_id && insp.review_status !== 'pending') {
        const notes = insp.review_status === 'flagged' ? 'Minor scratch on rear bumper noted. Customer informed.' : null;
        await client.query(
          `INSERT INTO inspection_reviews (inspection_id, manager_id, review_status, notes)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (inspection_id) DO UPDATE SET review_status = $3, notes = $4, reviewed_at = NOW()`,
          [inspectionIds[i], insp.manager_id, insp.review_status, notes]
        );
      }
    }

    // ─── 9. Notifications (damage alerts, assignments) ─────────────
    const notifications = [
      [manager1, 'damage_alert', 'Post-rental inspection #' + inspectionIds[1] + ' reported 3 damage items. Review recommended.'],
      [manager2, 'inspection_review', 'Inspection #' + inspectionIds[3] + ' has been approved.'],
      [driver1, 'assignment', 'Vehicle WP-1234 assigned for rental to Samantha Wickramasinghe.'],
      [manager1, 'damage_alert', 'Vehicle health score dropped on inspection #' + inspectionIds[4] + '.'],
    ];
    for (const [userId, type, message] of notifications) {
      await client.query(
        'INSERT INTO notifications (user_id, type, message, is_read) VALUES ($1, $2, $3, $4)',
        [userId, type, message, Math.random() > 0.6]
      );
    }

    // ─── 10. User preferences (optional) ───────────────────────────
    for (const uid of [driver1, driver2, manager1]) {
      await client.query(
        `INSERT INTO user_preferences (user_id, language, date_format) VALUES ($1, 'en', 'DD/MM/YYYY')
         ON CONFLICT (user_id) DO NOTHING`,
        [uid]
      );
    }

    console.log('Demo seed completed.');
    console.log('  Users: 3 drivers, 2 managers, 1 admin');
    console.log('  Vehicles: 5 with photos and GPS (Smart Assignment ready)');
    console.log('  Inspections: 6 (pre/post, mix of in_progress, completed, reviewed)');
    console.log('  Damage detections and reviews seeded.');
    console.log('');
    console.log('Login: driver1@demo.fleetguard.com / Demo123!');
    console.log('       manager1@demo.fleetguard.com / Demo123!');
    console.log('       admin@demo.fleetguard.com / Demo123!');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
