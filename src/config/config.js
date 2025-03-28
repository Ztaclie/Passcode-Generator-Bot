require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    }
}; 