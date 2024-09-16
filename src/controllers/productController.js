const productModel = require('../models/productModel');

const categoryModel = require('../models/categoryModel');

const promotionModel = require('../models/promotionModel');

// Crear un nuevo producto con ofertas (promociones)
const createProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen, categorias, promociones } = req.body; 
  
  try {
    // Crear el producto
    const productId = await productModel.createProduct({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
    });

    // Asignar categorías al producto si existen
    if (categorias && categorias.length > 0) {
      for (const categoriaId of categorias) {
        await categoryModel.assignCategoryToProduct(productId, categoriaId);
      }
    }

    // Asignar promociones al producto si existen
    if (promociones && promociones.length > 0) {
      for (const promocionId of promociones) {
        await promotionModel.assignPromotionToProduct(productId, promocionId);
      }
    }

    res.status(201).json({ message: 'Producto creado exitosamente.', productId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
};


// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const productos = await productModel.getAllProducts();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await productModel.getProductById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};



// Actualizar un producto por ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen } = req.body;
  try {
    const productoActualizado = await productModel.updateProduct(id, {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
    });
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productoEliminado = await productModel.deleteProduct(id);
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};
const getFilteredProducts = async (req, res) => {
    const { categoryId, promotionId, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'nombre', sortOrder = 'ASC' } = req.query;
  
    try {
      const filters = {
        categoryId: categoryId ? categoryId.split(',') : undefined,
        promotionId: promotionId ? promotionId.split(',') : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      };
      console.log(filters)
  
      const totalProducts = await productModel.getTotalProductsCount(filters);
      console.log(totalProducts)
      const totalPages = Math.ceil(totalProducts / limit);
  
      const products = await productModel.getProductsWithPagination(filters, page, limit, sortBy, sortOrder);
  
      res.status(200).json({
        products,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages,
          totalProducts
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos.' });
    }
  };
  const assignPromotionToProduct = async (req, res) => {
    const { productoId, promocionId } = req.body;
  
    try {
      const productExists = await productModel.getProductById(productoId);
      const promotionExists = await promotionModel.getPromotionById(promocionId);
  
      if (!productExists) {
        return res.status(404).json({ error: 'El producto no existe.' });
      }
  
      if (!promotionExists) {
        return res.status(404).json({ error: 'La promoción no existe.' });
      }
  
      // Validar fechas de la promoción
      const currentDate = new Date();
      if (promotionExists.fecha_inicio > currentDate || promotionExists.fecha_fin < currentDate) {
        return res.status(400).json({ error: 'La promoción no está activa en este momento.' });
      }
  
      // Asignar la promoción al producto
      await promotionModel.assignPromotionToProduct(productoId, promocionId);
  
      res.status(200).json({ message: 'Promoción asignada al producto exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al asignar la promoción al producto.' });
    }
  };

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  assignPromotionToProduct,
};
