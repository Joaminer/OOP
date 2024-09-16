const db = require('../config/dbConfig');

// Obtener un usuario por correo electrónico
const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

// Crear un nuevo usuario
const createUser = async (userData) => {
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, apellido, email, contrasena, telefono, tipo) VALUES (?, ?, ?, ?, ?, ?)',
    [userData.nombre, userData.apellido, userData.email, userData.contrasena, userData.telefono, userData.tipo]
  );
  return result.insertId;
};

// Obtener un usuario por ID
const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

// Actualizar el estado del usuario
const updateUserStatus = async (id, habilitado) => {
  await db.query('UPDATE usuarios SET habilitado = ? WHERE id = ?', [habilitado, id]);
};

// Actualizar la contraseña del usuario
const updatePassword = async (id, contrasena) => {
  await db.query('UPDATE usuarios SET contrasena = ? WHERE id = ?', [contrasena, id]);
};


module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  updateUserStatus,
  updatePassword
};
