// models/categoryModel.js
const db = require('../config/dbConfig');

// Obtener todas las categorías
const getAllCategories = async () => {
  const [rows] = await db.query('SELECT * FROM categorias');
  return rows;
};

// Crear una nueva categoría
const createCategory = async (nombre) => {
  const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
  return result.insertId;
};

// Obtener categoría por ID
const getCategoryById = async (id) => {
  const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
  return rows[0];
};

// Asignar una categoría a un producto
const assignCategoryToProduct = async (productoId, categoriaId) => {
    await db.query('INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (?, ?)', [productoId, categoriaId]);
  };

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  assignCategoryToProduct,
};
