const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Ruta para crear una nueva promoción
router.post('/create', promotionController.createPromotion);

module.exports = router;
