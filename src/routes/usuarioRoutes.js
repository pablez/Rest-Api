// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para crear un nuevo usuario
// POST /api/usuarios
router.post('/', usuarioController.createUsuario);

// Ruta para login de usuario (sin protección JWT aún)
// POST /api/usuarios/login
router.post('/login', usuarioController.loginUsuario);

// Ruta para obtener todos los usuarios
// GET /api/usuarios
router.get('/', usuarioController.getAllUsuarios);

// Ruta para obtener un usuario por ID
// GET /api/usuarios/:id
router.get('/:id', usuarioController.getUsuarioById);

// Ruta para actualizar un usuario por ID
// PUT /api/usuarios/:id
router.put('/:id', usuarioController.updateUsuario);

// Ruta para eliminar un usuario por ID
// DELETE /api/usuarios/:id
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;