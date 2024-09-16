const {STRIPE_SECRET_KEY} = require('./config');
const stripe = require('stripe')(STRIPE_SECRET_KEY); // Asegúrate de tener tu clave secreta en las variables de entorno
module.exports = stripe;
