// src/controllers/ventaController.js
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

// Crear una nueva venta
exports.createVenta = async (req, res) => {
  const { producto, cliente, usuario, cantidad } = req.body; // producto, cliente, usuario son ObjectIDs

  try {
    // 1. Verificar existencia de Producto, Cliente y Usuario
    const existingProducto = await Producto.findById(producto);
    if (!existingProducto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    const existingCliente = await Cliente.findById(cliente);
    if (!existingCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }
    const existingUsuario = await Usuario.findById(usuario);
    if (!existingUsuario) {
        return res.status(404).json({ message: 'Usuario (vendedor) no encontrado.' });
    }

    // 2. Validación de stock [cite: 2]
    if (existingProducto.stock < cantidad) {
      return res.status(400).json({ message: `Stock insuficiente para el producto ${existingProducto.nombre}. Stock disponible: ${existingProducto.stock}` });
    }

    // Validar que el precio de venta del producto sea un número válido
    if (typeof existingProducto.precio_venta !== 'number' || existingProducto.precio_venta <= 0) {
        console.error('Error de depuración: El producto encontrado no tiene un precio_venta válido o positivo:', existingProducto.precio_venta);
        return res.status(400).json({ message: 'Error: El producto seleccionado no tiene un precio de venta válido o positivo.' });
    }

    // Validar que la cantidad sea un número válido y positivo
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        console.error('Error de depuración: La cantidad proporcionada no es válida:', cantidad);
        return res.status(400).json({ message: 'Error: La cantidad de productos debe ser un número positivo.' });
    }

    // El precio unitario de la venta se toma del precio de venta actual del producto
    const precio_unitario = existingProducto.precio_venta;

    // Calcular el total de la venta aquí, antes de crear la instancia
    const total = cantidad * precio_unitario;

    // Opcional: Una última verificación del total calculado (útil si hay problemas con números flotantes, etc.)
    if (typeof total !== 'number' || isNaN(total) || total < 0) {
        console.error('Error de depuración: El total calculado no es un número válido:', total, ' (cantidad:', cantidad, ', precio_unitario:', precio_unitario, ')');
        return res.status(500).json({ message: 'Error interno: El total de la venta no pudo ser calculado correctamente.' });
    }


    // 3. Crear la venta
    // El precio unitario de la venta se toma del precio de venta actual del producto
    
    const nuevaVenta = new Venta({
      producto,
      cliente,
      usuario,
      cantidad,
      precio_unitario,
      total,
      fecha: new Date(), // Fecha actual
      // El 'total' se calculará automáticamente en el pre-save hook del modelo Venta
    });

    await nuevaVenta.save();

    // 4. Actualizar el stock del producto [cite: 2]
    existingProducto.stock -= cantidad;
    await existingProducto.save();

    res.status(201).json({ message: 'Venta realizada exitosamente', venta: nuevaVenta });

  } catch (error) {
    res.status(500).json({ message: 'Error al realizar la venta', error: error.message });
  }
};

// Obtener todas las ventas (con populate para ver detalles de producto, cliente, usuario)
exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('producto', 'nombre precio_venta') // Popula solo nombre y precio_venta del producto
      .populate('cliente', 'nombre nit') // Popula solo nombre y nit del cliente
      .populate('usuario', 'username cargo'); // Popula solo username y cargo del usuario
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
  }
};

// Obtener una venta por ID (con populate)
exports.getVentaById = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('producto', 'nombre precio_venta')
      .populate('cliente', 'nombre nit')
      .populate('usuario', 'username cargo');
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
  }
};

// Actualizar una venta por ID (puede ser complejo si afecta el stock original)
// Para simplificar, esta operación no permitirá cambiar la cantidad ni el producto directamente
// ya que eso implicaría revertir y aplicar cambios de stock complejos.
// Solo permitiremos actualizar campos como la fecha o notas adicionales si existieran.
// Si se necesita cambiar cantidad/producto, se debería considerar anular la venta y crear una nueva.
exports.updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        // Desestructuramos el body para evitar que se actualicen campos sensibles directamente
        const { producto, cliente, usuario, cantidad, precio_unitario, total, ...updateData } = req.body;

        // `new: true` devuelve el documento actualizado
        // `runValidators: true` asegura que las validaciones del esquema se apliquen
        const ventaActualizada = await Venta.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                                            .populate('producto', 'nombre precio_venta')
                                            .populate('cliente', 'nombre nit')
                                            .populate('usuario', 'username cargo');
        if (!ventaActualizada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json({ message: 'Venta actualizada exitosamente', venta: ventaActualizada });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la venta', error: error.message });
    }
};

// Eliminar una venta por ID (también complejo si se debe revertir el stock)
// Para este ejemplo, no se revertirá el stock automáticamente al eliminar una venta.
// En una aplicación real, esto requeriría una lógica de compensación de stock.
exports.deleteVenta = async (req, res) => {
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    // NOTA: En un sistema de producción, si se elimina una venta,
    // la lógica para revertir el stock del producto debería implementarse aquí.
    // Por simplicidad en este ejercicio, no lo haremos automáticamente,
    // pero es una consideración importante.
    res.status(200).json({ message: 'Venta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error: error.message });
  }
};