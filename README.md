# Passcode Generator Bot

A Telegram bot that generates and manages passcodes with scheduling capabilities.

## Features

- Generate unique passcodes
- Schedule passcode updates (daily/weekly/monthly/infinite)
- Admin-based chat management
- Persistent chat storage
- API endpoint for passcode validation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (get it from [@BotFather](https://t.me/botfather))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/passcode-generator.git
cd passcode-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3001
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id_here
```

4. Start the server:
```bash
npm start
```

## Data Storage

The application automatically creates and manages the following data structure:

```
data/
├── chats.json    // Stores authorized chat information
└── passcode.json // Stores current passcode and generation time
```

These files are:
- Created automatically on first run
- Not included in the repository (gitignored)
- Specific to each deployment
- Persisted between server restarts

## Usage

### Telegram Bot Commands

#### Regular Commands
- `/start` - Initialize the bot
- `/help` - Show available commands
- `/new` - Generate a new passcode
- `/current` - Get current passcode
- `/schedule` - Show current schedule status
- `/schedule [type]` - Set schedule (daily/weekly/monthly/infinite)

#### Admin Commands
- `/addchat [chat_id]` - Add a new authorized chat
- `/removechat [chat_id]` - Remove an authorized chat
- `/listchats` - List all authorized chats with details

### API Endpoints

#### Validate Passcode
```http
POST /api/validate
Content-Type: application/json

{
    "passcode": "your-passcode-here"
}
```

Response:
```json
{
    "isValid": true|false,
    "message": "Passcode is valid"|"Passcode is invalid",
    "generatedAt": "DD.MM.YYYY, HH:MM:SS"
}
```

## Security

- Only authorized chats can use the bot
- Admin-only access to chat management
- Passcode validation through secure API endpoint
- Data files are not included in version control

## Development

### Project Structure
```
src/
├── config/
│   └── config.js
├── controllers/
│   └── passcodeController.js
├── routes/
│   └── api.js
├── services/
│   ├── chatService.js
│   ├── passcodeService.js
│   ├── scheduleService.js
│   └── telegramService.js
└── utils/
    ├── dateFormatter.js
    └── logger.js
```

### Adding New Features

1. Create new service in `src/services/`
2. Add routes in `src/routes/`
3. Create controllers in `src/controllers/`
4. Update environment variables if needed

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 