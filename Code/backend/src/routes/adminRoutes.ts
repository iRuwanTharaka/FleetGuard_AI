/**
 * Company: KITH travels
 * Product: Fleet guard
 * Description: Admin routing definitions.
 */
import express from 'express';
import * as adminController from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect, restrictTo(UserRole.ADMIN));

// Drivers
router.route('/drivers')
    .get(adminController.getAllDrivers)
    .post(adminController.createDriver);

router.route('/drivers/:id')
    .get(adminController.getDriver)
    .put(adminController.updateDriver)
    .delete(adminController.deleteDriver);

// Vehicles
router.route('/vehicles')
    .get(adminController.getAllVehicles)
    .post(adminController.createVehicle);

router.route('/vehicles/:id')
    .get(adminController.getVehicle)
    .put(adminController.updateVehicle)
    .delete(adminController.deleteVehicle);

export default router;
