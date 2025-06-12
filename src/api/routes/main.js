const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const songsRouter = require('./songs');
const usersRouter = require('./users');

const mainRouter = require('express').Router();

mainRouter.use('/categorias', categoriesRouter);
mainRouter.use('/productos', productsRouter);
mainRouter.use('/usuarios', usersRouter);
mainRouter.use('/canciones', songsRouter);

module.exports = mainRouter;
