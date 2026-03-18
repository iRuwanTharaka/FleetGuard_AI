const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const pool     = require('../config/database');
const emailSvc = require('../services/email.service');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
);

// ─── REGISTER ────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role, phone, licenseNumber } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, created_at`,
      [name, email, hash, role]
    );
    const user = result.rows[0];

    if (role === 'driver') {
      await pool.query(
        'INSERT INTO drivers (user_id, phone, license_number) VALUES ($1,$2,$3)',
        [user.id, phone || null, licenseNumber || null]
      );
    } else if (role === 'manager') {
      await pool.query('INSERT INTO managers (user_id) VALUES ($1)', [user.id]);
    }

    res.status(201).json({ token: signToken(user), user });
  } catch (err) { next(err); }
};

// ─── LOGIN ───────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1 AND is_active=true', [email]
    );
    const user = result.rows[0];
    if (!user || !user.password_hash)
      return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password_hash, ...safeUser } = user;
    res.json({ token: signToken(user), user: safeUser });
  } catch (err) { next(err); }
};

// ─── GOOGLE OAUTH ────────────────────────────────────────────
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const ticket  = await googleClient.verifyIdToken({
      idToken, audience: process.env.GOOGLE_CLIENT_ID
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let result = await pool.query(
      'SELECT * FROM users WHERE google_id=$1 OR email=$2', [googleId, email]
    );
    let user = result.rows[0];

    if (!user) {
      const ins = await pool.query(
        `INSERT INTO users (name,email,google_id,avatar_url,role)
         VALUES ($1,$2,$3,$4,'driver') RETURNING *`,
        [name, email, googleId, picture]
      );
      user = ins.rows[0];
      await pool.query('INSERT INTO drivers (user_id) VALUES ($1)', [user.id]);
    } else if (!user.google_id) {
      await pool.query('UPDATE users SET google_id=$1 WHERE id=$2', [googleId, user.id]);
    }

    const { password_hash, ...safeUser } = user;
    res.json({ token: signToken(user), user: safeUser });
  } catch (err) { next(err); }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    // Always return same message — don't reveal whether email exists
    if (!result.rows.length) return res.json({ message: 'If that email exists, a reset link was sent.' });

    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)',
      [result.rows[0].id, tokenHash, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await emailSvc.sendPasswordReset(email, resetUrl);
    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (err) { next(err); }
};

// ─── RESET PASSWORD ──────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token_hash=$1 AND used=false AND expires_at>NOW()',
      [tokenHash]
    );
    if (!result.rows.length) return res.status(400).json({ error: 'Invalid or expired token' });

    const hash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2',
      [hash, result.rows[0].user_id]);
    await pool.query('UPDATE password_reset_tokens SET used=true WHERE id=$1',
      [result.rows[0].id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

// ─── GET ME ──────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
              d.phone, d.license_number
       FROM users u LEFT JOIN drivers d ON d.user_id=u.id
       WHERE u.id=$1`, [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};
