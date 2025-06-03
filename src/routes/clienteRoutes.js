// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Ruta para crear un nuevo cliente
// POST /api/clientes
router.post('/', clienteController.createCliente);

// Ruta para obtener todos los clientes
// GET /api/clientes
router.get('/', clienteController.getAllClientes);

// Ruta para obtener un cliente por ID
// GET /api/clientes/:id
router.get('/:id', clienteController.getClienteById);

// Ruta para actualizar un cliente por ID
// PUT /api/clientes/:id
router.put('/:id', clienteController.updateCliente);

// Ruta para eliminar un cliente por ID
// DELETE /api/clientes/:id
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;