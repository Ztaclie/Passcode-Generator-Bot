# Passcode Generator

A Node.js application that generates random passcodes (UUIDs) and sends them to a Telegram bot. The passcodes can be generated on-demand or scheduled (daily/weekly/monthly/infinite).

## Features

- Generates random UUIDs as passcodes
- Interactive Telegram bot interface
- Flexible scheduling options (daily/weekly/monthly/infinite)
- Schedule control through Telegram commands
- RESTful API endpoints with JWT authentication
- Current passcode retrieval

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
   - `JWT_SECRET`: A secure random string for JWT signing

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Telegram Bot Commands

Start a chat with your bot and use these commands:

- `/start` - Initialize the bot and show available commands
- `/help` - Show help message with available commands
- `/new` - Generate a new passcode
- `/current` - Get the current passcode
- `/schedule <type>` - Set schedule type (daily/weekly/monthly/infinite)
- `/status` - Show current schedule status and next run time

## Schedule Control

You can control the passcode generation schedule through Telegram commands:

- Use `/schedule daily` to set daily schedule (generates at midnight every day)
- Use `/schedule weekly` to set weekly schedule (generates at midnight every Sunday)
- Use `/schedule monthly` to set monthly schedule (generates at midnight on the 1st of each month)
- Use `/schedule infinite` to disable automatic generation
- Use `/status` to check the current schedule status and next run time

By default, the bot starts with infinite schedule (no automatic generation).

## API Endpoints

### Generate New Passcode
```
POST /api/generate
Authorization: Bearer <your_jwt_token>
```

### Get Current Passcode
```
GET /api/current
Authorization: Bearer <your_jwt_token>
```

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use a strong JWT_SECRET
- Regularly rotate your JWT tokens
- Monitor your Telegram bot's activity 