/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-02-20
 */

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// PUT /api/user/profile   body: { name, phone }  (multipart if avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body || {};
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updates = ['updated_at = NOW()'];
    const params = [req.user.id];
    let idx = 2;

    if (name !== undefined) {
      updates.push(`name = $${idx}`);
      params.push(name);
      idx++;
    }
    if (avatarUrl) {
      updates.push(`avatar_url = $${idx}`);
      params.push(avatarUrl);
      idx++;
    }

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $1`,
      params
    );

    if (phone !== undefined && req.user.role === 'driver') {
      await pool.query(
        `INSERT INTO drivers (user_id, phone) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET phone = $2`,
        [req.user.id, phone]
      );
    }

    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, d.phone
       FROM users u
       LEFT JOIN drivers d ON d.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/user/change-password   body: { currentPassword, newPassword }
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    const { rows } = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0] || !rows[0].password_hash) {
      return res.status(404).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hash, req.user.id]
    );
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
