const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:id', authController.verifyUser);

module.exports = router;