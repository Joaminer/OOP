const promotionModel = require('../models/promotionModel');

const createPromotion = async (req, res) => {
    const { nombre, descripcion, descuento, fecha_inicio, fecha_fin, productosIds } = req.body;
  
    // Validar los campos requeridos
    if (!nombre || !descuento || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    // Función para convertir fecha en formato ISO a formato MySQL
    const formatDateForMySQL = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}`;
    };
  
    // Convertir fechas
    const formattedFechaInicio = formatDateForMySQL(fecha_inicio);
    const formattedFechaFin = formatDateForMySQL(fecha_fin);
  
    try {
      // Crear la promoción
      const promocionId = await promotionModel.createPromotion(
        nombre,
        descripcion,
        descuento,
        formattedFechaInicio,
        formattedFechaFin
      );
  
      // Asociar productos a la promoción si existen productosIds
      if (productosIds && productosIds.length > 0) {
        await promotionModel.associateProductsToPromotion(promocionId, productosIds);
      }
  
      res.status(201).json({ message: 'Promoción creada exitosamente', promocionId });
    } catch (error) {
      console.error('Error al crear promoción:', error);
      res.status(500).json({ error: 'Error al crear la promoción.' });
    }
  };
  

module.exports = {
  createPromotion,
};
