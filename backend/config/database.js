// backend/config/database.js
require('dotenv').config(); // Cargar las variables de entorno

const mongoose = require('mongoose');

const dbUri = process.env.MONGO_URI;  // Usar la variable de entorno definida en el archivo .env

if (!dbUri) {
  console.log("La URI de MongoDB no está definida correctamente.");
} else {
  mongoose.connect(dbUri)
    .then(() => console.log("Conexión exitosa a MongoDB 🎉"))
    .catch((err) => console.log("Error de conexión a MongoDB:", err));
}

module.exports = mongoose; // Exportar la conexión
