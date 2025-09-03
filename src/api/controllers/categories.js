const Category = require('../models/categories');
const Product = require('../models/products');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Categories');
  }
};

const getCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Category by Name');
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ id });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Category by Id');
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Category by slug');
  }
};

const cleanArray = (valuesArray) =>
  valuesArray.filter((value) => value !== null && value !== undefined);

const getCategoryFilters = async (req, res) => {
  try {
    const { section } = req.query;
    if (!section) return res.status(400).json({ message: 'Falta la sección' });

    const category = await Category.findOne({ slug: section });
    if (!category) {
      console.log('No se encontró categoría con slug:', section);
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    const filters = { section: category._id };

    const aggregation = await Product.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          brands: { $addToSet: '$brand' },
          styles: { $addToSet: '$style' },
          genders: { $addToSet: '$gender' }
        }
      },
      { $project: { _id: 0, brands: 1, styles: 1, genders: 1 } } // 👈 coincide con $group
    ]);

    const result = aggregation[0] || { brands: [], styles: [], genders: [] };

    const cleanStyles = cleanArray(result.styles);
    const cleanGenders = cleanArray(result.genders);
    const cleanBrands = cleanArray(result.brands);

    // Siempre devolvemos todos los filtros posibles en singular
    const filtersToShow = {};
    if (cleanBrands.length) filtersToShow.brand = cleanBrands;
    if (cleanStyles.length) filtersToShow.style = cleanStyles;
    if (cleanGenders.length) filtersToShow.gender = cleanGenders;

    let filterKey = null;
    if (cleanStyles.length > 0) filterKey = 'style';
    else if (cleanGenders.length > 0) filterKey = 'gender';
    else if (cleanBrands.length > 0) filterKey = 'brand';

    return res.status(200).json({ filters: filtersToShow, filterKey });
  } catch (error) {
    console.error('Error en getCategoryFilters:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const postCategory = async (req, res, next) => {
  try {
    const { name, extraFields = [] } = req.body;

    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const existingCategory = await Category.findOne({ normalizedName });

    if (existingCategory) {
      return res.status(400).json({
        errorType: 'EXISTING_CATEGORY_ERROR',
        message: 'Esta categoría ya está publicada'
      });
    }

    const newCategory = new Category({
      name,
      extraFields
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: 'La nueva categoría se ha creado correctamente',
      categoría: savedCategory
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error en la solicitud Post Category',
      error: error.message
    });
  }
};

const putCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, ...rest } = req.body;

    let normalizedName;

    if (name) {
      normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

      const existingCategory = await Category.findOne({
        normalizedName,
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({
          errorType: 'EXISTING_CATEGORY_ERROR',
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    if (name) {
      category.name = name;
    }

    Object.assign(category, rest);

    const updatedCategory = await category.save();

    return res.status(200).json({
      message: 'Categoría actualizada correctamente',
      categoria: updatedCategory
    });
  } catch (error) {
    return res.status(400).json('Error en la solicitud Put Category');
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categoryDeleted = await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Categoría eliminada correctamente',
      cancion: categoryDeleted
    });
  } catch (error) {
    return res.status(404).json('Error en la solicitud Delete Category');
  }
};

module.exports = {
  getCategories,
  getCategoryByName,
  getCategoryById,
  getCategoryBySlug,
  getCategoryFilters,
  postCategory,
  putCategory,
  deleteCategory
};
