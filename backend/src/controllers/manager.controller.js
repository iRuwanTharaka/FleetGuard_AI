/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-02-15
 */

const pool = require('../config/database');

function getTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function mapSeverity(s) {
  if (!s) return 'minor';
  const m = { high: 'major', medium: 'moderate', low: 'minor' };
  return m[s.toLowerCase()] || s;
}

exports.getDashboardStats = async (req, res, next) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) AS total_vehicles,
        COALESCE(SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END), 0)::INT AS available,
        COALESCE(SUM(CASE WHEN status = 'in-use' THEN 1 ELSE 0 END), 0)::INT AS in_use,
        COALESCE(SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END), 0)::INT AS maintenance,
        ROUND(AVG(health_score)::NUMERIC, 1) AS avg_health_score
      FROM vehicles
    `;
    const statsResult = await pool.query(statsQuery);
    const row = statsResult.rows[0] || {};

    const todayInspections = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections WHERE DATE(created_at) = CURRENT_DATE`
    );
    const todayDamages = await pool.query(`
      SELECT COUNT(*) AS c FROM damage_detections dd
      JOIN inspections i ON dd.inspection_id = i.id
      WHERE DATE(i.created_at) = CURRENT_DATE
    `);
    const pendingReviews = await pool.query(`
      SELECT COUNT(*) AS c FROM inspections
      WHERE status = 'completed'
      AND (review_status IS NULL OR review_status = 'pending')
    `).catch(() => ({ rows: [{ c: '0' }] }));

    const driverCount = await pool.query(
      `SELECT COUNT(*) AS c FROM drivers d JOIN users u ON u.id = d.user_id WHERE u.is_active = true`
    ).catch(() => ({ rows: [{ c: '0' }] }));

    const monthInspections = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`
    ).catch(() => ({ rows: [{ c: '0' }] }));

    res.json({
      total_vehicles: parseInt(row.total_vehicles) || 0,
      available: parseInt(row.available) || 0,
      in_use: parseInt(row.in_use) || 0,
      maintenance: parseInt(row.maintenance) || 0,
      avg_health_score: parseFloat(row.avg_health_score) || 0,
      today_inspections: parseInt(todayInspections.rows[0]?.c) || 0,
      today_new_damages: parseInt(todayDamages.rows[0]?.c) || 0,
      pending_reviews: parseInt(pendingReviews.rows[0]?.c) || 0,
      driver_count: parseInt(driverCount.rows[0]?.c) || 0,
      month_inspections: parseInt(monthInspections.rows[0]?.c) || 0,
    });
  } catch (err) { next(err); }
};

exports.getHealthDistribution = async (req, res, next) => {
  try {
    const query = `
      SELECT
        COALESCE(SUM(CASE WHEN health_score >= 80 THEN 1 ELSE 0 END), 0)::INT AS excellent,
        COALESCE(SUM(CASE WHEN health_score >= 60 AND health_score < 80 THEN 1 ELSE 0 END), 0)::INT AS good,
        COALESCE(SUM(CASE WHEN health_score < 60 OR health_score IS NULL THEN 1 ELSE 0 END), 0)::INT AS poor,
        COUNT(*)::INT AS total
      FROM vehicles
    `;
    const result = await pool.query(query);
    const { excellent, good, poor, total } = result.rows[0] || {};
    const t = Math.max(parseInt(total) || 1, 1);
    const ex = parseInt(excellent) || 0;
    const g = parseInt(good) || 0;
    const p = parseInt(poor) || 0;
    res.json({
      excellent: { count: ex, percentage: Math.round(ex / t * 100), label: 'Excellent (80-100)' },
      good: { count: g, percentage: Math.round(g / t * 100), label: 'Good (60-79)' },
      poor: { count: p, percentage: Math.round(p / t * 100), label: 'Poor (<60)' },
      total: t,
    });
  } catch (err) { next(err); }
};

exports.getRecentAlerts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 5, 20);
    const query = `
      SELECT
        i.id AS inspection_id,
        v.id AS vehicle_id,
        v.number_plate AS vehicle_number,
        COALESCE(i.health_score, v.health_score) AS health_score,
        COUNT(dd.id)::INT AS damage_count,
        MAX(dd.severity) AS severity,
        i.created_at
      FROM inspections i
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN damage_detections dd ON dd.inspection_id = i.id
      WHERE i.status = 'completed'
      GROUP BY i.id, v.id, v.number_plate, i.health_score, v.health_score, i.created_at
      HAVING COUNT(dd.id) > 0
      ORDER BY i.created_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    const alerts = result.rows.map(row => ({
      inspection_id: row.inspection_id,
      vehicle_id: row.vehicle_id,
      vehicle_number: row.vehicle_number,
      damage_count: row.damage_count,
      health_score: row.health_score,
      severity: mapSeverity(row.severity),
      created_at: row.created_at,
      time_ago: getTimeAgo(row.created_at),
    }));
    res.json({ alerts });
  } catch (err) { next(err); }
};

exports.getDashboardActivity = async (req, res, next) => {
  try {
    const query = `
      SELECT
        i.id AS inspection_id,
        v.number_plate AS vehicle_number,
        u.name AS driver_name,
        COALESCE(i.health_score, v.health_score) AS health_score,
        i.status,
        i.created_at,
        COUNT(dd.id)::INT AS damage_count
      FROM inspections i
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN users u ON i.driver_id = u.id
      LEFT JOIN damage_detections dd ON dd.inspection_id = i.id
      WHERE DATE(i.created_at) = CURRENT_DATE
      GROUP BY i.id, v.number_plate, v.health_score, u.name, i.health_score, i.status, i.created_at
      ORDER BY i.created_at DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    const activities = result.rows.map(row => {
      const dmgCount = parseInt(row.damage_count) || 0;
      return {
        type: dmgCount > 0 ? 'damage_alert' : 'inspection_completed',
        message: `${row.driver_name} completed inspection for ${row.vehicle_number}`,
        time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        health_score: row.health_score,
        inspection_id: row.inspection_id,
        damage_count: dmgCount,
        vehicle_number: row.vehicle_number,
      };
    });
    res.json({ activities });
  } catch (err) { next(err); }
};

exports.getInspectionsSummary = async (req, res, next) => {
  try {
    const month = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`
    );
    const avgHealth = await pool.query(
      `SELECT ROUND(AVG(COALESCE(i.health_score, v.health_score))::NUMERIC, 0) AS avg_health
       FROM inspections i JOIN vehicles v ON v.id = i.vehicle_id
       WHERE i.status = 'completed' AND i.created_at >= CURRENT_DATE - INTERVAL '30 days'`
    );
    const damageAlerts = await pool.query(
      `SELECT COUNT(*) AS c FROM inspections i
       JOIN damage_detections dd ON dd.inspection_id = i.id
       WHERE i.created_at >= CURRENT_DATE - INTERVAL '30 days'`
    );
    res.json({
      month_count: parseInt(month.rows[0]?.c) || 0,
      avg_health: parseInt(avgHealth.rows[0]?.avg_health) || 0,
      damage_alerts: parseInt(damageAlerts.rows[0]?.c) || 0,
    });
  } catch (err) { next(err); }
};

exports.getManagerInspections = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      vehicle_id,
      driver_id,
      date_from,
      date_to,
      health_min,
      health_max,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = req.query;

    const lim = Math.min(parseInt(limit) || 20, 100);
    const offset = (parseInt(page) - 1) * lim;
    const params = [];
    let idx = 1;
    let where = 'WHERE 1=1';

    if (status && status !== 'all') {
      if (status === 'pending') {
        where += ` AND i.status = 'completed' AND (i.review_status IS NULL OR i.review_status = 'pending')`;
      } else if (status === 'draft') {
        where += ` AND i.status = 'in_progress'`;
      } else if (status === 'completed') {
        where += ` AND i.status = 'completed'`;
      } else {
        where += ` AND i.status = $${idx++}`;
        params.push(status);
      }
    }
    if (vehicle_id) { where += ` AND i.vehicle_id = $${idx++}`; params.push(vehicle_id); }
    if (driver_id) { where += ` AND i.driver_id = $${idx++}`; params.push(driver_id); }
    if (date_from) { where += ` AND i.created_at >= $${idx++}`; params.push(date_from); }
    if (date_to) { where += ` AND i.created_at <= $${idx++}`; params.push(date_to + 'T23:59:59'); }
    if (health_min) { where += ` AND COALESCE(i.health_score, v.health_score) >= $${idx++}`; params.push(health_min); }
    if (health_max) { where += ` AND COALESCE(i.health_score, v.health_score) <= $${idx++}`; params.push(health_max); }
    if (search) {
      where += ` AND (v.number_plate ILIKE $${idx} OR i.customer_name ILIKE $${idx} OR u.name ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    const allowedSort = { created_at: 'i.created_at', health_score: 'COALESCE(i.health_score, v.health_score)' };
    const orderCol = allowedSort[sort_by] || 'i.created_at';
    const orderDir = sort_order === 'asc' ? 'ASC' : 'DESC';

    const countQuery = `
      SELECT COUNT(*) FROM inspections i
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN users u ON i.driver_id = u.id
      ${where}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0]?.count) || 0;

    const dataParams = [...params, lim, offset];
    const dataQuery = `
      SELECT i.id, v.number_plate AS vehicle_number, v.id AS vehicle_id,
             i.customer_name, u.name AS driver_name, u.id AS driver_id,
             COALESCE(i.health_score, v.health_score) AS health_score,
             i.status, COALESCE(i.review_status, 'pending') AS review_status, i.created_at,
             COUNT(dd.id)::INT AS damage_count
      FROM inspections i
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN users u ON i.driver_id = u.id
      LEFT JOIN damage_detections dd ON dd.inspection_id = i.id
      ${where}
      GROUP BY i.id, v.number_plate, v.id, i.customer_name, u.name, u.id,
               i.health_score, v.health_score, i.status, i.review_status, i.created_at
      ORDER BY ${orderCol} ${orderDir}
      LIMIT $${idx++} OFFSET $${idx}
    `;
    const result = await pool.query(dataQuery, dataParams);

    res.json({
      inspections: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: lim,
        total_pages: Math.ceil(total / lim) || 1,
      },
    });
  } catch (err) { next(err); }
};

exports.getVehicleInspectionHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicleResult = await pool.query(
      `SELECT id, number_plate AS vehicle_number, make, model, year, health_score, status, photo_url
       FROM vehicles WHERE id = $1`,
      [id]
    );
    if (!vehicleResult.rows.length) return res.status(404).json({ error: 'Vehicle not found' });

    const historyQuery = `
      SELECT i.id, i.customer_name, u.name AS driver_name,
             COALESCE(i.health_score, v.health_score) AS health_score,
             i.status, COALESCE(i.review_status, 'pending') AS review_status, i.created_at,
             COUNT(dd.id)::INT AS damage_count
      FROM inspections i
      JOIN users u ON i.driver_id = u.id
      JOIN vehicles v ON i.vehicle_id = v.id
      LEFT JOIN damage_detections dd ON dd.inspection_id = i.id
      WHERE i.vehicle_id = $1
      GROUP BY i.id, i.customer_name, u.name, i.health_score, v.health_score, i.status, i.review_status, i.created_at
      ORDER BY i.created_at DESC
      LIMIT 50
    `;
    const historyResult = await pool.query(historyQuery, [id]);

    const trend = historyResult.rows
      .slice(0, 10)
      .reverse()
      .map(r => ({
        date: new Date(r.created_at).toISOString().split('T')[0],
        health_score: r.health_score,
      }));

    res.json({
      vehicle: vehicleResult.rows[0],
      inspections: historyResult.rows,
      health_trend: trend,
    });
  } catch (err) { next(err); }
};
