// src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Ruta para crear un nuevo producto
// POST /api/productos
router.post('/', productoController.createProducto);

// Ruta para obtener todos los productos
// GET /api/productos
router.get('/', productoController.getAllProductos);

// Ruta para obtener un producto por ID
// GET /api/productos/:id
router.get('/:id', productoController.getProductoById);

// Ruta para actualizar un producto por ID
// PUT /api/productos/:id
router.put('/:id', productoController.updateProducto);

// Ruta para eliminar un producto por ID
// DELETE /api/productos/:id
router.delete('/:id', productoController.deleteProducto);

module.exports = router;