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
    cart: [{ type: mongoose.Types.ObjectId, ref: 'products' }]
  },
  {
    timestamps: true,
    collecion: 'users'
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
