const { verifyToken } = require('../utils/authUtils');

const authMiddleware = (req, res, next) => {
  try {
    console.log(req.cookies)
    // Verificar si existe la cookie con el token
    const token = req.cookies.token;


    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No estás autenticado.' });
    }

    // Verificar el token
    const decoded = verifyToken(token);
    
    // Añadir los datos del usuario verificado a la solicitud
    req.user = decoded;

    // Continuar con la siguiente función o ruta
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.' });
  }
};

module.exports = authMiddleware;
