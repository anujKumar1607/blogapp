const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/configController');
const { authenticate } = require('shared').middlewares;

// Public routes
router.get('/public', ConfigController.getPublicConfig);

// Authenticated routes
router.get('/services/:serviceName', authenticate, ConfigController.getServiceConfig);

// Admin-only routes
router.get('/all', authenticate, ConfigController.getAllConfigs);
router.patch('/services/:serviceName', authenticate, ConfigController.updateConfig);

module.exports = router;