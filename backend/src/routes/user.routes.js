const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const preferencesController = require('../controllers/preferences.controller');
const profileController = require('../controllers/profile.controller');
const upload = require('../middleware/upload');

router.use(verifyToken);

router.get('/preferences', preferencesController.getPreferences);
router.put('/preferences', preferencesController.updatePreferences);
router.put('/profile', upload.single('avatar'), profileController.updateProfile);
router.put('/change-password', profileController.changePassword);

module.exports = router;
