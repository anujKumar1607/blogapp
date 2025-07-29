const axios = require('axios');
const cache = require('memory-cache');
const CircuitBreaker = require('opossum');

class ServiceClient {
  constructor() {
    this.breakers = new Map();
    this.configServiceUrl = process.env.CONFIG_SERVICE_URL || 'http://config-service:3003';
    this.cacheTimeout = 60000; // 1 minute cache
  }

//   async getService(serviceName) {
//     const cacheKey = `service:${serviceName}`;
//     const cached = cache.get(cacheKey);
    
//     if (cached) {
//       return cached;
//     }

//     try {
//       const response = await axios.get(`${this.configServiceUrl}/services`);
//       const serviceConfig = response.data.services[serviceName];
      
//       if (!serviceConfig) {
//         throw new Error(`Service ${serviceName} not found`);
//       }

//       // Cache the service URL
//       cache.put(cacheKey, serviceConfig, this.cacheTimeout);
      
//       return serviceConfig;
//     } catch (error) {
//       console.error('Service discovery failed:', error.message);
//       throw error;
//     }
//   }
   async getServiceWithCircuitBreaker(serviceName) {
    if (!this.breakers.has(serviceName)) {
      const breaker = new CircuitBreaker(
        async () => this.getService(serviceName),
        {
          timeout: 3000,
          errorThresholdPercentage: 50,
          resetTimeout: 30000
        }
      );
      this.breakers.set(serviceName, breaker);
    }
    return this.breakers.get(serviceName).fire();
   }

  async makeServiceRequest(serviceName, options, retries = 3) {
    try {
        const { url } = await this.getService(serviceName);
        return await axios({
        ...options,
        url: `${url}${options.path || ''}`
        });
    } catch (error) {
        if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeServiceRequest(serviceName, options, retries - 1);
        }
        throw error;
    }
  }
}

module.exports = new ServiceClient();