// postRoutes.js
const express = require('express');
const { createPost, getPosts, deletePostById, updatePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists (duplicate from controller, consider centralizing this logic if possible)
const uploadDir = path.join(__dirname, '..', 'uploads', 'post_photos');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration (similar to controller)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to backend/uploads/post_photos
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = function(io) {
  const router = express.Router();

  // Update the POST route for creating posts:
  // - Use `upload.array('photos', 5)` middleware to handle up to 5 files uploaded with the field name 'photos'.
  // - Then, call the `createPost` controller function.
  router.post('/', authMiddleware, upload.array('photos', 5), (req, res) => {
    createPost(req, res, io); // req.files will now be available in createPost
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