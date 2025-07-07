const {
  getGuestCart,
  addGuestCartProduct,
  deleteGuestCartProduct,
  createGuestCart
} = require('../controllers/guestCart');

const guestCartRouter = require('express').Router();

guestCartRouter.get('/:cartId', getGuestCart);
guestCartRouter.post('/', createGuestCart); // POST /cart
guestCartRouter.post('/:cartId/product', addGuestCartProduct);
guestCartRouter.delete('/:cartId/product/:productId', deleteGuestCartProduct);

module.exports = guestCartRouter;
