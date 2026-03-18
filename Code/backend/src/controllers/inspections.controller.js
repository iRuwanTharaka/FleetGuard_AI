const pool = require('../config/database');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// ─── CREATE ──────────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const { vehicle_id, customer_name, customer_nic,
            customer_phone, rental_start, rental_end, inspection_type } = req.body;

    const veh = await pool.query("SELECT status FROM vehicles WHERE id=$1", [vehicle_id]);
    if (!veh.rows.length)                return res.status(404).json({ error: 'Vehicle not found' });
    if (veh.rows[0].status !== 'available')
      return res.status(409).json({ error: 'Vehicle is not available' });

    const r = await pool.query(
      `INSERT INTO inspections
         (vehicle_id,driver_id,customer_name,customer_nic,customer_phone,
          rental_start,rental_end,inspection_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [vehicle_id, req.user.id, customer_name, customer_nic,
       customer_phone, rental_start, rental_end, inspection_type||'pre']
    );
    // Mark vehicle in-use
    await pool.query(
      "UPDATE vehicles SET status='in-use', current_driver_id=$1, updated_at=NOW() WHERE id=$2",
      [req.user.id, vehicle_id]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
};

// ─── GET ALL (manager) ───────────────────────────────────────
exports.getAll = async (req, res, next) => {
  try {
    const { status, vehicle_id, driver_id, page=1, limit=20 } = req.query;
    let q = `SELECT i.*, v.number_plate, v.make, v.model, u.name as driver_name
             FROM inspections i
             JOIN vehicles v ON v.id=i.vehicle_id
             JOIN users u    ON u.id=i.driver_id WHERE 1=1`;
    const p = [];
    if (status)    { p.push(status);    q += ` AND i.status=$${p.length}`; }
    if (vehicle_id){ p.push(vehicle_id);q += ` AND i.vehicle_id=$${p.length}`; }
    if (driver_id) { p.push(driver_id); q += ` AND i.driver_id=$${p.length}`; }
    p.push(limit, (page-1)*limit);
    q += ` ORDER BY i.created_at DESC LIMIT $${p.length-1} OFFSET $${p.length}`;
    const r = await pool.query(q, p);
    res.json({ inspections: r.rows, page: +page });
  } catch (err) { next(err); }
};

// ─── GET MINE (driver) ───────────────────────────────────────
exports.getMine = async (req, res, next) => {
  try {
    const { page=1, limit=10 } = req.query;
    const r = await pool.query(
      `SELECT i.*, v.number_plate, v.make, v.model, v.health_score
       FROM inspections i JOIN vehicles v ON v.id=i.vehicle_id
       WHERE i.driver_id=$1 ORDER BY i.created_at DESC LIMIT $2 OFFSET $3`,
      [req.user.id, limit, (page-1)*limit]
    );
    res.json({ inspections: r.rows, page: +page });
  } catch (err) { next(err); }
};

// ─── GET ONE (full detail) ───────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const insp = await pool.query(
      `SELECT i.*, v.number_plate, v.make, v.model, u.name as driver_name
       FROM inspections i
       JOIN vehicles v ON v.id=i.vehicle_id
       JOIN users u    ON u.id=i.driver_id
       WHERE i.id=$1`, [id]
    );
    if (!insp.rows.length) return res.status(404).json({ error: 'Inspection not found' });

    const [photos, damages, sigs] = await Promise.all([
      pool.query('SELECT * FROM inspection_photos WHERE inspection_id=$1 ORDER BY photo_type',[id]),
      pool.query('SELECT * FROM damage_detections WHERE inspection_id=$1',[id]),
      pool.query('SELECT * FROM digital_signatures WHERE inspection_id=$1',[id]),
    ]);

    res.json({ ...insp.rows[0],
      photos:     photos.rows,
      damages:    damages.rows,
      signatures: sigs.rows
    });
  } catch (err) { next(err); }
};

// ─── UPDATE NOTES ─────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const { overall_notes } = req.body;
    const r = await pool.query(
      'UPDATE inspections SET overall_notes=$1,updated_at=NOW() WHERE id=$2 AND driver_id=$3 RETURNING *',
      [overall_notes, req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Inspection not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
};

// ─── COMPLETE ─────────────────────────────────────────────────
exports.complete = async (req, res, next) => {
  try {
    await pool.query(
      "UPDATE inspections SET status='completed',updated_at=NOW() WHERE id=$1 AND driver_id=$2",
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Inspection completed' });
  } catch (err) { next(err); }
};

// ─── TRIGGER AI (stubbed — real YOLOv8 plugs in here later) ────────────
exports.triggerAI = async (req, res, next) => {
  try {
    const { id } = req.params;

    const photosResult = await pool.query(
      'SELECT * FROM inspection_photos WHERE inspection_id = $1',
      [id]
    );
    if (photosResult.rows.length < 8) {
      return res.status(400).json({ error: 'All 8 photos must be uploaded before analysis' });
    }

    // STUB: generate realistic mock damage data (replace when Python AI service is ready)
    const mockDamages = [
      { type: 'scratch', severity: 'low',    confidence: 87.3, location: 'Front bumper',  photo_type: 'front' },
      { type: 'dent',    severity: 'medium',  confidence: 91.5, location: 'Rear left door', photo_type: 'rear' },
    ];

    const deductions = { low: 5, medium: 15, high: 30 };
    let healthScore = 100;
    for (const d of mockDamages) {
      healthScore -= deductions[d.severity] || 5;
    }
    healthScore = Math.max(healthScore, 0);

    for (const dmg of mockDamages) {
      await pool.query(
        `INSERT INTO damage_detections
           (inspection_id, damage_type, severity, confidence, bbox_json)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, dmg.type, dmg.severity, dmg.confidence, JSON.stringify({ location: dmg.location, photo_type: dmg.photo_type })]
      );
    }

    const inspResult = await pool.query(
      'SELECT vehicle_id FROM inspections WHERE id = $1', [id]
    );
    if (inspResult.rows.length) {
      await pool.query(
        'UPDATE vehicles SET health_score = $1, updated_at = NOW() WHERE id = $2',
        [healthScore, inspResult.rows[0].vehicle_id]
      );
    }

    res.json({
      damages:      mockDamages,
      health_score: healthScore,
      damage_count: mockDamages.length,
      analysis_source: 'stub',
    });
  } catch (err) { next(err); }
};

// ─── GENERATE PDF ────────────────────────────────────────────────
exports.generatePdf = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inspResult = await pool.query(
      `SELECT i.*, v.number_plate, v.make, v.model, v.year, v.health_score,
              u.name as driver_name, u.email as driver_email
       FROM inspections i
       JOIN vehicles v ON v.id = i.vehicle_id
       JOIN users u    ON u.id = i.driver_id
       WHERE i.id = $1`,
      [id]
    );
    if (!inspResult.rows.length) return res.status(404).json({ error: 'Inspection not found' });
    const insp = inspResult.rows[0];

    const [photosRes, damagesRes, sigsRes] = await Promise.all([
      pool.query('SELECT * FROM inspection_photos WHERE inspection_id = $1 ORDER BY photo_type', [id]),
      pool.query('SELECT * FROM damage_detections WHERE inspection_id = $1', [id]),
      pool.query('SELECT * FROM digital_signatures WHERE inspection_id = $1', [id]),
    ]);

    const photos  = photosRes.rows;
    const damages = damagesRes.rows;
    const sigs    = sigsRes.rows;

    const doc     = new PDFDocument({ margin: 50, size: 'A4' });
    const outDir  = path.resolve(process.env.UPLOAD_DIR || './uploads');
    const pdfName = `inspection_${id}_${Date.now()}.pdf`;
    const pdfPath = path.join(outDir, pdfName);
    const stream  = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(22).fillColor('#1F4E79').text('FleetGuard AI', 50, 50);
    doc.fontSize(12).fillColor('#595959').text('Vehicle Inspection Report', 50, 78);
    doc.moveTo(50, 100).lineTo(545, 100).strokeColor('#2E75B6').stroke();

    const metaY = 115;
    doc.fontSize(10).fillColor('#000000');
    doc.text(`Report ID: #INS-${String(id).padStart(6, '0')}`, 50, metaY);
    doc.text(`Date: ${new Date(insp.created_at).toLocaleString('en-GB')}`, 50, metaY + 15);
    doc.text(`Type: ${(insp.inspection_type || 'pre').toUpperCase()}-RENTAL`, 50, metaY + 30);

    doc.rect(50, metaY + 50, 495, 70).fill('#D6E4F0').fillColor('#000000');
    doc.fontSize(11).fillColor('#1F4E79').text('VEHICLE INFORMATION', 60, metaY + 58);
    doc.fontSize(10).fillColor('#000000');
    doc.text(`Plate:  ${insp.number_plate}`, 60, metaY + 73);
    doc.text(`Make/Model:  ${insp.make} ${insp.model} (${insp.year || 'N/A'})`, 60, metaY + 88);
    doc.text(`Health Score:  ${insp.health_score}/100`, 300, metaY + 73);
    doc.text(`Status:  Inspected`, 300, metaY + 88);

    const custY = metaY + 135;
    doc.rect(50, custY, 495, 70).fill('#E2EFDA').fillColor('#000000');
    doc.fontSize(11).fillColor('#1F4E79').text('CUSTOMER INFORMATION', 60, custY + 8);
    doc.fontSize(10).fillColor('#000000');
    doc.text(`Name:  ${insp.customer_name}`, 60, custY + 23);
    doc.text(`NIC/Passport:  ${insp.customer_nic}`, 60, custY + 38);
    doc.text(`Phone:  ${insp.customer_phone || 'N/A'}`, 300, custY + 23);
    doc.text(`Rental:  ${insp.rental_start} → ${insp.rental_end}`, 300, custY + 38);

    const drvY = custY + 85;
    doc.fontSize(10).fillColor('#595959');
    doc.text(`Driver: ${insp.driver_name}  (${insp.driver_email})`, 50, drvY);

    const hsY = drvY + 20;
    doc.fontSize(11).fillColor('#1F4E79').text('HEALTH SCORE', 50, hsY);
    doc.rect(50, hsY + 18, 495, 16).fill('#F2F2F2');
    const barColor = insp.health_score >= 80 ? '#70AD47' : insp.health_score >= 60 ? '#FFC000' : '#C00000';
    doc.rect(50, hsY + 18, Math.round(495 * insp.health_score / 100), 16).fill(barColor);
    doc.fontSize(10).fillColor('#000000').text(`${insp.health_score}/100`, 555, hsY + 18);

    const dmgY = hsY + 50;
    doc.fontSize(11).fillColor('#1F4E79').text('DAMAGE DETECTIONS', 50, dmgY);
    if (!damages.length) {
      doc.fontSize(10).fillColor('#595959').text('No damage detected.', 50, dmgY + 18);
    } else {
      let rowY = dmgY + 18;
      doc.rect(50, rowY, 495, 20).fill('#1F4E79');
      doc.fontSize(9).fillColor('#FFFFFF');
      doc.text('Type',       55,  rowY + 5);
      doc.text('Severity',   150, rowY + 5);
      doc.text('Confidence', 250, rowY + 5);
      doc.text('Location',   350, rowY + 5);
      rowY += 20;
      damages.forEach((d, i) => {
        doc.rect(50, rowY, 495, 18).fill(i % 2 === 0 ? '#F2F2F2' : '#FFFFFF');
        const bbox = typeof d.bbox_json === 'string' ? JSON.parse(d.bbox_json || '{}') : (d.bbox_json || {});
        doc.fontSize(9).fillColor('#000000');
        doc.text(d.damage_type,                 55,  rowY + 4);
        doc.text((d.severity || '').toUpperCase(), 150, rowY + 4);
        doc.text(`${parseFloat(d.confidence || 0).toFixed(1)}%`, 250, rowY + 4);
        doc.text(bbox.location || '-',           350, rowY + 4);
        rowY += 18;
      });
    }

    doc.addPage();
    doc.fontSize(14).fillColor('#1F4E79').text('INSPECTION PHOTOS', 50, 50);
    doc.moveTo(50, 70).lineTo(545, 70).strokeColor('#2E75B6').stroke();

    let px = 50, py = 85, photoCount = 0;
    for (const photo of photos) {
      const absPath = path.join(__dirname, '../..', photo.file_url);
      if (fs.existsSync(absPath)) {
        try {
          doc.image(absPath, px, py, { width: 230, height: 160 });
          doc.fontSize(8).fillColor('#595959').text((photo.photo_type || '').toUpperCase(), px, py + 163);
        } catch (_) {
          doc.fontSize(8).text(`[${photo.photo_type}]`, px, py);
        }
      }
      photoCount++;
      if (photoCount % 2 === 0) { px = 50; py += 185; } else { px = 315; }
    }

    doc.addPage();
    doc.fontSize(14).fillColor('#1F4E79').text('DIGITAL SIGNATURES', 50, 50);
    doc.moveTo(50, 70).lineTo(545, 70).strokeColor('#2E75B6').stroke();

    let sigY = 90;
    for (const sig of sigs) {
      doc.fontSize(10).fillColor('#595959').text(
        `${(sig.signer_type || '').charAt(0).toUpperCase() + (sig.signer_type || '').slice(1)} Signature`, 50, sigY
      );
      const sigPath = path.join(__dirname, '../..', sig.signature_url);
      if (fs.existsSync(sigPath)) {
        try { doc.image(sigPath, 50, sigY + 15, { width: 200, height: 80 }); } catch (_) {}
      }
      doc.moveTo(50, sigY + 110).lineTo(280, sigY + 110).strokeColor('#CCCCCC').stroke();
      doc.fontSize(8).fillColor('#595959').text(
        `Signed: ${new Date(sig.signed_at).toLocaleString('en-GB')}`, 50, sigY + 115
      );
      sigY += 145;
    }

    doc.fontSize(8).fillColor('#999999').text(
      'Generated by FleetGuard AI  |  KITH Travels  |  Confidential',
      50, doc.page.height - 60, { width: 495, align: 'center' }
    );

    doc.end();

    stream.on('finish', async () => {
      try {
        const pdfUrl = `/uploads/${pdfName}`;
        await pool.query(
          'UPDATE inspections SET pdf_url = $1, status = $2, updated_at = NOW() WHERE id = $3',
          [pdfUrl, 'completed', id]
        );
        res.json({ pdf_url: pdfUrl, inspection_id: parseInt(id, 10) });
      } catch (e) { next(e); }
    });
    stream.on('error', next);
  } catch (err) { next(err); }
};

// ─── DOWNLOAD PDF ─────────────────────────────────────────────────
exports.downloadPdf = async (req, res, next) => {
  try {
    const r = await pool.query('SELECT pdf_url FROM inspections WHERE id = $1', [req.params.id]);
    if (!r.rows.length || !r.rows[0].pdf_url)
      return res.status(404).json({ error: 'PDF not yet generated' });
    const base = `${req.protocol}://${req.get('host')}`;
    res.redirect(base + r.rows[0].pdf_url);
  } catch (err) { next(err); }
};

// ─── MANAGER: Review an inspection ──────────────────────────────
exports.reviewInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review_status, notes } = req.body;

    if (!['approved', 'flagged'].includes(review_status))
      return res.status(400).json({ error: 'review_status must be approved or flagged' });

    await pool.query(
      `INSERT INTO inspection_reviews (inspection_id, manager_id, review_status, notes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (inspection_id) DO UPDATE
         SET review_status = $3, notes = $4, reviewed_at = NOW()`,
      [id, req.user.id, review_status, notes || null]
    );

    await pool.query(
      "UPDATE inspections SET status = 'reviewed', updated_at = NOW() WHERE id = $1",
      [id]
    );

    res.json({ message: `Inspection ${review_status}` });
  } catch (err) { next(err); }
};
