const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// User routes
router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

// Admin-only routes
router.use(authMiddleware.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;