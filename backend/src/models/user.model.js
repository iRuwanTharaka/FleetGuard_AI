const { db } = require('./index');

async function findByEmail(email) {
  const r = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  return r.rows[0] || null;
}

async function existsByEmail(email) {
  const r = await db.query('SELECT id FROM users WHERE email=$1', [email]);
  return !!r.rows[0];
}

async function createUser({ name, email, passwordHash, role }) {
  const r = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, email, passwordHash, role],
  );
  return r.rows[0];
}

async function updateProfile(id, { name, avatarUrl }) {
  const updates = ['updated_at = NOW()'];
  const params = [id];
  let idx = 2;

  if (name !== undefined) {
    updates.push(`name = $${idx}`);
    params.push(name);
    idx += 1;
  }
  if (avatarUrl !== undefined) {
    updates.push(`avatar_url = $${idx}`);
    params.push(avatarUrl);
    idx += 1;
  }

  const q = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
  const r = await db.query(q, params);
  return r.rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [passwordHash, id],
  );
}

async function softDelete(id) {
  await db.query('UPDATE users SET is_active=false, updated_at=NOW() WHERE id=$1', [id]);
}

async function findMeWithDriver(id) {
  const r = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
            d.phone, d.license_number
     FROM users u LEFT JOIN drivers d ON d.user_id=u.id
     WHERE u.id=$1`,
    [id],
  );
  return r.rows[0] || null;
}

module.exports = {
  findByEmail,
  existsByEmail,
  createUser,
  updateProfile,
  updatePassword,
  softDelete,
  findMeWithDriver,
};

