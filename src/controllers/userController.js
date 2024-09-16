const userModel = require('../models/userModel');
const carritoModel = require('../models/carritoModel');
const { hashPassword ,comparePassword} = require('../utils/hashUtils');
const { generateToken, verifyToken } = require('../utils/authUtils');
const sendEmail = require('../utils/emailUtils');
const {BACKEND_URL} = require('../config/config');

const registerUser = async (req, res) => {
  const { nombre, apellido, email, contrasena, telefono } = req.body;

  try {
    let tipo = "usuario";
    // Verificar si el usuario ya existe
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(contrasena);

    // Crear el usuario
    const userId = await userModel.createUser({
      nombre,
      apellido,
      email,
      contrasena: hashedPassword,
      telefono,
      tipo,
    });
    console.log("hola")
    // Crear un carrito para el nuevo usuario
    await carritoModel.createCarrito(userId);
    console.log("hola")

    // Generar un token de verificación
    const verificationToken = generateToken({ id: userId, email }, '1h'); // Expira en 1 hora

    // Enviar correo de confirmación
    const confirmationLink = `${BACKEND_URL}/api/auth/confirm/${verificationToken}`;
    await sendEmail(email, 'Confirma tu correo electrónico', `
      <h1>Confirma tu correo electrónico</h1>
      <p>Haz clic en el enlace a continuación para confirmar tu correo:</p>
      <a href="${confirmationLink}">Confirmar correo</a>
    `);

    res.status(201).json({ message: 'Registro exitoso, por favor revisa tu correo para confirmar tu cuenta.' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// Confirmar el correo electrónico
const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {

    const decoded = verifyToken(token);
    console.log(decoded)

    const userId = decoded.id;

    // Habilitar el usuario
    await userModel.updateUserStatus(userId, true);

    res.status(200).json({ message: 'Correo confirmado exitosamente, tu cuenta ahora está activa.' });
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};

const loginUser = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    if (!user.habilitado) {
      return res.status(403).json({ error: 'Tu cuenta aún no ha sido confirmada. Por favor, revisa tu correo electrónico.' });
    }

    const isPasswordValid = await comparePassword(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    // Configurar la cookie JWT en la respuesta
    res.cookie('token', token, {
      httpOnly: true, // No accesible por JavaScript en el frontend
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'Strict', // Prevenir CSRF
      maxAge: 3600000 // 1 hora (puedes ajustar este tiempo)
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
const logoutUser = (req, res) => {
  try {
    // Eliminar la cookie que contiene el token JWT
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cerrar la sesión.' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo electrónico.' });
    }

    // Generar un token de restablecimiento de contraseña
    const resetToken = generateToken({ id: user.id, email }, '1h'); // Expira en 1 hora

    // Enviar el correo con el enlace para restablecer la contraseña
    const resetLink = `${BACKEND_URL}/api/auth/reset-password/${resetToken}`;
    await sendEmail(email, 'Restablecer contraseña', `
      <h1>Restablece tu contraseña</h1>
      <p>Haz clic en el enlace a continuación para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
    `);

    res.status(200).json({ message: 'Correo enviado. Por favor, revisa tu bandeja de entrada para restablecer tu contraseña.' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    
    // Verificar el token
    const decoded = verifyToken(token);
    console.log(decoded)
    const userId = decoded.id;

    // Hash de la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar la contraseña en la base de datos
    await userModel.updatePassword(userId, hashedPassword);

    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};



module.exports = {
  registerUser,
  confirmEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
};
