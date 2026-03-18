const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/vehicles.controller');
const { verifyToken }  = require('../middleware/auth');
const { requireRole }  = require('../middleware/roles');

router.use(verifyToken);  // all vehicle routes need auth

router.get('/',             ctrl.getAll);
router.get('/available',    ctrl.getAvailable);
router.get('/:id',          ctrl.getOne);
router.post('/',            requireRole('manager','admin'), ctrl.create);
router.put('/:id',          requireRole('manager','admin'), ctrl.update);
router.patch('/:id/status', requireRole('manager','admin'), ctrl.updateStatus);

module.exports = router;
