const express = require('express');
// const categoryController = require('../controllers/category.controller');
// const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
// router.get('/', categoryController.getAllCategories);
// router.get('/:slug', categoryController.getCategory);

// // Protected routes
// router.use(authMiddleware.protect);
// router.use(authMiddleware.restrictTo('admin'));

// router.post('/', categoryController.createCategory);
// router.patch('/:id', categoryController.updateCategory);
// router.delete('/:id', categoryController.deleteCategory);

module.exports = router;