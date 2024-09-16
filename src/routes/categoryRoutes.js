
// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getCategories, createCategory, assignCategory } = require('../controllers/categoryController');

// Ruta para obtener todas las categorías
router.get('/', getCategories);

// Ruta para crear una nueva categoría
router.post('/', createCategory);

// Ruta para asignar una categoría a un producto
router.post('/assign-category', assignCategory);

module.exports = router;