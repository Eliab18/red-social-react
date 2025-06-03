
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de ajustar la ruta según tu estructura de carpetas

const registerUser = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const trimmedPassword = password.trim();
  console.log('Contraseña original (después de trim):', `"${trimmedPassword}"`);

  // Crear el nuevo usuario sin encriptar la contraseña
  const newUser = new User({
    username,
    email,
    password: trimmedPassword, // No encriptar la contraseña
  });

  // Guardar el nuevo usuario
  newUser.save()
    .then(user => res.status(201).json({ message: 'Usuario registrado con éxito', user }))
    .catch(err => res.status(500).json({ message: 'Error al registrar el usuario', error: err }));
};



const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user || user.password !== req.body.password.trim()) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { registerUser, loginUser };
