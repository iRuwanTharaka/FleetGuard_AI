import express from 'express';
import * as driverController from '../controllers/driverController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', driverController.register);
router.post('/login', driverController.login);

// Protected routes (require authentication)
router.get('/profile', protect, restrictTo('driver'), driverController.getProfile);

export default router;
