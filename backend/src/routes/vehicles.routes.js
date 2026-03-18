/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-03-05
 */

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/vehicles.controller');
const mc      = require('../controllers/manager.controller');
const { verifyToken }  = require('../middleware/auth');
const { requireRole }  = require('../middleware/roles');

router.use(verifyToken);  // all vehicle routes need auth

router.get('/',             ctrl.getAll);
router.get('/available',    ctrl.getAvailable);
router.get('/:id/inspection-history', requireRole('manager','admin'), mc.getVehicleInspectionHistory);
router.get('/:id',          ctrl.getOne);
router.post('/',            requireRole('manager','admin'), ctrl.create);
router.put('/:id',          requireRole('manager','admin'), ctrl.update);
router.patch('/:id/status', requireRole('manager','admin'), ctrl.updateStatus);

module.exports = router;
