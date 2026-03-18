const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/photos.controller');
const { verifyToken } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.use(verifyToken);

router.post('/upload/:inspectionId',       upload.single('photo'),    ctrl.uploadPhoto);
router.post('/upload-batch/:inspectionId', upload.array('photos', 8), ctrl.uploadBatch);
router.post('/signature/:inspectionId',    upload.single('signature'), ctrl.uploadSignature);
router.get('/:inspectionId',                                          ctrl.getPhotos);

module.exports = router;
