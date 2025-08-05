const axios = require('axios');
const logger = require('./logger');
const { HTTP_STATUS } = require('shared').constants;

class HealthChecker {
    constructor() {
        this.checks = [];
    }

    addCheck(name, checkFn) {
        console.log("addCheck", name, checkFn)
        this.checks.push({ name, checkFn });
    }

    async performChecks() {
        const results = [];
        let isHealthy = true;
        console.log("checks", this.checks)
        for (const check of this.checks) {
            try {
                await check.checkFn();
                results.push({ 
                    name: check.name, 
                    status: 'healthy' 
                });
            } catch (error) {
                logger.error(`Health check failed for ${check.name}: ${error.message}`);
                results.push({ 
                    name: check.name, 
                    status: 'unhealthy',
                    error: error.message 
                });
                isHealthy = false;
            }
        }

        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            checks: results,
            timestamp: new Date().toISOString()
        };
    }

    // Database health check example
    async dbHealthCheck() {
        try {
            // Add actual DB check logic here
            return { status: 'healthy' };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }
}

module.exports = new HealthChecker();