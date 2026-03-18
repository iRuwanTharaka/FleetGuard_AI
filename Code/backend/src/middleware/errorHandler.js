const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.code === '23505') return res.status(409).json({ error: 'Already exists', detail: err.detail });
  if (err.code === '23503') return res.status(400).json({ error: 'Referenced record not found' });

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};

module.exports = errorHandler;
