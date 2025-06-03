// src/controllers/productoController.js
const Producto = require('../models/Producto');

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    if (error.code === 11000) { // Código de error de MongoDB para duplicados (nombre único)
      return res.status(400).json({ message: 'El nombre del producto ya existe.', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// Actualizar un producto por ID
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado exitosamente', producto: productoActualizado });
  } catch (error) {
    if (error.code === 11000) { // Código de error de MongoDB para duplicados (nombre único)
      return res.status(400).json({ message: 'El nombre del producto ya existe.', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto por ID
exports.deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};