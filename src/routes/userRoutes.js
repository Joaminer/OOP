const express = require('express');
const { 
  registerUser, 
  confirmEmail, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
   
} = require('../controllers/userController');

const router = express.Router();

// Registro y confirmación de usuario
router.post('/register', registerUser);
router.get('/confirm/:token', confirmEmail);

// Autenticación (login/logout)
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Olvidé mi contraseña y restablecerla
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);



module.exports = router;
