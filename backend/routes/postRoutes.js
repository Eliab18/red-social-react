// postRoutes.js
const express = require('express');
const { createPost, getPosts, deletePostById, updatePost } = require('../controllers/postController'); // Added deletePostById and updatePost
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = function(io) { // Changed to a function that accepts io
  const router = express.Router(); // Create router instance inside the function

  // Pass io to the createPost controller function
  router.post('/', authMiddleware, (req, res) => {
    createPost(req, res, io); // Pass io here
  });
  router.get('/', authMiddleware, getPosts);

  // Route for deleting a post, now passing io
  router.delete('/:id', authMiddleware, (req, res) => {
    deletePostById(req, res, io); // Pass io here
  });
  // Route for updating a post, now passing io
  router.put('/:id', authMiddleware, (req, res) => {
    updatePost(req, res, io); // Pass io here
  });

  return router; // Return the configured router
};