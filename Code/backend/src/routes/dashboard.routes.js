const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.use(verifyToken);
router.use(requireRole('manager', 'admin'));

router.get('/stats',        ctrl.getStats);
router.get('/health-dist',  ctrl.getHealthDistribution);
router.get('/activity',     ctrl.getActivity);

module.exports = router;
