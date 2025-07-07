const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      match: /.+\@.+\..+/
    },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    rol: { type: String, required: true, enum: ['admin', 'user'] },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

const User = mongoose.model('users', userSchema, 'users');
module.exports = User;
