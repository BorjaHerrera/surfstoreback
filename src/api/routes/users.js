const { isAuth, isUserOrAdmin, isAdmin } = require('../../middlewares/auth');
const {
  getUsers,
  register,
  login,
  getUserById,
  getUserCart,
  addCartProduct,
  putUser,
  deleteUser,
  deleteProductCart
} = require('../controllers/users');
const User = require('../models/users');

const usersRouter = require('express').Router();

usersRouter.post('/registro', register);
usersRouter.post('/login', login);

const protectUser = [isAuth, isUserOrAdmin(User)];

usersRouter.get('/:id/cart', protectUser, getUserCart);
usersRouter.get('/:id', protectUser, getUserById);
usersRouter.get('/', [isAuth, isAdmin], getUsers);

usersRouter.post('/:id/cart', protectUser, addCartProduct);

usersRouter.put('/:id', protectUser, putUser);

usersRouter.delete('/:id', protectUser, deleteUser);
usersRouter.delete('/:id/cart', protectUser, deleteProductCart);

module.exports = usersRouter;
