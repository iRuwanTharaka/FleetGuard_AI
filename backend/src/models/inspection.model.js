/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-03-03
 */

const { db } = require('./index');

async function createInspection({
  vehicle_id,
  driver_id,
  customer_name,
  customer_nic,
  customer_phone,
  rental_start,
  rental_end,
  inspection_type = 'pre',
}) {
  const r = await db.query(
    `INSERT INTO inspections
       (vehicle_id,driver_id,customer_name,customer_nic,customer_phone,
        rental_start,rental_end,inspection_type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      vehicle_id,
      driver_id,
      customer_name,
      customer_nic,
      customer_phone,
      rental_start,
      rental_end,
      inspection_type,
    ],
  );
  return r.rows[0];
}

async function findById(id) {
  const r = await db.query('SELECT * FROM inspections WHERE id=$1', [id]);
  return r.rows[0] || null;
}

async function updateNotes(id, driverId, overall_notes) {
  const r = await db.query(
    'UPDATE inspections SET overall_notes=$1,updated_at=NOW() WHERE id=$2 AND driver_id=$3 RETURNING *',
    [overall_notes, id, driverId],
  );
  return r.rows[0] || null;
}

async function complete(id, driverId) {
  await db.query(
    "UPDATE inspections SET status='completed',updated_at=NOW() WHERE id=$1 AND driver_id=$2",
    [id, driverId],
  );
}

async function setPdfUrl(id, pdfUrl) {
  await db.query(
    'UPDATE inspections SET pdf_url = $1, status = $2, updated_at = NOW() WHERE id = $3',
    [pdfUrl, 'completed', id],
  );
}

async function getPdfUrl(id) {
  const r = await db.query('SELECT pdf_url FROM inspections WHERE id = $1', [id]);
  return r.rows[0]?.pdf_url || null;
}

module.exports = {
  createInspection,
  findById,
  updateNotes,
  complete,
  setPdfUrl,
  getPdfUrl,
};

