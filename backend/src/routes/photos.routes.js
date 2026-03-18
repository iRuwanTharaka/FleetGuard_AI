/**
 * @module     Client Backend
 * @author     Chathura Bhashitha <chathurabhashitha01@gmail.com>
 * @description This file is part of the Client Backend of FleetGuard AI.
 *              All logic in this file satisfies the Client Portal dependencies.
 * @date       2026-02-26
 */

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
