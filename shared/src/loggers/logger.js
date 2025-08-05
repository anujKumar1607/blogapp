const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');

// Custom format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Base logger config
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport (colored output)
    new transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    // File transports (only in production)
    ...(process.env.NODE_ENV === 'production' ? [
      new transports.File({ 
        filename: path.join(__dirname, '../logs/combined.log'),
        level: 'info'
      }),
      new transports.File({ 
        filename: path.join(__dirname, '../logs/errors.log'),
        level: 'error'
      })
    ] : [])
  ],
  exitOnError: false
});

// Add Morgan-like HTTP request logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Pretty print for objects
logger.prettyPrint = (obj) => {
  logger.info(JSON.stringify(obj, null, 2));
};

module.exports = logger;