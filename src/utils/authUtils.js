const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/config');

// Generar un token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
// Verificar un token JWT
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};