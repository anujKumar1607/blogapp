const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        ...(process.env.NODE_ENV === 'production' ? [
            new transports.File({ 
                filename: path.join(__dirname, '../../logs/config-service.log'),
                level: 'info'
            }),
            new transports.File({ 
                filename: path.join(__dirname, '../../logs/config-service-errors.log'),
                level: 'error'
            })
        ] : [])
    ]
});

// Add service name to logs
logger.defaultMeta = { service: 'config-service' };

module.exports = logger;