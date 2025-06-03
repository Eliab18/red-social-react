const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Eliminar el middleware 'pre' que encriptaba la contraseña
// Esto es el cambio clave para evitar la encriptación
userSchema.methods.matchPassword = async function(enteredPassword) {
  return this.password === enteredPassword; // Comparación sin encriptación
};

// Crear y exportar el modelo
module.exports = mongoose.model('User', userSchema);
