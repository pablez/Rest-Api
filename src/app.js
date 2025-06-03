// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/database');

// Importar los routers
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta de prueba (mantener si quieres)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Usar los routers
// Prefijo '/api' para todas las rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes); // Estas serán protegidas más adelante

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});