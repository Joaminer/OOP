// models/promotionModel.js
const db = require("../config/dbConfig");

// Verificar si una promoción existe por su ID
const getPromotionById = async (promocionId) => {
    const [rows] = await db.query("SELECT * FROM promociones WHERE id = ?", [
        promocionId,
    ]);
    return rows.length > 0 ? rows[0] : null;
};

// Crear una nueva promoción
const createPromotion = async (
    nombre,
    descripcion,
    descuento,
    fecha_inicio,
    fecha_fin
) => {
    const [result] = await db.query(
        `INSERT INTO promociones (nombre, descripcion, descuento, fecha_inicio, fecha_fin)
       VALUES (?, ?, ?, ?, ?)`,
        [nombre, descripcion, descuento, fecha_inicio, fecha_fin]
    );
    return result.insertId;
};

// Asociar productos a una promoción
const associateProductsToPromotion = async (promocionId, productosIds) => {
    const values = productosIds.map((productoId) => [promocionId, productoId]);
    await db.query(
        `INSERT INTO producto_promocion (promocion_id, producto_id) VALUES ?`,
        [values]
    );
};

module.exports = {
    createPromotion,
    associateProductsToPromotion,
    getPromotionById,
};
