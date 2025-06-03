
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Asegúrate de ajustar la ruta según tu estructura de carpetas

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const trimmedPassword = password.trim();
  console.log('Contraseña original (después de trim):', `"${trimmedPassword}"`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

  // Crear el nuevo usuario con la contraseña encriptada
  const newUser = new User({
    username,
    email,
    password: hashedPassword, // Guardar la contraseña encriptada
  });

  // Guardar el nuevo usuario
  try {
    const user = await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: err });
  }
};



const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(req.body.password.trim(), user.password);
    if (!isMatch) {
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
