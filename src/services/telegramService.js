const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const passcodeService = require('./passcodeService');
const scheduleService = require('./scheduleService');

class TelegramService {
    constructor() {
        this.bot = new TelegramBot(config.telegram.botToken, { polling: true });
        this.setupCommandHandlers();
    }

    setupCommandHandlers() {
        this.bot.onText(/\/start/, this.handleStart.bind(this));
        this.bot.onText(/\/help/, this.handleHelp.bind(this));
        this.bot.onText(/\/new/, this.handleNew.bind(this));
        this.bot.onText(/\/current/, this.handleCurrent.bind(this));
        this.bot.onText(/\/schedule (.+)/, this.handleSchedule.bind(this));
        this.bot.onText(/\/status/, this.handleStatus.bind(this));
    }

    async sendMessage(chatId, message, options = {}) {
        try {
            await this.bot.sendMessage(chatId, message, options);
        } catch (error) {
            console.error('Error sending message to Telegram:', error);
        }
    }

    async handleStart(msg) {
        const chatId = msg.chat.id;
        await this.sendMessage(chatId, 
            'Welcome to Passcode Generator Bot! 🤖\n\n' +
            'Available commands:\n' +
            '/new - Generate a new passcode\n' +
            '/current - Get current passcode\n' +
            '/schedule - Set schedule (daily/weekly/monthly/infinite)\n' +
            '/status - Show current schedule status\n' +
            '/help - Show this help message'
        );
    }

    async handleHelp(msg) {
        const chatId = msg.chat.id;
        await this.sendMessage(chatId, 
            'Available commands:\n' +
            '/new - Generate a new passcode\n' +
            '/current - Get current passcode\n' +
            '/schedule - Set schedule (daily/weekly/monthly/infinite)\n' +
            '/status - Show current schedule status\n' +
            '/help - Show this help message'
        );
    }

    async handleNew(msg) {
        const chatId = msg.chat.id;
        const newPasscode = passcodeService.generatePasscode();
        await this.sendMessage(chatId, 
            `🔐 New Passcode Generated!\n\nYour passcode is: \`${newPasscode}\`\n\nGenerated at: ${new Date().toISOString()}`, 
            { parse_mode: 'Markdown' }
        );
    }

    async handleCurrent(msg) {
        const chatId = msg.chat.id;
        const currentPasscode = passcodeService.getCurrentPasscode();
        if (!currentPasscode) {
            await this.sendMessage(chatId, 'No passcode has been generated yet. Use /new to generate one.');
            return;
        }
        await this.sendMessage(chatId, 
            `📋 Current Passcode:\n\nYour passcode is: \`${currentPasscode}\`\n\nGenerated at: ${new Date().toISOString()}`, 
            { parse_mode: 'Markdown' }
        );
    }

    async handleSchedule(msg, match) {
        const chatId = msg.chat.id;
        const scheduleType = match[1].toLowerCase();

        if (!['daily', 'weekly', 'monthly', 'infinite'].includes(scheduleType)) {
            await this.sendMessage(chatId, 
                '❌ Invalid schedule type. Please use one of: daily, weekly, monthly, or infinite'
            );
            return;
        }

        await scheduleService.setSchedule(scheduleType);
        await this.sendMessage(chatId, 
            `✅ Schedule set to: ${scheduleType.toUpperCase()}\n` +
            `Status: ${scheduleType !== 'infinite' ? 'Enabled' : 'Disabled'}`
        );
    }

    async handleStatus(msg) {
        const chatId = msg.chat.id;
        const status = await scheduleService.getStatus();
        await this.sendMessage(chatId, status);
    }
}

module.exports = new TelegramService(); 