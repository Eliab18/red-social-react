// postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createPost);
router.get('/', authMiddleware, getPosts);

module.exports = router;