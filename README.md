# Passcode Generator

A Node.js application that generates random passcodes (UUIDs) and sends them to a Telegram bot. The passcodes can be generated on-demand or scheduled (daily/weekly/monthly/infinite).

## Features

- Generates random UUIDs as passcodes
- Interactive Telegram bot interface
- Flexible scheduling options (daily/weekly/monthly/infinite)
- Schedule control through Telegram commands
- Comprehensive logging system
- Simple REST API endpoint
- Clean architecture with separation of concerns

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram bot token (get it from @BotFather)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file with your configuration:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── index.js        # Application entry point
```

## Telegram Bot Commands

Start a chat with your bot and use these commands:

- `/start` - Initialize the bot and show available commands
- `/help` - Show help message with available commands
- `/new` - Generate a new passcode
- `/current` - Get the current passcode
- `/schedule` - Set schedule (daily/weekly/monthly/infinite)
- `/status` - Show current schedule status

## Schedule Control

You can control the passcode generation schedule through Telegram commands:

- Use `/schedule daily` to set daily schedule (generates at midnight every day)
- Use `/schedule weekly` to set weekly schedule (generates at midnight every Sunday)
- Use `/schedule monthly` to set monthly schedule (generates at midnight on the 1st of each month)
- Use `/schedule infinite` to disable automatic generation
- Use `/status` to check the current schedule status and next run time

By default, the bot starts with infinite schedule (no automatic generation).

## API Endpoint

### Get Current Passcode
```
GET /api/current
```

Response:
```json
{
    "passcode": "generated-uuid-here",
    "generatedAt": "2024-01-20T12:34:56.789Z"
}
```

## Logging

The application uses Winston for logging with the following features:

- Console output with colors
- File logging for all messages in `logs/combined.log`
- Separate error log file in `logs/error.log`
- Timestamp and log level in each entry
- Structured logging format

Log levels available:
- error: For error messages
- warn: For warning messages
- info: For general information
- debug: For detailed debugging information

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Monitor your Telegram bot's activity
- The API endpoint is designed for local network use only 