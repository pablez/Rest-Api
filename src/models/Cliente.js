// src/models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // Restricción: nombre es obligatorio [cite: 1]
    trim: true
  },
  nit: {
    type: String,
    required: false, // Asumimos que puede ser opcional si no se tiene un NIT
    minlength: [8, 'El NIT debe tener al menos 8 dígitos o caracteres'], // Restricción: nit > 8 digitos/caracteres [cite: 1]
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema);