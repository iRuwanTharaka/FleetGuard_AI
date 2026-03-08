const pool = require('../config/database');

exports.getStats = async (req, res, next) => {
  try {
    const [vehicles, inspToday, recentDamages] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)                                                  AS total,
          COUNT(*) FILTER (WHERE status = 'available')             AS available,
          COUNT(*) FILTER (WHERE status = 'in-use')                AS in_use,
          COUNT(*) FILTER (WHERE status = 'maintenance')           AS maintenance,
          ROUND(AVG(health_score))::INT                             AS avg_health
        FROM vehicles
      `),
      pool.query(`
        SELECT COUNT(*) AS count
        FROM inspections
        WHERE DATE(created_at) = CURRENT_DATE
      `),
      pool.query(`
        SELECT dd.damage_type, dd.severity, dd.confidence,
               v.number_plate, i.created_at
        FROM damage_detections dd
        JOIN inspections i ON i.id = dd.inspection_id
        JOIN vehicles v    ON v.id = i.vehicle_id
        ORDER BY dd.created_at DESC
        LIMIT 5
      `),
    ]);

    res.json({
      fleet:          vehicles.rows[0],
      today_count:    parseInt(inspToday.rows[0].count, 10),
      recent_damages: recentDamages.rows,
    });
  } catch (err) { next(err); }
};

exports.getHealthDistribution = async (req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE health_score >= 80) AS good,
        COUNT(*) FILTER (WHERE health_score BETWEEN 60 AND 79) AS fair,
        COUNT(*) FILTER (WHERE health_score < 60) AS poor
      FROM vehicles
    `);
    res.json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.getActivity = async (req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM inspections
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({ activity: r.rows });
  } catch (err) { next(err); }
};
