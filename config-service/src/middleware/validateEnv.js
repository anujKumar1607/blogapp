const logger = require('../utils/logger');

const validateEnvironment = () => {
  const requiredVars = ['JWT_SECRET', 'MONGO_URI'];
  let missingVars = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { validateEnvironment };