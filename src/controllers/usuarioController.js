// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Necesario para comparar contraseñas en el login

// Carga la clave secreta desde las variables de entorno (ya debería estar configurada en .env)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h'; // Define un tiempo de expiración para el token
// Crear un nuevo usuario

exports.createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    // Evitar devolver la contraseña hasheada en la respuesta
    const { password, ...usuarioSinPassword } = nuevoUsuario.toObject();
    res.status(201).json({ message: 'Usuario creado exitosamente', usuario: usuarioSinPassword });
  } catch (error) {
    if (error.code === 11000) { // Código de error de MongoDB para duplicados
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `El ${duplicatedField} ya está registrado.`, error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password'); // Excluye la contraseña
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Actualizar un usuario por ID
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body; // No permitimos actualizar la contraseña directamente aquí

    // Si se intenta actualizar la contraseña, se debe hacer a través de una ruta específica
    if (password) {
      return res.status(400).json({ message: 'Para actualizar la contraseña, use la ruta de cambio de contraseña.' });
    }

    // `new: true` devuelve el documento actualizado
    // `runValidators: true` asegura que las validaciones del esquema se apliquen
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
  } catch (error) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `El ${duplicatedField} ya está registrado.`, error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

// Eliminar un usuario por ID
exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Autenticación de usuario (Login)
exports.loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ username });

    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Si las credenciales son correctas, generar un token JWT
    const token = jwt.sign(
      { id: usuario._id, cargo: usuario.cargo }, // Payload del token: id del usuario y cargo
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } // El token expira en 1 hora
    );

    // Esta es la ÚNICA respuesta que debe enviarse desde esta función
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // ¡Asegúrate de que esta línea esté aquí para que se devuelva el token!
      usuario: {
        id: usuario._id,
        username: usuario.username,
        cargo: usuario.cargo
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};