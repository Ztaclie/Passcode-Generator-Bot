require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID
    }
}; 