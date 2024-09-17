// app.js
const { FRONTEND_URL, PORT } = require('./config/config');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const promotionRoutes = require('./routes/promotionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const carritoRoutes = require("./routes/carritoRoutes")
const direccionRoutes = require("./routes/direccionRoutes")
const orderRoutes = require('./routes/pedidoRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Usar las rutas de promociones
app.use('/promotions', promotionRoutes);

app.use('/auth', userRoutes);

// Rutas de productos
app.use('/productos', productRoutes);
app.use("/categories", categoryRoutes)
app.use('/carrito', carritoRoutes);
app.use('/direccion', direccionRoutes);

// Rutas protegidas por autenticación
app.use('/pedidos', orderRoutes);

const port = PORT || 9000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
