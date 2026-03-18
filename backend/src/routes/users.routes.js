/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-03-08
 */

const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const pool = require('../config/database');

router.use(verifyToken);

// Update own profile
router.put('/me', async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    await pool.query(
      'UPDATE users SET name=$1, updated_at=NOW() WHERE id=$2',[name, req.user.id]
    );
    if (req.user.role === 'driver' && phone !== undefined) {
      await pool.query('UPDATE drivers SET phone=$1 WHERE user_id=$2',[phone, req.user.id]);
    }
    res.json({ message: 'Profile updated' });
  } catch (err) { next(err); }
});

// Manager: create new driver (does not log in as the new user)
router.post('/drivers', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const { name, email, password, phone, license_number } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Name, email, and password (min 8 chars) required' });
    }
    const bcrypt = require('bcryptjs');
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email.trim().toLowerCase()]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'driver') RETURNING id, name, email, role`,
      [name.trim(), email.trim().toLowerCase(), hash]
    );
    const user = userResult.rows[0];
    await pool.query(
      'INSERT INTO drivers (user_id, phone, license_number) VALUES ($1,$2,$3)',
      [user.id, phone || null, license_number || null]
    );
    res.status(201).json({ message: 'Driver created', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

// Manager: list all drivers
router.get('/drivers', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, d.phone, d.license_number,
              (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id) AS total_inspections,
              (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id AND DATE(created_at) = CURRENT_DATE) AS today_inspections
       FROM users u JOIN drivers d ON d.user_id=u.id
       WHERE u.is_active=true ORDER BY u.name`
    );
    res.json({ drivers: r.rows });
  } catch (err) { next(err); }
});

// Manager: get single driver by id
router.get('/drivers/:id', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.created_at,
              d.phone, d.license_number,
              (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id) AS total_inspections,
              (SELECT COUNT(*) FROM inspections WHERE driver_id = u.id AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days') AS month_inspections
       FROM users u JOIN drivers d ON d.user_id=u.id
       WHERE u.id = $1 AND u.is_active=true`,
      [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Driver not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Manager: update driver (name, phone, license_number)
router.put('/drivers/:id', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, license_number } = req.body;

    const check = await pool.query(
      'SELECT u.id FROM users u JOIN drivers d ON d.user_id=u.id WHERE u.id=$1 AND u.role=$2',
      [id, 'driver']
    );
    if (!check.rows.length) return res.status(404).json({ error: 'Driver not found' });

    if (name !== undefined) {
      await pool.query('UPDATE users SET name=$1, updated_at=NOW() WHERE id=$2', [name, id]);
    }
    if (phone !== undefined || license_number !== undefined) {
      const updates = [];
      const params = [];
      let idx = 1;
      if (phone !== undefined) { updates.push(`phone=$${idx}`); params.push(phone); idx++; }
      if (license_number !== undefined) { updates.push(`license_number=$${idx}`); params.push(license_number); idx++; }
      params.push(id);
      await pool.query(
        `UPDATE drivers SET ${updates.join(', ')} WHERE user_id=$${idx}`,
        params
      );
    }

    const r = await pool.query(
      `SELECT u.id, u.name, u.email, d.phone, d.license_number
       FROM users u JOIN drivers d ON d.user_id=u.id WHERE u.id=$1`,
      [id]
    );
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Manager: remove driver (soft delete - set is_active=false)
router.delete('/drivers/:id', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await pool.query(
      'SELECT u.id FROM users u JOIN drivers d ON d.user_id=u.id WHERE u.id=$1 AND u.role=$2',
      [id, 'driver']
    );
    if (!check.rows.length) return res.status(404).json({ error: 'Driver not found' });
    await pool.query('UPDATE users SET is_active=false, updated_at=NOW() WHERE id=$1', [id]);
    res.json({ message: 'Driver removed' });
  } catch (err) { next(err); }
});

module.exports = router;
