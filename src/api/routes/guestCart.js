const {
  getGuestCart,
  addGuestCartProduct,
  deleteGuestCartProduct,
  createGuestCart,
  updateGuestCartQuantity
} = require('../controllers/guestCart');

const guestCartRouter = require('express').Router();

guestCartRouter.get('/:cartId', getGuestCart);
guestCartRouter.post('/', createGuestCart);
guestCartRouter.post('/:cartId/product', addGuestCartProduct);
guestCartRouter.put('/:cartId/product/:productId', updateGuestCartQuantity);
guestCartRouter.delete('/:cartId/product/:productId', deleteGuestCartProduct);

module.exports = guestCartRouter;
