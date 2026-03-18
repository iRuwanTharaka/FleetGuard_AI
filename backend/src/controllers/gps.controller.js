/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-02-24
 */

const pool = require('../config/database');

// ─── DRIVER: Update location (saves to assigned vehicle) ─────────────────
exports.updateLocation = async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;
  const driver_id = req.user.id;

  if (!latitude || !longitude)
    return res.status(400).json({ error: 'latitude and longitude required' });
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
    return res.status(400).json({ error: 'Invalid coordinates' });

  try {
    const vehicleResult = await pool.query(
      'SELECT id FROM vehicles WHERE current_driver_id = $1 LIMIT 1',
      [driver_id]
    );

    if (!vehicleResult.rows.length) {
      return res.json({ message: 'No vehicle assigned, location noted' });
    }

    const vehicle_id = vehicleResult.rows[0].id;
    const ts = timestamp || new Date();

    await pool.query(
      `UPDATE vehicles
       SET last_latitude = $1, last_longitude = $2,
           last_location_update = $3
       WHERE id = $4`,
      [latitude, longitude, ts, vehicle_id]
    );

    res.json({
      message: 'Location updated',
      vehicle_id,
      updated_at: ts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── MANAGER: Get all vehicle locations for map view ───────────────────
exports.getVehicleLocations = async (req, res) => {
  const { filter = 'all' } = req.query;
  try {
    let where =
      'WHERE v.last_latitude IS NOT NULL AND v.last_longitude IS NOT NULL';
    if (filter === 'today')
      where += ' AND DATE(v.last_location_update) = CURRENT_DATE';
    else if (filter === 'week')
      where += " AND v.last_location_update >= NOW() - INTERVAL '7 days'";

    const result = await pool.query(
      `SELECT v.id, v.number_plate AS vehicle_number, v.make, v.model, v.year,
              v.health_score, v.status,
              v.last_latitude, v.last_longitude, v.last_location_update,
              u.name AS driver_name
       FROM vehicles v
       LEFT JOIN users u ON v.current_driver_id = u.id
       ${where}
       ORDER BY v.last_location_update DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
