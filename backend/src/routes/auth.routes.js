/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-02-28
 */

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['driver','manager']),
], ctrl.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], ctrl.login);

router.post('/google',           [body('idToken').notEmpty()], ctrl.googleLogin);
router.post('/forgot-password',  [body('email').isEmail()],    ctrl.forgotPassword);
router.post('/reset-password',   [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
], ctrl.resetPassword);

router.get('/me', verifyToken, ctrl.getMe);

module.exports = router;
