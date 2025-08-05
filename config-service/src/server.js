require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { initializeConfig } = require('./services/configService');
const configRoutes = require('./routes/configRoutes');
const { validateEnvironment } = require('./middleware/validateEnv');
const logger = require('./utils/logger');
const healthChecker = require('./utils/healthCheck');

const app = express();
const PORT = process.env.PORT || 3003;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize configuration
initializeConfig();

// Health Checks
healthChecker.addCheck('config-db', healthChecker.dbHealthCheck);

// Routes
app.use('/config', configRoutes);
app.get('/health', async (req, res) => {
    const healthStatus = await healthChecker.performChecks();
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus);
});

// Validate environment
validateEnvironment();

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.stack}`);
    res.status(500).json({ 
        success: false,
        message: 'Internal Server Error' 
    });
});

app.listen(PORT, () => {
    logger.info(`Config service running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.stack}`);
    process.exit(1);
});