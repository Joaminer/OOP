// controllers/carritoController.js

const carritoModel = require('../models/carritoModel');


const getCarrito = async (req, res) => {
  const userId = req.user.id;

  try {
    const carrito = await carritoModel.getCarritoByUserId(userId);
    res.status(200).json({ carrito });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

const addProduct = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
  const { productoId, cantidad } = req.body;

  try {
    const carrito = await carritoModel.getCarritoIdByUserId(userId);
    console.log(carrito)
    await carritoModel.addProductToCarrito(carrito, productoId, cantidad);
    res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
};

const updateProductQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productoId, cantidad } = req.body;

  try {
    const carrito = await carritoModel.getCarritoIdByUserId(userId);
    await carritoModel.updateProductQuantity(carrito, productoId, cantidad);
    res.status(200).json({ message: 'Cantidad del producto actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
  }
};

const removeProduct = async (req, res) => {
  const userId = req.user.id;
  const { productoId } = req.body;

  try {
    const carrito = await carritoModel.getCarritoIdByUserId(userId);
    await carritoModel.removeProductFromCarrito(carrito, productoId);
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};

const emptyCarrito = async (req, res) => {
  const userId = req.user.id;

  try {
    const carrito = await carritoModel.getCarritoIdByUserId(userId);
    await carritoModel.emptyCarrito(carrito);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

const getTotal = async (req, res) => {
  const userId = req.user.id;

  try {
    const carrito = await carritoModel.getCarritoIdByUserId(userId);
    const total = await carritoModel.calculateTotal(carrito);
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el total del carrito' });
  }
};

module.exports = {
  getCarrito,
  addProduct,
  updateProductQuantity,
  removeProduct,
  emptyCarrito,
  getTotal
};
