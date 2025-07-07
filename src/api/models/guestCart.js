const mongoose = require('mongoose');

const guestCartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'guestCarts'
  }
);
const GuestCart = mongoose.model('guestCarts', guestCartSchema, 'guestCarts');

module.exports = GuestCart;
