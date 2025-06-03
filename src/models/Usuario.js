// src/models/Usuario.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Necesario para encriptar la contraseña

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // Asumimos que el username también debe ser único
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Restricción: el email debe ser único [cite: 1]
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Por favor, introduce un email válido'] // Validación básica de email
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'La contraseña debe tener al menos 10 caracteres'] // Restricción: password > 10 caracteres [cite: 1]
  },
  cargo: {
    type: String,
    required: true,
    enum: ['administrador', 'vendedor', 'almacenero'], // Ejemplo de roles, puedes ajustarlos
    trim: true
  },
}, { timestamps: true }); // Añade campos `createdAt` y `updatedAt` automáticamente

// Middleware de Mongoose para encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);