// controllers/direccionController.js

const direccionModel = require('../models/direccionModel');

const addDireccion = async (req, res) => {
  const userId = req.user.id;
  const { calle, ciudad, provincia, codigo_postal, pais } = req.body;

  try {
    const direccionId = await direccionModel.addDireccion(userId, calle, ciudad, provincia, codigo_postal, pais);
    res.status(201).json({ message: 'Dirección agregada con éxito', direccionId });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la dirección' });
  }
};

// controllers/direccionController.js

const updateDireccion = async (req, res) => {
    const userId = req.user.id;
    const { direccionId, calle, ciudad, provincia, codigo_postal, pais } = req.body;
  
    try {
      const updated = await direccionModel.updateDireccion(direccionId, userId, calle, ciudad, provincia, codigo_postal, pais);
      if (updated) {
        res.status(200).json({ message: 'Dirección actualizada con éxito' });
      } else {
        res.status(404).json({ error: 'Dirección no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la dirección' });
    }
  };

  // controllers/direccionController.js

const deleteDireccion = async (req, res) => {
    const userId = req.user.id;
    const { direccionId } = req.body;
  
    try {
      const deleted = await direccionModel.deleteDireccion(direccionId, userId);
      if (deleted) {
        res.status(200).json({ message: 'Dirección eliminada con éxito' });
      } else {
        res.status(404).json({ error: 'Dirección no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la dirección' });
    }
  };

module.exports={
    deleteDireccion,
    addDireccion,
    updateDireccion
}