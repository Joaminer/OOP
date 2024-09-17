const db = require('../config/dbConfig');

// Obtener todos los productos
const getAllProducts = async () => {
  const [rows] = await db.query('SELECT * FROM productos');
  return rows;
};

// Obtener un producto por ID
const getProductById = async (id) => {
  const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
};

// Crear un producto
const createProduct = async ({ nombre, descripcion, precio, stock, imagen }) => {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)', 
      [nombre, descripcion, precio, stock, imagen]
    );
    return result.insertId; // Retornamos el ID del nuevo producto
  };

// Actualizar un producto por ID
const updateProduct = async (id, product) => {
  const { nombre, descripcion, precio, stock, imagen } = product;
  const [result] = await db.query(
    'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, fecha_actualizacion = NOW() WHERE id = ?',
    [nombre, descripcion, precio, stock, imagen, id]
  );
  return result.affectedRows > 0;
};

// Eliminar un producto por ID
const deleteProduct = async (id) => {
  const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
const getProductsByCategory = async (categoryId) => {
    const [rows] = await db.query(`
      SELECT p.*
      FROM productos p
      JOIN producto_categoria pc ON p.id = pc.producto_id
      WHERE pc.categoria_id = ?
    `, [categoryId]);
    return rows;
  };
  
  const getProductsByPromotion = async (promotionId) => {
    const [rows] = await db.query(`
      SELECT p.*
      FROM productos p
      JOIN producto_promocion pp ON p.id = pp.producto_id
      WHERE pp.promocion_id = ?
    `, [promotionId]);
    return rows;
  };
  
  const getProductsByPriceRange = async (minPrice, maxPrice) => {
    const [rows] = await db.query(`
      SELECT * 
      FROM productos 
      WHERE precio BETWEEN ? AND ?
    `, [minPrice, maxPrice]);
    return rows;
  };
  const getProductsWithPagination = async (filters, page, limit, sortBy, sortOrder) => {
    const offset = (page - 1) * limit;
  
    let query = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, 
        GROUP_CONCAT(DISTINCT c.nombre) AS categorias,
        MAX(CASE 
          WHEN pr.fecha_inicio <= NOW() AND pr.fecha_fin >= NOW() THEN pr.descuento
          ELSE 0 
        END) AS descuento
      FROM productos p
      LEFT JOIN producto_categoria pc ON p.id = pc.producto_id
      LEFT JOIN categorias c ON pc.categoria_id = c.id
      LEFT JOIN producto_promocion pp ON p.id = pp.producto_id
      LEFT JOIN promociones pr ON pp.promocion_id = pr.id
      WHERE 1=1
    `;
  
    const params = [];
  
    // Filtro por categoría
    if (filters.categoryId && filters.categoryId.length > 0) {
      query += ' AND c.id IN (?)';
      params.push(filters.categoryId);
    }
  
    // Filtro por promoción, asegurando que la promoción esté activa
    const currentDate = new Date();
    if (filters.promotionId && filters.promotionId.length > 0) {
      query += ' AND pr.id IN (?) AND pr.fecha_inicio <= ? AND pr.fecha_fin >= ?';
      params.push(filters.promotionId, currentDate, currentDate);
    } else {
      query += ' AND (pr.fecha_inicio <= ? AND pr.fecha_fin >= ? OR pr.fecha_inicio IS NULL)';
      params.push(currentDate, currentDate);
    }
  
    // Filtro por rango de precios
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query += ' AND p.precio BETWEEN ? AND ?';
      params.push(filters.minPrice, filters.maxPrice);
    }
  
    // Agrupar por producto y paginar
    query += ` GROUP BY p.id ORDER BY p.${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
  
    try {
      const [rows] = await db.query(query, params);
  
      // Procesar resultados para calcular precios con descuento
      const processedRows = rows.map(row => {
        const descuento = row.descuento || 0;
        const precioOriginal = parseFloat(row.precio); // Asegúrate de que el precio sea un número
        const precioConDescuento = descuento > 0 ? precioOriginal * (1 - descuento / 100) : precioOriginal;
  
        return {
          ...row,
          categorias: row.categorias ? row.categorias.split(',') : [],
          precioOriginal,
          precioConDescuento
        };
      });
  
      return processedRows;
    } catch (error) {
      console.error('Error al obtener productos con paginación:', error);
      throw error;
    }
  };
  
  
  const getTotalProductsCount = async (filters) => {
    let query = `SELECT COUNT(DISTINCT p.id) as count
      FROM productos p
      LEFT JOIN producto_categoria pc ON p.id = pc.producto_id
      LEFT JOIN categorias c ON pc.categoria_id = c.id
      LEFT JOIN producto_promocion pp ON p.id = pp.producto_id
      LEFT JOIN promociones pr ON pp.promocion_id = pr.id
      WHERE 1=1`;
    const params = [];
  
    // Filtro por categoría
    if (filters.categoryId && filters.categoryId.length > 0) {
      query += ' AND c.id IN (?)';
      params.push(filters.categoryId);
    }
  
    // Filtro por promoción, asegurando que la promoción esté activa
    const currentDate = new Date();
    if (filters.promotionId && filters.promotionId.length > 0) {
      query += ' AND pr.id IN (?) AND pr.fecha_inicio <= ? AND pr.fecha_fin >= ?';
      params.push(filters.promotionId, currentDate, currentDate);
    } else {
      // Si no se filtra por promoción, solo contar las promociones activas
      query += ' AND (pr.fecha_inicio <= ? AND pr.fecha_fin >= ? OR pr.fecha_inicio IS NULL)';
      params.push(currentDate, currentDate);
    }
  
    // Filtro por rango de precios
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query += ' AND p.precio BETWEEN ? AND ?';
      params.push(filters.minPrice, filters.maxPrice);
    }
  
    try {
      const [rows] = await db.query(query, params);
      return rows[0].count;
    } catch (error) {
      console.error('Error al contar productos:', error);
      throw error;
    }
  };
  const actualizarStock = async (productoId, cantidadVendida) => {
    const query = 'UPDATE productos SET stock = stock - ? WHERE id = ?';
    await db.execute(query, [cantidadVendida, productoId]);
  }
  

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByPromotion,
  getProductsByPriceRange,
  getProductsWithPagination,
  getTotalProductsCount,
  actualizarStock

};
