require('dotenv').config();  // Asegúrate de que dotenv esté cargado al inicio

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = 8080; // Asegúrate de usar un puerto diferente al del frontend

// Middleware para parsear JSON
app.use(express.json());  // Necesario para que req.body funcione

// Habilitar CORS para todas las rutas
app.use(cors());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de publicaciones
app.use("/api/posts", postRoutes);

// Ruta principal para ver si el servidor está funcionando
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando y conectado a MongoDB! 🚀");
});

// Obtener la URI de MongoDB desde las variables de entorno
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error("La URI de MongoDB no está definida en el archivo .env");
  process.exit(1);  // Terminar el proceso si no se encuentra la URI
}

mongoose.connect(dbUri)  // Usa la URI de MongoDB de las variables de entorno
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.error('Error al conectar a la base de datos:', error));

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
