const { db } = require('./index');

async function listForUser(userId, { limit = 50 } = {}) {
  const r = await db.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return r.rows;
}

async function markRead(id, userId) {
  await db.query(
    'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
}

async function markAllRead(userId) {
  await db.query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1',
    [userId],
  );
}

async function create(userId, type, message) {
  await db.query(
    'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
    [userId, type, message],
  );
}

module.exports = {
  listForUser,
  markRead,
  markAllRead,
  create,
};

