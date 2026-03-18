const pool = require('../config/database');

const VALID_TYPES = ['front','rear','left','right','interior','dashboard','odometer','damage'];

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { inspectionId } = req.params;
    const { photo_type }   = req.body;
    if (!VALID_TYPES.includes(photo_type))
      return res.status(400).json({ error: `photo_type must be one of: ${VALID_TYPES.join(', ')}` });

    const r = await pool.query(
      `INSERT INTO inspection_photos (inspection_id, photo_type, file_url, file_name)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [inspectionId, photo_type, `/uploads/${req.file.filename}`, req.file.originalname]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.uploadBatch = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });
    const { inspectionId } = req.params;
    const types = JSON.parse(req.body.photo_types || '[]');
    const inserted = [];
    for (let i=0; i<req.files.length; i++) {
      const photoType = types[i] || VALID_TYPES[i] || 'damage';
      const r = await pool.query(
        `INSERT INTO inspection_photos (inspection_id, photo_type, file_url, file_name)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [inspectionId, photoType, `/uploads/${req.files[i].filename}`, req.files[i].originalname]
      );
      inserted.push(r.rows[0]);
    }
    res.status(201).json({ photos: inserted, count: inserted.length });
  } catch (err) { next(err); }
};

exports.uploadSignature = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { signer_type } = req.body;  // 'driver' or 'customer'
    if (!['driver','customer'].includes(signer_type))
      return res.status(400).json({ error: 'signer_type must be driver or customer' });

    const r = await pool.query(
      `INSERT INTO digital_signatures (inspection_id, signer_type, signature_url)
       VALUES ($1,$2,$3) RETURNING *`,
      [req.params.inspectionId, signer_type, `/uploads/${req.file.filename}`]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
};

exports.getPhotos = async (req, res, next) => {
  try {
    const r = await pool.query(
      'SELECT * FROM inspection_photos WHERE inspection_id=$1 ORDER BY photo_type',
      [req.params.inspectionId]
    );
    res.json({ photos: r.rows });
  } catch (err) { next(err); }
};
