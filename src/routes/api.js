const express = require('express');
const router = express.Router();
const passcodeController = require('../controllers/passcodeController');

router.get('/current', passcodeController.getCurrentPasscode);

module.exports = router; 