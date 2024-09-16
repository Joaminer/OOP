
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const direccionController = require('../controllers/direccionController');

router.post('/add', authMiddleware, direccionController.addDireccion);
router.put('/update', authMiddleware, direccionController.updateDireccion);
router.delete('/delete', authMiddleware, direccionController.deleteDireccion);

module.exports = router;