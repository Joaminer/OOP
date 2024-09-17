const express = require('express');
const orderController = require('../controllers/pedidoController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear un pedido
router.post('/crear',authMiddleware, orderController.crearPedido);

module.exports = router;
