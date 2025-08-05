const { getServiceConfig, getAllConfig, updateConfig } = require('../services/configService');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('shared').constants;

/**
 * Controller for handling configuration requests
 */
class ConfigController {
    /**
     * Get configuration for a specific service
     */
    static async getServiceConfig(req, res) {
        try {
            const { serviceName } = req.params;
            logger.debug(`Fetching config for service: ${serviceName}`);

            const config = getServiceConfig(serviceName);
            
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: config
            });
        } catch (error) {
            logger.error(`Failed to get service config: ${error.message}`);
            res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all configurations (protected)
     */
    static async getAllConfigs(req, res) {
        try {
            // Only allow admins to access all configs
            if (!req.user.roles.includes('admin')) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            const configs = getAllConfig();
            
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: configs
            });
        } catch (error) {
            logger.error(`Failed to get all configs: ${error.message}`);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve configurations'
            });
        }
    }

    /**
     * Update configuration (admin only)
     */
    static async updateConfig(req, res) {
        try {
            const { serviceName } = req.params;
            const updates = req.body;

            // Validate admin access
            if (!req.user.roles.includes('admin')) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            const updatedConfig = updateConfig(serviceName, updates);
            
            logger.info(`Config updated for ${serviceName} by user ${req.user.userId}`);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: updatedConfig
            });
        } catch (error) {
            logger.error(`Config update failed: ${error.message}`);
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get public configuration (unauthenticated)
     */
    static async getPublicConfig(req, res) {
        try {
            const publicConfig = {
                auth: {
                    enabled: getAllConfig().get('auth.enabled')
                },
                services: {
                    apiGateway: {
                        url: getAllConfig().get('services.apiGateway.url')
                    }
                }
            };
            
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: publicConfig
            });
        } catch (error) {
            logger.error(`Failed to get public config: ${error.message}`);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to retrieve public configuration'
            });
        }
    }
}

module.exports = ConfigController;