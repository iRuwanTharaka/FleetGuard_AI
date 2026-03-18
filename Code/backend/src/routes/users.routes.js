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

// Manager: list all drivers
router.get('/drivers', requireRole('manager','admin'), async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, d.phone, d.license_number
       FROM users u JOIN drivers d ON d.user_id=u.id
       WHERE u.is_active=true ORDER BY u.name`
    );
    res.json({ drivers: r.rows });
  } catch (err) { next(err); }
});

module.exports = router;
