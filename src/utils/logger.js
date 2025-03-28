const winston = require('winston');
const path = require('path');
const { formatDateTime } = require('./dateFormatter');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(
        ({ timestamp, level, message }) => `${formatDateTime(timestamp)} ${level}: ${message}`
    )
);

// Create the logger
const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File transport for errors
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        })
    ]
});

module.exports = logger; 