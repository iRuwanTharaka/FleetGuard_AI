const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inspections.controller');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.use(verifyToken);

router.post('/',              requireRole('driver'),          ctrl.create);
router.get('/',               requireRole('manager','admin'), ctrl.getAll);
router.get('/my',             requireRole('driver'),          ctrl.getMine);
router.get('/:id',                                           ctrl.getOne);
router.put('/:id',            requireRole('driver'),          ctrl.update);
router.post('/:id/complete',  requireRole('driver'),          ctrl.complete);
router.post('/:id/analyze',   requireRole('driver'),          ctrl.triggerAI);
router.post('/:id/generate-pdf', requireRole('driver'),       ctrl.generatePdf);
router.get('/:id/pdf',        ctrl.downloadPdf);
router.post('/:id/review',    requireRole('manager','admin'), ctrl.reviewInspection);

module.exports = router;
