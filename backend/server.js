require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const http = require('http'); // Added
const { Server } = require("socket.io"); // Added

const authRoutes = require("./routes/authRoutes");
const initializePostRoutes = require("./routes/postRoutes"); // New way

const app = express();
const httpServer = http.createServer(app); // Added
const PORT = process.env.PORT || 8080; // Use environment variable for port

// Initialize Socket.IO
const io = new Server(httpServer, { // Added
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para todas las rutas HTTP
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173" // Use environment variable for frontend URL
}));

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de publicaciones
const postRoutes = initializePostRoutes(io); // Pass io instance
app.use("/api/posts", postRoutes);

// Ruta principal para ver si el servidor está funcionando
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando y conectado a MongoDB! 🚀");
});

// Socket.IO connection event (Added)
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error("La URI de MongoDB no está definida en el archivo .env");
  process.exit(1);
}

mongoose.connect(dbUri)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.error('Error al conectar a la base de datos:', error));

// Start the HTTP server instead of the Express app directly
httpServer.listen(PORT, () => { // Modified
  console.log(`Servidor en ejecución en http://localhost:${PORT} y WebSocket escuchando`);
});
