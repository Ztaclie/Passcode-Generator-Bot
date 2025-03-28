const passcodeService = require('../services/passcodeService');
const logger = require('../utils/logger');

class PasscodeController {
    async getCurrentPasscode(req, res) {
        try {
            logger.info('Request received for current passcode');
            const currentPasscode = passcodeService.getCurrentPasscode();
            
            if (!currentPasscode) {
                logger.warn('No passcode found');
                return res.status(404).json({ error: 'No passcode generated yet' });
            }

            await passcodeService.sendPasscodeToTelegram(currentPasscode, '📋 Current Passcode:');
            logger.info('Current passcode retrieved and sent to Telegram');
            
            res.json({ 
                passcode: currentPasscode,
                generatedAt: passcodeService.getLastGeneratedAt()
            });
        } catch (error) {
            logger.error('Error retrieving passcode:', error);
            res.status(500).json({ error: 'Failed to retrieve passcode' });
        }
    }
}

module.exports = new PasscodeController(); 