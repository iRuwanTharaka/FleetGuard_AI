import express from 'express';
import * as managerController from '../controllers/managerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', managerController.register);
router.post('/login', managerController.login);

// Protected routes (require authentication)
router.get('/profile', protect, restrictTo('manager'), managerController.getProfile);

export default router;
