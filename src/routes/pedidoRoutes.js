const express = require('express');
const orderController = require('../controllers/pedidoController');
const router = express.Router();

// Ruta para crear un pedido
router.post('/crear', orderController.crearPedido);

module.exports = router;
