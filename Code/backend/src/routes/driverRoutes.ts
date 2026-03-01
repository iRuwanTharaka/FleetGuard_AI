import express from 'express';
import * as driverController from '../controllers/driverController';
import { protect, restrictTo } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.post('/register', driverController.register);
router.post('/login', driverController.login);

// Protected routes (require authentication)
router.get('/profile', protect, restrictTo(UserRole.DRIVER), driverController.getProfile);

export default router;
