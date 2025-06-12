const { isAuth, isAdmin } = require('../../middlewares/auth');
const upload = require('../../middlewares/file');
const {
  getProducts,
  getProductById,
  putProduct,
  postProduct,
  deleteProduct
} = require('../controllers/products');

const productsRouter = require('express').Router();

const adminProtect = [isAuth, isAdmin];

productsRouter.get('/:categorySlug/:id', getProductById);
productsRouter.get('/', getProducts);
productsRouter.post('/', adminProtect, upload.single('image'), postProduct);
productsRouter.put('/:id', adminProtect, upload.single('image'), putProduct);
productsRouter.delete('/:id', adminProtect, deleteProduct);

module.exports = productsRouter;
