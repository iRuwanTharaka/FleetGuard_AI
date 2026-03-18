/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-03-01
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const gpsController = require('../controllers/gps.controller');

router.use(verifyToken, requireRole('driver'));

// GPS — auto-called when driver opens app
router.post('/update-location', gpsController.updateLocation);

// Driver stats for dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const total = await pool.query(
      'SELECT COUNT(*) AS c FROM inspections WHERE driver_id = $1',
      [driverId]
    );
    const month = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections WHERE driver_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'`,
      [driverId]
    );
    const today = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections WHERE driver_id = $1 AND DATE(created_at) = CURRENT_DATE`,
      [driverId]
    );
    const avgHealth = await pool.query(
      `SELECT ROUND(AVG(COALESCE(i.health_score, v.health_score))::NUMERIC, 0) AS avg_health
       FROM inspections i JOIN vehicles v ON v.id = i.vehicle_id
       WHERE i.driver_id = $1 AND i.status = 'completed'`,
      [driverId]
    );
    res.json({
      total_inspections: parseInt(total.rows[0]?.c) || 0,
      month_inspections: parseInt(month.rows[0]?.c) || 0,
      today_inspections: parseInt(today.rows[0]?.c) || 0,
      avg_health_score: parseInt(avgHealth.rows[0]?.avg_health) || 0,
    });
  } catch (err) { next(err); }
});

module.exports = router;
