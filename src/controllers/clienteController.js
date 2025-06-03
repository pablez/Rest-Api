// src/controllers/clienteController.js
const Cliente = require('../models/Cliente');

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
  }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

// Actualizar un cliente por ID
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteActualizado = await Cliente.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!clienteActualizado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

// Eliminar un cliente por ID
exports.deleteCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
};