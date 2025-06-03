// controllers/postController.js
const Post = require('../models/Post');
// User model is needed for population if not already required, but it seems it's not used in createPost directly for now.
// Let's ensure the saved post is populated before emitting.

exports.createPost = async (req, res, io) => { // io is now a parameter
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    let newPost = new Post({
      content: content.trim(),
      user: req.user.userId
    });

    let savedPost = await newPost.save();

    // Populate user details for the response and socket emission
    savedPost = await Post.findById(savedPost._id).populate('user', 'username');

    // Emit the new post to all connected clients
    if (io && savedPost) { // Check if io and savedPost exist
      io.emit('new_post', savedPost);
      console.log('Emitted new_post event with post ID:', savedPost._id); // For server-side logging
    } else {
      console.error('Socket.IO instance (io) is undefined or savedPost is null in createPost.');
    }

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    // Avoid emitting on error
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};