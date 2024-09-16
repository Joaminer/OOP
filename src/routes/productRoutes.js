const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas protegidas de productos
router.get('/products', productController.getFilteredProducts);
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
// Ruta para asignar una promoción a un producto existente
router.post('/promocion', productController.assignPromotionToProduct);


module.exports = router;
