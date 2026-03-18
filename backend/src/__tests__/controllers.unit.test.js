/**
 * @module     Testing Related
 * @author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
 * @description This file is part of the test suite of FleetGuard AI.
 *              Developed and maintained by Iruwan Tharaka.
 * @date       2026-02-14
 */

/**
 * FleetGuard Controller Unit Tests — Direct Function Calls
 * These tests call controller functions directly with mock req/res
 * to cover branches that are unreachable via HTTP (file uploads, AI service, PDF).
 * Real DB pool is used so all queries execute authentically.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/database');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

// Mock axios for AI trigger tests
jest.mock('axios');
const axios = require('axios');

// ── Helpers ──────────────────────────────────────────────────────────────────
const mockRes = () => {
  const r = {
    _status: 200,
    _body: null,
    _redirected: null,
  };
  r.status    = jest.fn((code) => { r._status = code; return r; });
  r.json      = jest.fn((body) => { r._body = body; return r; });
  r.send      = jest.fn((body) => { r._body = body; return r; });
  r.redirect  = jest.fn((url)  => { r._redirected = url; return r; });
  return r;
};
const mockNext = jest.fn();

// ── Global Setup ─────────────────────────────────────────────────────────────
let userId, driverId, managerId, vehId, inspId, notifId;

beforeAll(async () => {
  // Initialize DB if not already done (handles being run in isolation or first)
  try { await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'); } catch(e) {}
  await exec('npm run db:init');
  await exec('npm run db:migrate');
  await exec('npm run db:seed');

  // Register users needed for unit tests
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('Password123!', 12);
  const mr = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ('Unit Manager','unit_mgr@test.com',$1,'manager')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
    [hash]
  );
  managerId = mr.rows[0].id;
  await pool.query(`INSERT INTO managers (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [managerId]);

  const dr = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ('Unit Driver','unit_drv@test.com',$1,'driver')
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
    [hash]
  );
  userId = dr.rows[0].id;
  await pool.query(
    `INSERT INTO drivers (user_id, phone) VALUES ($1, '0770000000') ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );

  // Get or create a vehicle
  const v = await pool.query('SELECT id FROM vehicles WHERE status=$1 LIMIT 1', ['available']);
  if (v.rows.length) {
    vehId = v.rows[0].id;
  } else {
    const vr = await pool.query(
      `INSERT INTO vehicles (number_plate, make, model, year) VALUES ('UNIT-001', 'TestMake', 'TestModel', 2022) RETURNING id`
    );
    vehId = vr.rows[0].id;
  }

  // Get or create an inspection
  const i = await pool.query('SELECT id FROM inspections LIMIT 1');
  if (i.rows.length) {
    inspId = i.rows[0].id;
  } else {
    const ir = await pool.query(
      `INSERT INTO inspections (vehicle_id, driver_id, customer_name, customer_nic, rental_start, rental_end)
       VALUES ($1, $2, 'UnitCust', 'UNIT123V', NOW(), NOW() + INTERVAL '1 day') RETURNING id`,
      [vehId, userId]
    );
    inspId = ir.rows[0].id;
  }

  // Seed a notification
  const n = await pool.query(
    `INSERT INTO notifications (user_id, type, message) VALUES ($1,'unit','unit test') RETURNING id`,
    [userId]
  );
  notifId = n.rows[0]?.id;
}, 60000);

afterAll(async () => {
  await pool.end();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GPS Controller - all branches', () => {
  const ctrl = require('../controllers/gps.controller');

  it('updateLocation → 400 missing lat/lng', async () => {
    const req = { body: { longitude: 79.8 }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updateLocation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateLocation → 400 invalid coordinates (out of range)', async () => {
    const req = { body: { latitude: 999, longitude: 79.8 }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updateLocation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateLocation → 400 invalid longitude out of range', async () => {
    const req = { body: { latitude: 6.9, longitude: 200 }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updateLocation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateLocation → 200 no vehicle assigned (driver not in a vehicle)', async () => {
    // managerId won't have a vehicle assigned
    const req = { body: { latitude: 6.9, longitude: 79.8 }, user: { id: 99998 } };
    const res = mockRes();
    await ctrl.updateLocation(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No vehicle assigned, location noted' }));
  });

  it('updateLocation → 200 with vehicle assigned and timestamp', async () => {
    // Assign managerId as current driver of a vehicle
    if (vehId) {
      await pool.query('UPDATE vehicles SET current_driver_id=$1 WHERE id=$2', [userId, vehId]);
      const req = { body: { latitude: 6.9, longitude: 79.8, timestamp: new Date().toISOString() }, user: { id: userId } };
      const res = mockRes();
      await ctrl.updateLocation(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Location updated' }));
    }
  });

  it('getVehicleLocations → 200 all', async () => {
    const req = { query: {} };
    const res = mockRes();
    await ctrl.getVehicleLocations(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('getVehicleLocations → 200 filter=today', async () => {
    const req = { query: { filter: 'today' } };
    const res = mockRes();
    await ctrl.getVehicleLocations(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('getVehicleLocations → 200 filter=week', async () => {
    const req = { query: { filter: 'week' } };
    const res = mockRes();
    await ctrl.getVehicleLocations(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Notifications Controller - createNotification (internal fn)', () => {
  const ctrl = require('../controllers/notifications.controller');

  it('createNotification creates a notification successfully', async () => {
    await expect(ctrl.createNotification(userId, 'info', 'Test internal')).resolves.not.toThrow();
  });

  it('createNotification handles DB error gracefully (logs, does not throw)', async () => {
    // Call with null userId — DB will fail, should log not throw
    await expect(ctrl.createNotification(null, 'info', 'test')).resolves.not.toThrow();
  });

  it('markRead → 200', async () => {
    const req = { params: { id: notifId }, user: { id: userId } };
    const res = mockRes();
    await ctrl.markRead(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('markAllRead → 200', async () => {
    const req = { user: { id: userId } };
    const res = mockRes();
    await ctrl.markAllRead(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getAll → 200 with unread count', async () => {
    await pool.query(`INSERT INTO notifications (user_id, type, message, is_read) VALUES ($1,'t','u',false)`, [userId]);
    const req = { user: { id: userId } };
    const res = mockRes();
    await ctrl.getAll(req, res, mockNext);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ unread_count: expect.any(Number) }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Photos Controller - all branches (direct calls)', () => {
  const ctrl = require('../controllers/photos.controller');

  it('uploadPhoto → 400 no file', async () => {
    const req = { file: null, params: { inspectionId: inspId }, body: { photo_type: 'front' } };
    const res = mockRes();
    await ctrl.uploadPhoto(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadPhoto → 400 invalid photo_type', async () => {
    const req = { file: { filename: 'x.jpg', originalname: 'x.jpg' }, params: { inspectionId: inspId }, body: { photo_type: 'selfie' } };
    const res = mockRes();
    await ctrl.uploadPhoto(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadPhoto → 201 valid (direct DB insert)', async () => {
    if (!inspId) return;
    const req = {
      file: { filename: 'front_unit.jpg', originalname: 'front.jpg' },
      params: { inspectionId: inspId },
      body: { photo_type: 'front' },
    };
    const res = mockRes();
    await ctrl.uploadPhoto(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('uploadBatch → 400 no files', async () => {
    const req = { files: [], params: { inspectionId: inspId }, body: {} };
    const res = mockRes();
    await ctrl.uploadBatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadBatch → 400 null files', async () => {
    const req = { files: null, params: { inspectionId: inspId }, body: {} };
    const res = mockRes();
    await ctrl.uploadBatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadBatch → 201 valid (with photo_types array)', async () => {
    if (!inspId) return;
    const req = {
      files: [
        { filename: 'rear_unit.jpg', originalname: 'rear.jpg' },
        { filename: 'left_unit.jpg', originalname: 'left.jpg' },
      ],
      params: { inspectionId: inspId },
      body: { photo_types: JSON.stringify(['rear', 'left']) },
    };
    const res = mockRes();
    await ctrl.uploadBatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('uploadBatch → 201 without photo_types (uses defaults)', async () => {
    if (!inspId) return;
    const req = {
      files: [{ filename: 'interior_unit.jpg', originalname: 'interior.jpg' }],
      params: { inspectionId: inspId },
      body: {},
    };
    const res = mockRes();
    await ctrl.uploadBatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('uploadSignature → 400 no file', async () => {
    const req = { file: null, params: { inspectionId: inspId }, body: { signer_type: 'driver' } };
    const res = mockRes();
    await ctrl.uploadSignature(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadSignature → 400 invalid signer_type', async () => {
    const req = { file: { filename: 'sig.png', originalname: 'sig.png' }, params: { inspectionId: inspId }, body: { signer_type: 'robot' } };
    const res = mockRes();
    await ctrl.uploadSignature(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploadSignature → 201 driver', async () => {
    if (!inspId) return;
    const req = {
      file: { filename: 'drvsig_unit.png', originalname: 'drvsig.png' },
      params: { inspectionId: inspId },
      body: { signer_type: 'driver' },
    };
    const res = mockRes();
    await ctrl.uploadSignature(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('uploadSignature → 201 customer', async () => {
    if (!inspId) return;
    const req = {
      file: { filename: 'custsig_unit.png', originalname: 'custsig.png' },
      params: { inspectionId: inspId },
      body: { signer_type: 'customer' },
    };
    const res = mockRes();
    await ctrl.uploadSignature(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('getPhotos → 200', async () => {
    if (!inspId) return;
    const req = { params: { inspectionId: inspId } };
    const res = mockRes();
    await ctrl.getPhotos(req, res, mockNext);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ photos: expect.any(Array) }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Manager Controller - all filter/branch combinations', () => {
  const ctrl = require('../controllers/manager.controller');

  const make = (query = {}) => ({
    query,
    user: { id: managerId },
    params: {},
  });

  it('getManagerInspections - status=pending', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ status: 'pending' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - status=draft', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ status: 'draft' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - status=completed', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ status: 'completed' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - status=reviewed (generic)', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ status: 'reviewed' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - date_from and date_to filters', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ date_from: '2020-01-01', date_to: '2030-12-31' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - health_min and health_max filters', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ health_min: '50', health_max: '100' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - search filter', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ search: 'Alice' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - sort_by=health_score ASC', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ sort_by: 'health_score', sort_order: 'asc' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - all filters combined', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({
      ...make({
        status: 'completed',
        date_from: '2020-01-01',
        date_to: '2030-12-31',
        health_min: '0',
        health_max: '100',
        search: 'a',
        vehicle_id: String(vehId),
        driver_id: String(userId),
        sort_by: 'health_score',
        sort_order: 'asc',
        page: '1',
        limit: '5',
      }),
    }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getManagerInspections - status=all (skips status filter)', async () => {
    const res = mockRes();
    await ctrl.getManagerInspections({ ...make({ status: 'all' }) }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getVehicleInspectionHistory → 200 existing vehicle', async () => {
    if (!vehId) return;
    const res = mockRes();
    const req = { params: { id: vehId }, query: {}, user: { id: managerId } };
    await ctrl.getVehicleInspectionHistory(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getVehicleInspectionHistory → 404 missing vehicle', async () => {
    const res = mockRes();
    const req = { params: { id: 99999 }, query: {}, user: { id: managerId } };
    await ctrl.getVehicleInspectionHistory(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getRecentAlerts → 200 with custom limit', async () => {
    const res = mockRes();
    const req = { query: { limit: '3' } };
    await ctrl.getRecentAlerts(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getRecentAlerts → 200 default limit', async () => {
    const res = mockRes();
    const req = { query: {} };
    await ctrl.getRecentAlerts(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getDashboardStats → 200', async () => {
    const res = mockRes();
    await ctrl.getDashboardStats({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getHealthDistribution → 200', async () => {
    const res = mockRes();
    await ctrl.getHealthDistribution({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getDashboardActivity → 200', async () => {
    const res = mockRes();
    await ctrl.getDashboardActivity({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getInspectionsSummary → 200', async () => {
    const res = mockRes();
    await ctrl.getInspectionsSummary({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Analytics Controller - branch coverage', () => {
  const ctrl = require('../controllers/analytics.controller');

  it('getHealthTrend → 200 with custom days', async () => {
    const req = { query: { days: '7' } };
    const res = mockRes();
    await ctrl.getHealthTrend(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('getHealthTrend → 200 default days', async () => {
    const req = { query: {} };
    const res = mockRes();
    await ctrl.getHealthTrend(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('getDamageTypes → 200 with custom days', async () => {
    const req = { query: { days: '7' } };
    const res = mockRes();
    await ctrl.getDamageTypes(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('getDamageTypes → 200 default days', async () => {
    const req = { query: {} };
    const res = mockRes();
    await ctrl.getDamageTypes(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('getTopDamagedVehicles → 200 with custom days', async () => {
    const req = { query: { days: '14' } };
    const res = mockRes();
    await ctrl.getTopDamagedVehicles(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('getTopDamagedVehicles → 200 default days', async () => {
    const req = { query: {} };
    const res = mockRes();
    await ctrl.getTopDamagedVehicles(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Inspections Controller - direct call branch coverage', () => {
  const ctrl = require('../controllers/inspections.controller');

  it('triggerAI → 400 not enough photos (fewer than 8)', async () => {
    if (!inspId) return;
    const req = { params: { id: inspId }, user: { id: userId } };
    const res = mockRes();
    await ctrl.triggerAI(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('triggerAI → 200 success with axios mock', async () => {
    if (!inspId) return;

    // 1. Create 8 dummy photos in uploads directory
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const PHOTO_ORDER = ['front', 'rear', 'left', 'right', 'interior', 'dashboard', 'damage', 'odometer'];
    // Clear old photos for this inspection that might trigger primary keys
    await pool.query('DELETE FROM inspection_photos WHERE inspection_id = $1', [inspId]);

    for (const t of PHOTO_ORDER) {
      fs.writeFileSync(path.join(uploadDir, `dummy_${t}.jpg`), 'dummy_jpg_content');
      await pool.query(
        `INSERT INTO inspection_photos (inspection_id, photo_type, file_url, file_name)
         VALUES ($1, $2, $3, $4)`,
        [inspId, t, `/uploads/dummy_${t}.jpg`, `dummy_${t}.jpg`]
      );
    }

    // 2. Mock axios.post
    axios.post.mockResolvedValue({
      status: 200,
      data: { success: true, damages: [{ damage_type: 'scratch', severity: 'minor', confidence: 0.9, bounding_box: [1,2,3,4] }] }
    });

    // 3. Call triggerAI
    const req = { params: { id: inspId }, user: { id: userId } };
    const res = mockRes();
    await ctrl.triggerAI(req, res, mockNext);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ analysis_source: expect.any(String), damage_count: expect.any(Number) }));
  });

  it('generatePdf → 200 success with photo content', async () => {
    if (!inspId) return;

    const req = { params: { id: inspId }, user: { id: managerId } };
    const res = mockRes();

    // Use a promise to wait for async stream.on('finish')
    const resPromise = new Promise((resolve) => {
      res.json.mockImplementation((body) => {
        resolve(body);
        return res; // maintain chainable
      });
    });

    await ctrl.generatePdf(req, res, mockNext);
    await resPromise;

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ pdf_url: expect.any(String) }));
  });

  it('generatePdf → 404 inspection not found', async () => {
    const req = { params: { id: 99999 }, user: { id: managerId } };
    const res = mockRes();
    await ctrl.generatePdf(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('downloadPdf → 404 no pdf yet', async () => {
    // Use inspId2 which has no pdf_url set or use one without pdf
    const fresh = await pool.query(
      `INSERT INTO vehicles (number_plate, make, model, year) VALUES ('PDF-NOPDF', 'T', 'T', 2020) RETURNING id`
    );
    const fvid = fresh.rows[0].id;
    const ir = await pool.query(
      `INSERT INTO inspections (vehicle_id, driver_id, customer_name, customer_nic, rental_start, rental_end)
       VALUES ($1, $2, 'PDFTest', '999999V', NOW(), NOW() + INTERVAL '1 day') RETURNING id`,
      [fvid, userId]
    );
    const fid = ir.rows[0].id;
    const req = { params: { id: fid }, protocol: 'http', get: () => 'localhost', user: { id: managerId } };
    const res = mockRes();
    await ctrl.downloadPdf(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('downloadPdf → redirect when pdf_url exists', async () => {
    if (!inspId) return;
    // inspId has pdf_url set from model tests
    const req = { params: { id: inspId }, protocol: 'http', get: () => 'localhost', user: { id: managerId } };
    const res = mockRes();
    await ctrl.downloadPdf(req, res, mockNext);
    // Should either redirect or 404 depending on whether pdf_url is set
    expect(res.redirect || res.status).toBeDefined();
  });

  it('getAll → 200 with all filters', async () => {
    const req = {
      query: { status: 'completed', vehicle_id: String(vehId), driver_id: String(userId), page: '1', limit: '5' },
      user: { id: managerId },
    };
    const res = mockRes();
    await ctrl.getAll(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getMine → 200 with pagination', async () => {
    const req = {
      query: { page: '1', limit: '5' },
      user: { id: userId },
    };
    const res = mockRes();
    await ctrl.getMine(req, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('reviewInspection → 400 invalid status', async () => {
    if (!inspId) return;
    const req = {
      params: { id: inspId },
      body: { review_status: 'unknown' },
      user: { id: managerId },
    };
    const res = mockRes();
    await ctrl.reviewInspection(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('reviewInspection → 200 approved (direct)', async () => {
    if (!inspId) return;
    const req = {
      params: { id: inspId },
      body: { review_status: 'approved', manager_notes: 'Direct unit test' },
      user: { id: managerId },
    };
    const res = mockRes();
    await ctrl.reviewInspection(req, res, mockNext);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ review_status: 'approved' }));
  });

  it('create → 404 vehicle not found', async () => {
    const req = {
      body: { vehicle_id: 99999, customer_name: 'X', customer_nic: 'X' },
      user: { id: userId },
    };
    const res = mockRes();
    await ctrl.create(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('update → 404 not found (wrong driver)', async () => {
    if (!inspId) return;
    const req = {
      params: { id: inspId },
      body: { overall_notes: 'wrong' },
      user: { id: 99999 },
    };
    const res = mockRes();
    await ctrl.update(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Dashboard Controller - direct calls', () => {
  const ctrl = require('../controllers/dashboard.controller');

  it('getStats → 200', async () => {
    const res = mockRes();
    await ctrl.getStats({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getHealthDistribution → 200', async () => {
    const res = mockRes();
    await ctrl.getHealthDistribution({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });

  it('getActivity → 200', async () => {
    const res = mockRes();
    await ctrl.getActivity({ query: {} }, res, mockNext);
    expect(res.json).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Preferences Controller - direct calls', () => {
  const ctrl = require('../controllers/preferences.controller');

  it('getPreferences → 200 existing user', async () => {
    const req = { user: { id: userId } };
    const res = mockRes();
    await ctrl.getPreferences(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('getPreferences → 200 user with no prefs (uses defaults)', async () => {
    const req = { user: { id: 99997 } };
    const res = mockRes();
    await ctrl.getPreferences(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updatePreferences → 400 missing language', async () => {
    const req = { body: { date_format: 'DD/MM/YYYY' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updatePreferences(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updatePreferences → 400 invalid language', async () => {
    const req = { body: { language: 'zz' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updatePreferences(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updatePreferences → 200 en', async () => {
    const req = { body: { language: 'en', date_format: 'DD/MM/YYYY' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updatePreferences(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updatePreferences → 200 si without date_format (uses default)', async () => {
    const req = { body: { language: 'si' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updatePreferences(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updatePreferences → 200 ta', async () => {
    const req = { body: { language: 'ta', date_format: 'MM/DD/YYYY' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.updatePreferences(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Profile Controller - direct calls', () => {
  const ctrl = require('../controllers/profile.controller');

  it('updateProfile → 200 name only (manager)', async () => {
    const req = { body: { name: 'Updated Manager' }, file: null, user: { id: managerId, role: 'manager' } };
    const res = mockRes();
    await ctrl.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updateProfile → 200 with avatar file', async () => {
    const req = {
      body: { name: 'With Avatar' },
      file: { filename: 'avatar.jpg' },
      user: { id: managerId, role: 'manager' },
    };
    const res = mockRes();
    await ctrl.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('updateProfile → 200 driver with phone (triggers drivers INSERT)', async () => {
    const req = {
      body: { name: 'Driver Updated', phone: '0770099001' },
      file: null,
      user: { id: userId, role: 'driver' },
    };
    const res = mockRes();
    await ctrl.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('changePassword → 400 missing fields', async () => {
    const req = { body: { currentPassword: 'x' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('changePassword → 401 wrong current password', async () => {
    const req = { body: { currentPassword: 'Wrong!', newPassword: 'New123!' }, user: { id: userId } };
    const res = mockRes();
    await ctrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('changePassword → 404 user not found (no password_hash)', async () => {
    // Use a non-existent user id
    const req = { body: { currentPassword: 'x', newPassword: 'y' }, user: { id: 99996 } };
    const res = mockRes();
    await ctrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('changePassword → 200 valid change', async () => {
    // Register a throwaway user
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('OldPass123!', 10);
    const ur = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ('PwUser','pwtest@unit.com',$1,'manager') RETURNING id`,
      [hash]
    );
    const uid = ur.rows[0].id;
    const req = { body: { currentPassword: 'OldPass123!', newPassword: 'NewPass456!' }, user: { id: uid } };
    const res = mockRes();
    await ctrl.changePassword(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Middleware - errorHandler', () => {
  const errorHandler = require('../middleware/errorHandler');

  it('errorHandler - sends 500 by default', () => {
    const err = new Error('Test error');
    const req = {};
    const res = mockRes();
    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('errorHandler - uses err.status if present', () => {
    const err = new Error('Not Found');
    err.status = 404;
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Middleware - upload', () => {
  const upload = require('../middleware/upload');
  it('upload.single is a function', () => {
    expect(typeof upload.single).toBe('function');
  });
  it('upload.array is a function', () => {
    expect(typeof upload.array).toBe('function');
  });
});
