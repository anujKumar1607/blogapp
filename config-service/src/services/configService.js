const config = require('config');
const logger = require('../utils/logger');

let serviceConfig;

const initializeConfig = () => {
  try {
    serviceConfig = config;
    logger.info('Configuration initialized successfully');
  } catch (error) {
    logger.error('Config initialization failed:', error);
    process.exit(1);
  }
};

const getServiceConfig = (serviceName) => {
  if (!serviceConfig.has(`services.${serviceName}`)) {
    throw new Error(`Configuration for ${serviceName} not found`);
  }
  return serviceConfig.get(`services.${serviceName}`);
};

const getAllConfig = () => {
  return serviceConfig;
};

const updateConfig = (serviceName, updates) => {
    if (!serviceConfig.has(`services.${serviceName}`)) {
        throw new Error(`Service ${serviceName} not found`);
    }

    const currentConfig = serviceConfig.get(`services.${serviceName}`);
    const updatedConfig = { ...currentConfig, ...updates };
    
    // In a real implementation, you would persist this to your config store
    serviceConfig.set(`services.${serviceName}`, updatedConfig);
    
    logger.info(`Updated config for ${serviceName}`);
    return updatedConfig;
};

module.exports = {
  initializeConfig,
  getServiceConfig,
  getAllConfig,
  updateConfig
};