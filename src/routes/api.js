const express = require('express');
const router = express.Router();
const passcodeController = require('../controllers/passcodeController');

router.post('/validate', passcodeController.validatePasscode);

module.exports = router; 