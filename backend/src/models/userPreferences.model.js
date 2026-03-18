const { db } = require('./index');

async function getByUserId(userId) {
  const r = await db.query(
    'SELECT * FROM user_preferences WHERE user_id = $1',
    [userId],
  );
  return r.rows[0] || null;
}

async function upsert(userId, { language, date_format }) {
  await db.query(
    `INSERT INTO user_preferences (user_id, language, date_format)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE
     SET language = EXCLUDED.language, date_format = EXCLUDED.date_format, updated_at = NOW()`,
    [userId, language, date_format || 'DD/MM/YYYY'],
  );
}

module.exports = {
  getByUserId,
  upsert,
};

