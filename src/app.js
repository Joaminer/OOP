// app.js
const { FRONTEND_URL, PORT } = require('./config/config');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");

const promotionRoutes = require('./routes/promotionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const carritoRoutes = require("./routes/carritoRoutes")
const direccionRoutes = require("./routes/direccionRoutes")
const orderRoutes = require('./routes/pedidoRoutes');

app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Usar las rutas de promociones
app.use('/api/promotions', promotionRoutes);

app.use('/api/auth', userRoutes);

// Rutas de productos
app.use('/api/productos', productRoutes);
app.use("/api/categories", categoryRoutes)
app.use('/api/carrito', carritoRoutes);
app.use('/api/direccion', direccionRoutes);

// Rutas protegidas por autenticación
app.use('/api/pedidos', orderRoutes);

const port = PORT || 9000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
