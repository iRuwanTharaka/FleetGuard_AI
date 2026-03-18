/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-02-21
 */

const pool = require('../config/database');

// GET /api/manager/analytics/health-trend?days=30
exports.getHealthTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const { rows } = await pool.query(
      `SELECT DATE(i.created_at) AS day, ROUND(AVG(COALESCE(i.health_score, v.health_score, 100))::NUMERIC, 1) AS avg_health
       FROM inspections i
       JOIN vehicles v ON v.id = i.vehicle_id
       WHERE i.created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY DATE(i.created_at) ORDER BY day`,
      [days]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/manager/analytics/damage-types?days=30
exports.getDamageTypes = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const { rows } = await pool.query(
      `SELECT d.damage_type, COUNT(*)::INT AS total
       FROM damage_detections d
       JOIN inspections i ON i.id = d.inspection_id
       WHERE i.created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY d.damage_type ORDER BY total DESC`,
      [days]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/manager/analytics/top-damaged?days=30
exports.getTopDamagedVehicles = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const { rows } = await pool.query(
      `SELECT v.id, v.number_plate AS registration_number, v.make, v.model,
              COUNT(d.id)::INT AS total_damages,
              ROUND(AVG(COALESCE(i.health_score, v.health_score, 100))::NUMERIC, 0) AS avg_health,
              MAX(i.created_at) AS last_inspection
       FROM vehicles v
       JOIN inspections i ON i.vehicle_id = v.id
       JOIN damage_detections d ON d.inspection_id = i.id
       WHERE i.created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY v.id, v.number_plate, v.make, v.model
       ORDER BY total_damages DESC LIMIT 5`,
      [days]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
