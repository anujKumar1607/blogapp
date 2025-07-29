const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPost);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

router.post('/', postController.createPost);
// router.patch('/:id', postController.updatePost);
// router.delete('/:id', postController.deletePost);

// Admin-only routes
router.use(authMiddleware.restrictTo('admin'));
//router.patch('/:id/status', postController.updatePostStatus);

module.exports = router;