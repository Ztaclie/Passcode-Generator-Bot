const { v4: uuidv4 } = require('uuid');
const telegramService = require('./telegramService');
const config = require('../config/config');

class PasscodeService {
    constructor() {
        this.currentPasscode = null;
        this.lastGeneratedAt = null;
    }

    generatePasscode() {
        this.currentPasscode = uuidv4();
        this.lastGeneratedAt = new Date();
        return this.currentPasscode;
    }

    getCurrentPasscode() {
        return this.currentPasscode;
    }

    getLastGeneratedAt() {
        return this.lastGeneratedAt;
    }

    async sendPasscodeToTelegram(passcode, message) {
        if (!passcode) {
            throw new Error('No passcode provided');
        }
        await telegramService.sendMessage(
            config.telegram.chatId,
            `${message}\n\nYour passcode is: \`${passcode}\`\n\nGenerated at: ${this.lastGeneratedAt.toISOString()}`,
            { parse_mode: 'Markdown' }
        );
    }
}

module.exports = new PasscodeService(); 