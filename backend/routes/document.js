const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.post('/upload', documentController.uploadDocument);
router.post('/bind', documentController.bindSignatureToDocument);
router.post('/verify', documentController.verifySignature);

module.exports = router;
