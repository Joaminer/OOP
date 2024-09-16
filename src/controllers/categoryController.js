const categoryModel = require('../models/categoryModel');

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const createCategory = async (req, res) => {
  const { nombre } = req.body;
  try {
    const newCategoryId = await categoryModel.createCategory(nombre);
    res.status(201).json({ message: 'Categoría creada exitosamente.', categoryId: newCategoryId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
};

const assignCategory = async (req, res) => {
  const { productoId, categoriaId } = req.body;
  try {
    await categoryModel.assignCategoryToProduct(productoId, categoriaId);
    res.status(200).json({ message: 'Categoría asignada al producto exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar la categoría al producto.' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  assignCategory,
};
