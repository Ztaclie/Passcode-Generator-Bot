const config = require('../config/config');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class ChatService {
    constructor() {
        this.authorizedChats = new Map();
        this.adminChatId = config.telegram.adminChatId;
        this.storageFile = path.join(__dirname, '../../data/chats.json');
        this.loadChats().then(() => {
            // Add admin chat if not already present
            if (!this.isAuthorizedChat(this.adminChatId)) {
                const adminChatInfo = {
                    addedBy: 'system',
                    addedAt: new Date(),
                    scheduleType: 'infinite',
                    isActive: true,
                    lastPasscode: null,
                    lastPasscodeGeneratedAt: null
                };
                this.authorizedChats.set(this.adminChatId.toString(), adminChatInfo);
                this.saveChats();
                logger.info(`Admin chat ${this.adminChatId} added automatically`);
            }
        });
    }

    async loadChats() {
        try {
            // Create data directory if it doesn't exist
            await fs.mkdir(path.dirname(this.storageFile), { recursive: true });
            
            // Try to read existing chats
            const data = await fs.readFile(this.storageFile, 'utf8');
            const chats = JSON.parse(data);
            
            // Convert array back to Map
            this.authorizedChats = new Map(Object.entries(chats));
            logger.info('Chats loaded successfully');
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet, that's okay
                logger.info('No existing chats found, starting fresh');
            } else {
                logger.error('Error loading chats:', error);
            }
        }
    }

    async saveChats() {
        try {
            // Convert Map to object for JSON storage
            const chats = Object.fromEntries(this.authorizedChats);
            await fs.writeFile(this.storageFile, JSON.stringify(chats, null, 2));
            logger.info('Chats saved successfully');
        } catch (error) {
            logger.error('Error saving chats:', error);
        }
    }

    isAdmin(chatId) {
        return chatId.toString() === this.adminChatId;
    }

    isAuthorizedChat(chatId) {
        return this.authorizedChats.has(chatId.toString());
    }

    async addChat(chatId, addedBy) {
        if (!this.isAdmin(addedBy)) {
            throw new Error('Only admin can add new chats');
        }

        const chatInfo = {
            addedBy,
            addedAt: new Date(),
            scheduleType: 'infinite',
            isActive: true,
            lastPasscode: null,
            lastPasscodeGeneratedAt: null
        };

        this.authorizedChats.set(chatId.toString(), chatInfo);
        await this.saveChats();
        logger.info(`Chat ${chatId} added by admin ${addedBy}`);
    }

    async removeChat(chatId, removedBy) {
        if (!this.isAdmin(removedBy)) {
            throw new Error('Only admin can remove chats');
        }

        this.authorizedChats.delete(chatId.toString());
        await this.saveChats();
        logger.info(`Chat ${chatId} removed by admin ${removedBy}`);
    }

    getChat(chatId) {
        return this.authorizedChats.get(chatId.toString());
    }

    async updateChatSettings(chatId, settings) {
        const chat = this.getChat(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }

        Object.assign(chat, settings);
        this.authorizedChats.set(chatId.toString(), chat);
        await this.saveChats();
    }

    getAllChats() {
        return Array.from(this.authorizedChats.entries()).map(([chatId, info]) => ({
            chatId,
            ...info
        }));
    }

    getActiveChats() {
        return this.getAllChats().filter(chat => chat.isActive);
    }
}

module.exports = new ChatService(); 