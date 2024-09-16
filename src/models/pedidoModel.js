const pool = require('../config/dbConfig');

const crearPedido = async (usuarioId, direccionId, total) => {
  const [result] = await pool.query(
    `INSERT INTO pedidos (usuario_id, direccion_id, total, estado) VALUES (?, ?, ?, 'pendiente')`,
    [usuarioId, direccionId, total]
  );
  return result.insertId;
};

const agregarProductoAlPedido = async (pedidoId, productoId, cantidad, precio) => {
  await pool.query(
    `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)`,
    [pedidoId, productoId, cantidad, precio]
  );
};

module.exports = {
  crearPedido,
  agregarProductoAlPedido
};
