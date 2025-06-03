// src/routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { protect } = require('../middleware/authMiddleware');

// Rutas de Venta (Estas rutas serán protegidas con JWT más adelante)

// Ruta para crear una nueva venta
// POST /api/ventas
router.post('/',protect, ventaController.createVenta);

// Ruta para obtener todas las ventas
// GET /api/ventas
router.get('/',protect, ventaController.getAllVentas);

// Ruta para obtener una venta por ID
// GET /api/ventas/:id
router.get('/:id',protect, ventaController.getVentaById);

// Ruta para actualizar una venta por ID
// PUT /api/ventas/:id
router.put('/:id',protect, ventaController.updateVenta);

// Ruta para eliminar una venta por ID
// DELETE /api/ventas/:id
router.delete('/:id',protect, ventaController.deleteVenta);

module.exports = router;