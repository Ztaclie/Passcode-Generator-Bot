require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const apiRoutes = require('./routes/api');
const telegramService = require('./services/telegramService');
const passcodeService = require('./services/passcodeService');
const scheduleService = require('./services/scheduleService');

const app = express();
app.use(express.json());

// Setup API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log('Server started with infinite schedule');
}); 