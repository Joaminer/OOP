const { body, validationResult } = require('express-validator');

// Validar registro de usuario
const validateRegister = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('Apellido es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegister
};
