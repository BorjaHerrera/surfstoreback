const { isAuth, isAdmin } = require('../../middlewares/auth');
const {
  postCategory,
  getCategories,
  getCategoryByName,
  getCategoryById,
  putCategory,
  deleteCategory,
  getCategoryBySlug,
  getCategoryFilters
} = require('../controllers/categories');

const categoriesRouter = require('express').Router();

const adminProtect = [isAuth, isAdmin];

categoriesRouter.get('/nombre/:name', getCategoryByName);
categoriesRouter.get('/id/:id', getCategoryById);
categoriesRouter.get('/filtradas', getCategoryFilters);
categoriesRouter.get('/:slug', getCategoryBySlug);
categoriesRouter.get('/', getCategories);
categoriesRouter.post('/', adminProtect, postCategory);
categoriesRouter.put('/:id', adminProtect, putCategory);
categoriesRouter.delete('/:id', adminProtect, deleteCategory);

module.exports = categoriesRouter;
