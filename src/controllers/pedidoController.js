const carritoModel = require('../models/carritoModel');
const pedidoModel = require('../models/pedidoModel');
const productoModel = require('../models/productModel');

const crearPedido = async (req, res) => {
  try {
    const { direccionId } = req.body;
    const userId = req.user.id;  // Obtenido del JWT después de la autenticación

    // 1. Obtener el carrito del usuario
    const carrito = await carritoModel.getCarritoByUserId(userId);
    if (!carrito) {
      return res.status(400).json({ message: 'No tienes un carrito activo.' });
    }

    // 2. Obtener los productos del carrito
    const productos = await carritoModel.getProductosByCarritoId(carrito.id);
    if (productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    // 3. Verificar el stock de los productos
    let total = 0;
    for (const producto of productos) {
      if (producto.cantidad > producto.stock) {
        return res.status(400).json({ message: `Stock insuficiente para el producto ${producto.producto_id}` });
      }
      total += producto.precio * producto.cantidad;
    }

    // 4. Crear el pedido
    const pedidoId = await pedidoModel.crearPedido(userId, direccionId, total);

    // 5. Agregar los productos al pedido y actualizar el stock
    for (const producto of productos) {
      await pedidoModel.agregarProductoAlPedido(pedidoId, producto.producto_id, producto.cantidad, producto.precio);
      await productoModel.actualizarStock(producto.producto_id, producto.cantidad);
    }

    // 6. Vaciar el carrito
    await carritoModel.vaciarCarrito(carrito.id);

    return res.status(201).json({ message: 'Pedido creado con éxito.', pedidoId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el pedido.' });
  }
};

module.exports = {
  crearPedido
};
