// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para registro de usuario
router.post('/register', registerUser);

// Ruta para login de usuario
router.post('/login', loginUser);


// Ruta protegida para obtener datos del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Devuelve SOLO los datos del usuario en formato plano
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;