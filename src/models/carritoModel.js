// models/carritoModel.js
const db = require("../config/dbConfig")

const createCarrito = async (usuarioId) => {
    const query = `INSERT INTO carritos (usuario_id) VALUES (?)`;
    await db.query(query, [usuarioId]);
  };
  
  const getCarritoByUserId = async (usuarioId) => {
    const query = `
      SELECT cp.producto_id, p.nombre, p.precio, cp.cantidad 
      FROM carrito_producto cp
      JOIN productos p ON cp.producto_id = p.id
      WHERE cp.carrito_id = (SELECT id FROM carritos WHERE usuario_id = ?)
    `;
    const [rows] = await db.query(query, [usuarioId]);
    return rows;
  };
  
  const addProductToCarrito = async (carritoId, productoId, cantidad) => {
    const existingProductQuery = `SELECT * FROM carrito_producto WHERE carrito_id = ? AND producto_id = ?`;
    const [existingProduct] = await db.query(existingProductQuery, [carritoId, productoId]);
    if (existingProduct.length > 0) {
      const updateQuery = `UPDATE carrito_producto SET cantidad = cantidad + ? WHERE carrito_id = ? AND producto_id = ?`;
      await db.query(updateQuery, [cantidad, carritoId, productoId]);
    } else {
    
      const insertQuery = `INSERT INTO carrito_producto (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)`;
      await db.query(insertQuery, [carritoId, productoId, cantidad]);
    }
  };
  
  const updateProductQuantity = async (carritoId, productoId, cantidad) => {
    const query = `UPDATE carrito_producto SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?`;
    await db.query(query, [cantidad, carritoId, productoId]);
  };
  
  const removeProductFromCarrito = async (carritoId, productoId) => {
    const query = `DELETE FROM carrito_producto WHERE carrito_id = ? AND producto_id = ?`;
    await db.query(query, [carritoId, productoId]);
  };
  
  const emptyCarrito = async (carritoId) => {
    const query = `DELETE FROM carrito_producto WHERE carrito_id = ?`;
    await db.query(query, [carritoId]);
  };
  
  const calculateTotal = async (carritoId) => {
    const query = `
      SELECT SUM(p.precio * cp.cantidad) AS total
      FROM carrito_producto cp
      JOIN productos p ON cp.producto_id = p.id
      WHERE cp.carrito_id = ?
    `;
    const [rows] = await db.query(query, [carritoId]);
    return rows[0].total || 0;
  };
  const getCarritoIdByUserId = async (userId) => {
    const query = `SELECT id FROM carritos WHERE usuario_id = ?`;
    const [rows] = await db.query(query, [userId]);
  
    if (rows.length === 0) {
      // Si no existe el carrito, crear uno nuevo
      await createCarrito(userId);
      const [newRows] = await db.query(query, [userId]);
      return newRows[0].id;
    }
    
    return rows[0].id;
  };
  
  module.exports = {
    createCarrito,
    getCarritoByUserId,
    addProductToCarrito,
    updateProductQuantity,
    removeProductFromCarrito,
    emptyCarrito,
    calculateTotal,
    getCarritoIdByUserId
  };
  