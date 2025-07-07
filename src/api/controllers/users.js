const { generateSign } = require('../../config/jwt');
const Product = require('../models/products');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);

    const userDuplicated = await User.findOne({ email: req.body.email });

    if (userDuplicated) {
      return res.status(400).json({
        errorType: 'DUPLICATED_EMAIL',
        message: 'Este usuario ya existe'
      });
    }

    newUser.rol = 'user';

    const user = await newUser.save();

    const token = generateSign(user._id);

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user: user,
      token: token
    });
  } catch (error) {
    console.error('Error en el backend:', error);
    return res.status(400).json({
      errorType: 'OTHER_ERROR',
      message: 'Error durante el registro de usuario',
      error: error.message
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        errorType: 'INVALID_PASSWORD_OR_USER',
        message: 'Usuario o contraseña incorrectos'
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id);
      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json({
        errorType: 'INVALID_PASSWORD_OR_USER',
        message: 'Usuario o contraseña incorrectos'
      });
    }
  } catch (error) {
    return res.status(400).json({
      errorType: 'OTHER_ERROR',
      message: 'Error en el login de usuario'
    });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Users');
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json('Usuario no encontrado');
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en la solicitud Get user by Id');
  }
};

const getUserCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('cart');
    return res.status(200).json(user.cart);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get User Cart');
  }
};

const addCartProduct = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: 'Falta el ID del producto' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    const populatedUser = await user.populate('cart.product').execPopulate();

    return res.status(200).json({
      message: 'Producto añadido al carrito',
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, email, ...rest } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (email && email !== user.email) {
      return res.status(400).json({
        errorType: 'EMAIL_UPDATE_NOT_ALLOWED',
        message: 'No está permitido cambiar el email'
      });
    }

    if (password && password.trim() !== '') {
      user.password = password.trim();
    }

    Object.assign(user, rest);

    const updatedUser = await user.save();
    console.log('✅ Usuario actualizado en BBDD:', updatedUser);

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error en putUser:', error);
    return res.status(500).json({
      errorType: 'OTHER_ERROR',
      message: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Usuario eliminado',
      userDeleted
    });
  } catch (error) {
    return res.status(400).json('Error en la solicitud Delete User');
  }
};

const deleteProductCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const populatedUser = await user.populate('cart.product').execPopulate();

    return res.status(200).json({
      message: 'Producto eliminado del carrito',
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  getUserCart,
  addCartProduct,
  putUser,
  deleteUser,
  deleteProductCart
};
