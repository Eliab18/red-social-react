// postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function(io) { // Changed to a function that accepts io
  const router = express.Router(); // Create router instance inside the function

  // Pass io to the createPost controller function
  router.post('/', authMiddleware, (req, res) => {
    createPost(req, res, io); // Pass io here
  });
  router.get('/', authMiddleware, getPosts);

  return router; // Return the configured router
};