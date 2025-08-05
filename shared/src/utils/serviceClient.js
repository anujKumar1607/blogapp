const axios = require('axios');
const CircuitBreaker = require('opossum');
const { logger } = require('./logger');
const { HTTP_STATUS } = require('../constants/httpStatusCode');

class ServiceClient {
  constructor() {
    this.breakers = new Map();
    this.cache = new Map();
    this.configServiceUrl = process.env.CONFIG_SERVICE_URL;
  }

  async getServiceConfig(serviceName) {
    try {
      const response = await axios.get(
        `${this.configServiceUrl}/config/services/${serviceName}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Service discovery failed for ${serviceName}:`, error);
      throw error;
    }
  }

  async makeRequest(serviceName, options) {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(
        serviceName,
        new CircuitBreaker(
          async (opts) => {
            const config = await this.getServiceConfig(serviceName);
            return axios({ ...opts, baseURL: config.url });
          },
          { timeout: 5000, errorThresholdPercentage: 50 }
        )
      );
    }

    return this.breakers.get(serviceName).fire(options);
  }
}

module.exports = new ServiceClient();