// routes/carritoRoutes.js

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getCarrito,
  addProduct,
  updateProductQuantity,
  removeProduct,
  emptyCarrito,
  getTotal
} = require('../controllers/carritoController');

const router = express.Router();

router.get('/', authMiddleware, getCarrito);
router.post('/add', authMiddleware, addProduct);
router.put('/update', authMiddleware, updateProductQuantity);
router.delete('/remove', authMiddleware, removeProduct);
router.delete('/empty', authMiddleware, emptyCarrito);
router.get('/total', authMiddleware, getTotal);

module.exports = router;
