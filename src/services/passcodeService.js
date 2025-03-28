const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class PasscodeService {
    constructor() {
        this.currentPasscode = null;
        this.lastGeneratedAt = null;
        this.storageFile = path.join(__dirname, '../../data/passcode.json');
        this.loadPasscode();
    }

    async loadPasscode() {
        try {
            // Create data directory if it doesn't exist
            await fs.mkdir(path.dirname(this.storageFile), { recursive: true });
            
            // Try to read existing passcode
            const data = await fs.readFile(this.storageFile, 'utf8');
            const passcodeData = JSON.parse(data);
            
            this.currentPasscode = passcodeData.passcode;
            this.lastGeneratedAt = new Date(passcodeData.lastGeneratedAt);
            logger.info('Passcode loaded successfully');
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet, that's okay
                logger.info('No existing passcode found, starting fresh');
            } else {
                logger.error('Error loading passcode:', error);
            }
        }
    }

    async savePasscode() {
        try {
            const passcodeData = {
                passcode: this.currentPasscode,
                lastGeneratedAt: this.lastGeneratedAt
            };
            await fs.writeFile(this.storageFile, JSON.stringify(passcodeData, null, 2));
            logger.info('Passcode saved successfully');
        } catch (error) {
            logger.error('Error saving passcode:', error);
        }
    }

    generatePasscode() {
        this.currentPasscode = uuidv4();
        this.lastGeneratedAt = new Date();
        this.savePasscode(); // Save the new passcode
        return this.currentPasscode;
    }

    getCurrentPasscode() {
        return this.currentPasscode;
    }

    getLastGeneratedAt() {
        return this.lastGeneratedAt;
    }
}

module.exports = new PasscodeService(); 