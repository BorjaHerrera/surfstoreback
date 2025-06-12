const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'categories'
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    style: { type: String, required: false, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    gender: { type: String, required: false, trim: true }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

const Product = mongoose.model('products', productSchema, 'products');
module.exports = Product;
