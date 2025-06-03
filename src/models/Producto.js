// src/models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true, // Restricción: nombre de producto debe ser único [cite: 1]
    trim: true
  },
  precio_compra: {
    type: Number,
    required: true,
    min: [0.01, 'El precio de compra debe ser mayor a 0'] // Restricción: precio_compra > 0 [cite: 1]
  },
  precio_venta: {
    type: Number,
    required: true,
    min: [0, 'El precio de venta nunca puede ser negativo'] // Restricción: precio_venta nunca negativo (puede ser cero) [cite: 1]
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'El stock nunca puede ser negativo'] // Restricción: stock nunca negativo [cite: 1]
  },
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);