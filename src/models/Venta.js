// src/models/Venta.js
const mongoose = require('mongoose');


const ventaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto', // Referencia al modelo Producto
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente', // Referencia al modelo Cliente
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo Usuario (quien realizó la venta)
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad vendida siempre debe ser mayor a cero'] // Restricción: cantidad > 0 [cite: 2]
  },
  precio_unitario: {
    type: Number,
    required: true,
    min: [0, 'El precio unitario no puede ser negativo']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total de la venta no puede ser negativo']
  },
}, { timestamps: true });

// Middleware de Mongoose para calcular el total antes de guardar
// ventaSchema.pre('save', function(next) {
//   this.total = this.cantidad * this.precio_unitario;
//   next();
// });

module.exports = mongoose.model('Venta', ventaSchema);