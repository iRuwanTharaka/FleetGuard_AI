import express from 'express';
import * as managerController from '../controllers/managerController';
import { protect, restrictTo } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.post('/register', managerController.register);
router.post('/login', managerController.login);

// Protected routes (require authentication)
router.get('/profile', protect, restrictTo(UserRole.MANAGER), managerController.getProfile);

export default router;
