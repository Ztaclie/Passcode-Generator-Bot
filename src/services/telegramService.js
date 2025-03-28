const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const passcodeService = require('./passcodeService');
const scheduleService = require('./scheduleService');
const chatService = require('./chatService');
const { formatDateTime } = require('../utils/dateFormatter');

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
        this.bot.onText(/\/schedule(?:\s+(.+))?/, this.handleSchedule.bind(this));
        this.bot.onText(/\/addchat (.+)/, this.handleAddChat.bind(this));
        this.bot.onText(/\/removechat (.+)/, this.handleRemoveChat.bind(this));
        this.bot.onText(/\/listchats/, this.handleListChats.bind(this));
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
        
        if (!chatService.isAuthorizedChat(chatId)) {
            await this.sendMessage(chatId, 
                'This chat is not authorized to use this bot. Please contact the administrator.'
            );
            return;
        }

        await this.sendMessage(chatId, 
            'Welcome to Passcode Generator Bot! 🤖\n\n' +
            'Available commands:\n' +
            '/new - Generate a new passcode\n' +
            '/current - Get current passcode\n' +
            '/schedule - Show current schedule status\n' +
            '/schedule [type] - Set schedule (daily/weekly/monthly/infinite)\n' +
            '/help - Show this help message'
        );
    }

    async handleHelp(msg) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAuthorizedChat(chatId)) {
            await this.sendMessage(chatId, 
                'This chat is not authorized to use this bot. Please contact the administrator.'
            );
            return;
        }

        let helpMessage = 'Available commands:\n' +
            '/new - Generate a new passcode\n' +
            '/current - Get current passcode\n' +
            '/schedule - Show current schedule status\n' +
            '/schedule [type] - Set schedule (daily/weekly/monthly/infinite)\n' +
            '/help - Show this help message';

        if (chatService.isAdmin(chatId)) {
            helpMessage += '\n\nAdmin commands:\n' +
                '/addchat [chat_id] - Add a new authorized chat\n' +
                '/removechat [chat_id] - Remove an authorized chat\n' +
                '/listchats - List all authorized chats';
        }

        await this.sendMessage(chatId, helpMessage);
    }

    async handleNew(msg) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAuthorizedChat(chatId)) {
            await this.sendMessage(chatId, 
                'This chat is not authorized to use this bot. Please contact the administrator.'
            );
            return;
        }

        const newPasscode = passcodeService.generatePasscode();
        await chatService.updateChatSettings(chatId, {
            lastPasscode: newPasscode,
            lastPasscodeGeneratedAt: new Date()
        });

        await this.sendMessage(chatId, 
            `🔐 New Passcode Generated!\n\nYour passcode is: \`${newPasscode}\`\n\nGenerated at: ${formatDateTime(passcodeService.getLastGeneratedAt())}`, 
            { parse_mode: 'Markdown' }
        );
    }

    async handleCurrent(msg) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAuthorizedChat(chatId)) {
            await this.sendMessage(chatId, 
                'This chat is not authorized to use this bot. Please contact the administrator.'
            );
            return;
        }

        const currentPasscode = passcodeService.getCurrentPasscode();
        if (!currentPasscode) {
            await this.sendMessage(chatId, 'No passcode has been generated yet. Use /new to generate one.');
            return;
        }

        await this.sendMessage(chatId, 
            `📋 Current Passcode:\n\nYour passcode is: \`${currentPasscode}\`\n\nGenerated at: ${formatDateTime(passcodeService.getLastGeneratedAt())}`, 
            { parse_mode: 'Markdown' }
        );
    }

    async handleSchedule(msg, match) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAuthorizedChat(chatId)) {
            await this.sendMessage(chatId, 
                'This chat is not authorized to use this bot. Please contact the administrator.'
            );
            return;
        }

        // If no schedule type provided, show current status
        if (!match[1]) {
            const status = await scheduleService.getStatus();
            await this.sendMessage(chatId, status);
            return;
        }

        const scheduleType = match[1].toLowerCase();

        if (!['daily', 'weekly', 'monthly', 'infinite'].includes(scheduleType)) {
            await this.sendMessage(chatId, 
                '❌ Invalid schedule type. Please use one of: daily, weekly, monthly, or infinite'
            );
            return;
        }

        await scheduleService.setSchedule(scheduleType);
        await chatService.updateChatSettings(chatId, { scheduleType });
        
        await this.sendMessage(chatId, 
            `✅ Schedule set to: ${scheduleType.toUpperCase()}\n` +
            `Status: ${scheduleType !== 'infinite' ? 'Enabled' : 'Disabled'}`
        );
    }

    async handleAddChat(msg, match) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAdmin(chatId)) {
            await this.sendMessage(chatId, 'Only administrators can add new chats.');
            return;
        }

        const targetChatId = match[1];
        try {
            await chatService.addChat(targetChatId, chatId);
            await this.sendMessage(chatId, `✅ Chat ${targetChatId} has been added successfully.`);
        } catch (error) {
            await this.sendMessage(chatId, `❌ Error adding chat: ${error.message}`);
        }
    }

    async handleRemoveChat(msg, match) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAdmin(chatId)) {
            await this.sendMessage(chatId, 'Only administrators can remove chats.');
            return;
        }

        const targetChatId = match[1];
        try {
            await chatService.removeChat(targetChatId, chatId);
            await this.sendMessage(chatId, `✅ Chat ${targetChatId} has been removed successfully.`);
        } catch (error) {
            await this.sendMessage(chatId, `❌ Error removing chat: ${error.message}`);
        }
    }

    async handleListChats(msg) {
        const chatId = msg.chat.id;
        
        if (!chatService.isAdmin(chatId)) {
            await this.sendMessage(chatId, 'Only administrators can list chats.');
            return;
        }

        const chats = chatService.getAllChats();
        if (chats.length === 0) {
            await this.sendMessage(chatId, 'No authorized chats found.');
            return;
        }

        const chatList = chats.map(chat => 
            `Chat ID: ${chat.chatId}\n` +
            `Added by: ${chat.addedBy}\n` +
            `Added at: ${formatDateTime(chat.addedAt)}\n` +
            `Schedule: ${chat.scheduleType}\n` +
            `Status: ${chat.isActive ? '✅ Active' : '❌ Inactive'}\n` +
            `Last passcode: ${chat.lastPasscode ? 'Generated' : 'None'}\n` +
            `Last generated: ${chat.lastPasscodeGeneratedAt ? formatDateTime(chat.lastPasscodeGeneratedAt) : 'Never'}\n`
        ).join('\n');

        await this.sendMessage(chatId, `📋 Authorized Chats:\n\n${chatList}`);
    }
}

module.exports = new TelegramService(); 