// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/user');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validación básica
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    const newPost = new Post({
      content: content.trim(),
      user: req.user.userId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error al crear post:', error);
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