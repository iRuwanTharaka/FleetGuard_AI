const pool = require('../config/database');

// GET /api/user/preferences
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    const prefs = rows[0] || {
      language: 'en',
      date_format: 'DD/MM/YYYY',
    };
    res.json({ success: true, data: prefs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/user/preferences   body: { language, date_format }
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language, date_format } = req.body;
    const allowed = ['en', 'si', 'ta'];
    if (!language || !allowed.includes(language)) {
      return res.status(400).json({ message: 'Invalid language' });
    }
    await pool.query(
      `INSERT INTO user_preferences (user_id, language, date_format)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE
       SET language = EXCLUDED.language, date_format = EXCLUDED.date_format, updated_at = NOW()`,
      [userId, language, date_format || 'DD/MM/YYYY']
    );
    res.json({ success: true, message: 'Preferences updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
