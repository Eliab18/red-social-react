// postRoutes.js
const express = require('express');
const { createPost, getPosts, deletePostById } = require('../controllers/postController'); // Added deletePostById
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function(io) { // Changed to a function that accepts io
  const router = express.Router(); // Create router instance inside the function

  // Pass io to the createPost controller function
  router.post('/', authMiddleware, (req, res) => {
    createPost(req, res, io); // Pass io here
  });
  router.get('/', authMiddleware, getPosts);

  // Add the new DELETE route
  // Note: If deletePostById needed `io` for real-time updates, it would be:
  // router.delete('/:id', authMiddleware, (req, res) => deletePostById(req, res, io));
  // But for now, `deletePostById` does not take `io`.
  router.delete('/:id', authMiddleware, deletePostById);

  return router; // Return the configured router
};