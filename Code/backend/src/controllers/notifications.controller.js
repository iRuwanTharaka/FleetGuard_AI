const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    const unread = r.rows.filter(n => !n.is_read).length;
    res.json({ notifications: r.rows, unread_count: unread });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) { next(err); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ message: 'All marked as read' });
  } catch (err) { next(err); }
};

exports.createNotification = async (userId, type, message) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [userId, type, message]
    );
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
