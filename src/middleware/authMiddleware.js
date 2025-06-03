// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Necesario para verificar el usuario en la DB

// Carga la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token está en los headers (formato: Bearer TOKEN)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token de la cabecera 'Bearer TOKEN'
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Buscar el usuario en la base de datos (excluyendo la contraseña)
      // Asigna el usuario a `req.usuario` para que esté disponible en los controladores
      req.usuario = await Usuario.findById(decoded.id).select('-password');

      if (!req.usuario) {
        return res.status(401).json({ message: 'Token inválido, usuario no encontrado' });
      }

      next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
      console.error('Error en el middleware de autenticación:', error.message);
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado' });
      }
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Token inválido' });
      }
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

module.exports = { protect };