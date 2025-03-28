const passcodeService = require('../services/passcodeService');
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger');
const { formatDateTime } = require('../utils/dateFormatter');

class PasscodeController {
    async validatePasscode(req, res) {
        try {
            logger.info('Request received for passcode validation');
            const { passcode } = req.body;
            
            if (!passcode) {
                logger.warn('No passcode provided in request');
                return res.status(400).json({ error: 'Passcode is required' });
            }

            const currentPasscode = passcodeService.getCurrentPasscode();
            if (!currentPasscode) {
                logger.warn('No passcode has been generated yet');
                return res.status(404).json({ error: 'No passcode generated yet' });
            }

            const isValid = passcode === currentPasscode;
            logger.info(`Passcode validation result: ${isValid}`);
            
            res.json({ 
                isValid,
                message: isValid ? 'Passcode is valid' : 'Passcode is invalid',
                generatedAt: formatDateTime(passcodeService.getLastGeneratedAt())
            });
        } catch (error) {
            logger.error('Error validating passcode:', error);
            res.status(500).json({ error: 'Failed to validate passcode' });
        }
    }
}

module.exports = new PasscodeController(); 