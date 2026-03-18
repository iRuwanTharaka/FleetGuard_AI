/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-03-02
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const mc = require('../controllers/manager.controller');
const gpsController = require('../controllers/gps.controller');
const saController = require('../controllers/smartAssignment.controller');
const analyticsController = require('../controllers/analytics.controller');

router.use(verifyToken, requireRole('manager', 'admin'));

router.get('/dashboard/stats', mc.getDashboardStats);
router.get('/dashboard/activity', mc.getDashboardActivity);
router.get('/fleet/health-distribution', mc.getHealthDistribution);
router.get('/recent-alerts', mc.getRecentAlerts);
router.get('/inspections', mc.getManagerInspections);
router.get('/inspections-summary', mc.getInspectionsSummary);

// Sprint 5: Map view
router.get('/vehicles/locations', gpsController.getVehicleLocations);

// Sprint 5: Smart Assignment
router.post('/smart-assignment', saController.getRecommendations);

// Sprint 6: Analytics
router.get('/analytics/health-trend', analyticsController.getHealthTrend);
router.get('/analytics/damage-types', analyticsController.getDamageTypes);
router.get('/analytics/top-damaged', analyticsController.getTopDamagedVehicles);

module.exports = router;
