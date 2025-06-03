// controllers/postController.js
const Post = require('../models/Post');

exports.createPost = async (req, res, io) => {
  console.log('[CREATE_POST_DEBUG] Entered createPost function.'); // New log

  try {
    const { content } = req.body;
    console.log('[CREATE_POST_DEBUG] Request body content:', content); // New log
    
    if (!content || content.trim().length === 0) {
      console.log('[CREATE_POST_DEBUG] Content validation failed.'); // New log
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    console.log('[CREATE_POST_DEBUG] User ID from req.user:', req.user.userId); // New log
    let newPost = new Post({
      content: content.trim(),
      user: req.user.userId
    });

    console.log('[CREATE_POST_DEBUG] Attempting to save new post...'); // New log
    let savedPost = await newPost.save();
    console.log('[CREATE_POST_DEBUG] Post saved, ID:', savedPost._id); // New log
    
    console.log('[CREATE_POST_DEBUG] Attempting to populate user details for the saved post...'); // New log
    // Ensure 'populate' is chained correctly if it wasn't returning the document
    let populatedPost = await Post.findById(savedPost._id).populate('user', 'username');
    
    if (!populatedPost) {
      console.error('[CREATE_POST_DEBUG] CRITICAL: Populated post is null or undefined. Original savedPost ID:', savedPost._id);
      // If populatedPost is null, we should not proceed to emit, handle error appropriately
      return res.status(500).json({ message: 'Error interno del servidor al popular el post.' });
    }
    console.log('[CREATE_POST_DEBUG] Post populated, user:', populatedPost.user); // New log

    console.log('[CREATE_POST_DEBUG] Checking io object before emit. Is io defined?', !!io); // New log
    if (io) {
      console.log('[CREATE_POST_DEBUG] io.emit type:', typeof io.emit); // New log
    }

    console.log('[CREATE_POST_DEBUG] Checking populatedPost before emit. Is populatedPost defined?', !!populatedPost); // New log

    if (io && populatedPost) {
      console.log('[CREATE_POST_DEBUG] Attempting to emit new_post event...'); // New log
      io.emit('new_post', populatedPost); // Use populatedPost
      console.log('[SUCCESS_EMIT] Emitted new_post event with post ID:', populatedPost._id); // Changed log for clarity
    } else {
      console.error('[CREATE_POST_DEBUG] CRITICAL: Socket.IO instance (io) is undefined OR populatedPost is null.');
      if (!io) console.error('[CREATE_POST_DEBUG] io object is falsy.');
      if (!populatedPost) console.error('[CREATE_POST_DEBUG] populatedPost object is falsy.');
    }

    res.status(201).json(populatedPost); // Send populatedPost in response
  } catch (error) {
    console.error('[CREATE_POST_DEBUG] ERROR in createPost:', error.message); // New log
    console.error('[CREATE_POST_DEBUG] ERROR stack:', error.stack); // New log
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// getPosts remains the same
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