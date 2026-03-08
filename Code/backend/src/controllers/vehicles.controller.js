const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { status, search, page=1, limit=20 } = req.query;
    let q = 'SELECT * FROM vehicles WHERE 1=1';
    const p = [];
    if (status) { p.push(status);         q += ` AND status=$${p.length}`; }
    if (search) { p.push(`%${search}%`);  q += ` AND (number_plate ILIKE $${p.length} OR make ILIKE $${p.length})`; }
    p.push(limit, (page-1)*limit);
    q += ` ORDER BY number_plate LIMIT $${p.length-1} OFFSET $${p.length}`;
    const result = await pool.query(q, p);
    res.json({ vehicles: result.rows, page: +page });
  } catch (err) { next(err); }
};

exports.getAvailable = async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT id, number_plate, make, model, year, color, health_score, photo_url
       FROM vehicles WHERE status='available' ORDER BY health_score DESC`
    );
    res.json({ vehicles: r.rows });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM vehicles WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { number_plate, make, model, year, color, vehicle_type } = req.body;
    const r = await pool.query(
      `INSERT INTO vehicles (number_plate, make, model, year, color, vehicle_type)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [number_plate.toUpperCase(), make, model, year, color, vehicle_type||'car']
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { make, model, year, color, notes } = req.body;
    const r = await pool.query(
      `UPDATE vehicles SET make=$1,model=$2,year=$3,color=$4,notes=$5,updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [make, model, year, color, notes, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available','in-use','maintenance'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    const r = await pool.query(
      'UPDATE vehicles SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { next(err); }
};
