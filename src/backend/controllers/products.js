const Category = require('../models/categories');
const Product = require('../models/products');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const getProducts = async (req, res, next) => {
  try {
    const { section, brand, style, gender, maxPrice, name } = req.query;

    const filters = {};

    if (section) {
      const category = await Category.findOne({ slug: section });
      if (!category) {
        return res.status(404).json({ message: 'Sección no encontrada' });
      }
      filters.section = category._id;
    }

    if (brand) filters.brand = brand;
    if (style) filters.style = style;
    if (gender) filters.gender = gender;
    if (maxPrice) filters.price = { $lte: Number(maxPrice) };
    if (name) filters.name = new RegExp(name, 'i');

    const products = await Product.find(filters).populate(
      'section',
      'slug normalizedName name'
    );
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json('Error al obtener productos con filtros');
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { categorySlug, id } = req.params;

    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const product = await Product.findById(id).populate('section');

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (
      !product.section ||
      product.section._id.toString() !== category._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: 'El producto no pertenece a la categoría indicada' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Product by Id');
  }
};

const postProduct = async (req, res, next) => {
  try {
    const { section, name, brand, description, price, ...rest } = req.body;

    if (!mongoose.Types.ObjectId.isValid(section)) {
      return res.status(400).json({ message: 'ID de categoría inválido' });
    }

    const category = await Category.findById(section);
    if (!category) {
      return res.status(400).json({ message: 'Categoría no encontrada' });
    }

    const duplicateCheck = {
      section,
      name,
      brand
    };

    category.extraFields.forEach((field) => {
      if (rest?.[field]) {
        duplicateCheck[field] = rest[field].trim();
      }
    });

    const existingProduct = await Product.findOne(duplicateCheck);
    if (existingProduct) {
      return res.status(409).json({ message: 'Este producto ya existe' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Falta la imagen del producto' });
    }

    const newProductData = {
      ...duplicateCheck,
      description: description.trim(),
      price: Number(price),
      image: req.file.path
    };

    const newProduct = new Product(newProductData);
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: 'El Producto se ha creado correctamente',
      producto: savedProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: 'Error en la solicitud Post Product',
      error: error.message
    });
  }
};

const putProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (req.file) {
      const imageUrl = product.image.split('/');
      const filename = imageUrl[imageUrl.length - 1];
      const publicId = filename.split('.')[0];

      await cloudinary.uploader.destroy(`SurfStore/${publicId}`);

      updateFields.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true
    });

    return res.status(200).json({
      message: 'Producto actualizado correctamente',
      producto: updatedProduct
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error en la solicitud Put Product',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDeleted = await Product.findByIdAndDelete(id);

    if (!productDeleted) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const imageUrl = productDeleted.image.split('/');
    const filename = imageUrl[imageUrl.length - 1];
    const publicId = filename.split('.')[0];
    await cloudinary.uploader.destroy(`SurfStore/${publicId}`);

    return res.status(200).json({
      message: 'Producto eliminado correctamente',
      producto: productDeleted
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error en la solicitud Deleted Product',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct
};
