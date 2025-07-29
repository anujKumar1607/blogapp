const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gateway.controller');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/auth/register', gatewayController.registerUser);
router.post('/auth/login', gatewayController.loginUser);
router.get('/health', gatewayController.checkHealth);
// Protected routes (require authentication)
router.use(authMiddleware.authenticate);

// User Service routes
//router.get('/health', gatewayController.checkHealth);
router.get('/users', gatewayController.getUsers);
router.get('/users/:id', gatewayController.getUserById);

// Content Service routes (to be added later)
// router.get('/posts', gatewayController.getPosts);
// router.post('/posts', gatewayController.createPost);

module.exports = router;