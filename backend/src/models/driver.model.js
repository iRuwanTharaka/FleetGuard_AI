/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-03-05
 */

const { db } = require('./index');

async function createForUser(userId, { phone = null, license_number = null } = {}) {
  await db.query(
    'INSERT INTO drivers (user_id, phone, license_number) VALUES ($1,$2,$3)',
    [userId, phone, license_number],
  );
}

async function upsertPhone(userId, phone) {
  await db.query(
    `INSERT INTO drivers (user_id, phone) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET phone = $2`,
    [userId, phone],
  );
}

async function updateForUser(userId, { phone, license_number }) {
  const updates = [];
  const params = [];
  let idx = 1;

  if (phone !== undefined) {
    updates.push(`phone=$${idx}`);
    params.push(phone);
    idx += 1;
  }
  if (license_number !== undefined) {
    updates.push(`license_number=$${idx}`);
    params.push(license_number);
    idx += 1;
  }
  if (!updates.length) return;

  params.push(userId);
  await db.query(
    `UPDATE drivers SET ${updates.join(', ')} WHERE user_id=$${idx}`,
    params,
  );
}

async function listAllWithStats() {
  const r = await db.query(
    `SELECT u.id, u.name, u.email, u.avatar_url, d.phone, d.license_number,
            (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id) AS total_inspections,
            (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id AND DATE(created_at) = CURRENT_DATE) AS today_inspections
     FROM users u JOIN drivers d ON d.user_id=u.id
     WHERE u.is_active=true ORDER BY u.name`,
  );
  return r.rows;
}

async function findByIdWithStats(id) {
  const r = await db.query(
    `SELECT u.id, u.name, u.email, u.avatar_url, u.created_at,
            d.phone, d.license_number,
            (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id) AS total_inspections,
            (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days') AS month_inspections
     FROM users u JOIN drivers d ON d.user_id=u.id
     WHERE u.id = $1 AND u.is_active=true`,
    [id],
  );
  return r.rows[0] || null;
}

async function ensureIsDriver(id) {
  const r = await db.query(
    'SELECT u.id FROM users u JOIN drivers d ON d.user_id=u.id WHERE u.id=$1 AND u.role=$2',
    [id, 'driver'],
  );
  return !!r.rows[0];
}

async function findBasicById(id) {
  const r = await db.query(
    `SELECT u.id, u.name, u.email, d.phone, d.license_number
     FROM users u JOIN drivers d ON d.user_id=u.id WHERE u.id=$1`,
    [id],
  );
  return r.rows[0] || null;
}

module.exports = {
  createForUser,
  upsertPhone,
  updateForUser,
  listAllWithStats,
  findByIdWithStats,
  ensureIsDriver,
  findBasicById,
};

