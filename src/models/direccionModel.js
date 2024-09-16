// models/direccionModel.js

const db = require('../config/dbConfig'); // Asume que tienes un archivo para la conexión a la base de datos

const addDireccion = async (usuarioId, calle, ciudad, provincia, codigo_postal, pais) => {
  const query = `INSERT INTO direcciones (usuario_id, calle, ciudad, provincia, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await db.query(query, [usuarioId, calle, ciudad, provincia, codigo_postal, pais]);
  return result.insertId;
};

const updateDireccion = async (direccionId, usuarioId, calle, ciudad, provincia, codigo_postal, pais) => {
  const query = `UPDATE direcciones SET calle = ?, ciudad = ?, provincia = ?, codigo_postal = ?, pais = ? WHERE id = ? AND usuario_id = ?`;
  const [result] = await db.query(query, [calle, ciudad, provincia, codigo_postal, pais, direccionId, usuarioId]);
  return result.affectedRows > 0;
};

const deleteDireccion = async (direccionId, usuarioId) => {
  const query = `DELETE FROM direcciones WHERE id = ? AND usuario_id = ?`;
  const [result] = await db.query(query, [direccionId, usuarioId]);
  return result.affectedRows > 0;
};

module.exports = {
  addDireccion,
  updateDireccion,
  deleteDireccion
};
