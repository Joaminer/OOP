const bcrypt = require('bcrypt');

// Hash de la contraseña
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Comparar contraseñas
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
