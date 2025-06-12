const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    normalizedName: { type: String, unique: true },
    extraFields: { type: [String], default: [] }
  },
  {
    timestamps: true,
    collection: 'categories'
  }
);

categorySchema.pre('save', function (next) {
  if (!this.name) {
    return next(new Error('El campo "name" es obligatorio'));
  }

  if (this.isModified('name')) {
    this.normalizedName = this.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }

  next();
});

const Category = mongoose.model('categories', categorySchema, 'categories');
module.exports = Category;
