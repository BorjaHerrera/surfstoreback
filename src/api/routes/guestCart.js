const {
  getGuestCart,
  addGuestCartProduct,
  deleteGuestCartProduct
} = require('../controllers/guestCart');

guestCartRouter.get('/:cartId', getGuestCart);
guestCartRouter.post('/:cartId/product', addGuestCartProduct);
guestCartRouter.delete('/:cartId/product/:productId', deleteGuestCartProduct);

module.exports = guestCartRouter;
