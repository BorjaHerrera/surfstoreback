const { verifyJwt } = require('../config/jwt');
const User = require('../backend/models/users');

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json('No estás autorizado');
    }

    const parsedToken = token.split(' ')[1];

    if (!parsedToken) {
      return res.status(400).json('No estás autorizado: Token mal formado');
    }

    console.log(parsedToken);

    const { id } = verifyJwt(parsedToken);

    if (!id) {
      return res.status(400).json('No estás autorizado: Token inválido');
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json('No estás autorizado: Usuario no encontrado');
    }

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en el isAuth');
  }
};

const isAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (user.rol === 'admin') {
      user.password = null;
      req.user = user;
      return next();
    }
    return res.status(401).json('No tienes permisos de administrador');
  } catch (error) {
    console.log(error);
    return res.status(500).json('Error en isAdmin');
  }
};

//prettier-ignore
const isUserOrAdmin = (model, userField = 'user') => async (req, res, next) => {
    try {
      const { id } = req.params;

      if (model.modelName === 'users') {
        if (req.user._id.toString() === id || req.user.rol === 'admin') {
          console.log('Permisos concedidos: el usuario tiene acceso');
          return next();
        } else {
          return res
            .status(401)
            .json('No tienes permisos para eliminar este usuario');
        }
      }

      const resource = await model.findById(id);

      if (!resource) {
        console.log('Recurso no encontrado');
        return res.status(404).json({ message: 'Recurso no encontrado' });
      }
      console.log('Recurso encontrado:', resource);

      if (
        (resource[userField] &&
          resource[userField].toString() === req.user._id.toString()) ||
        req.user.rol === 'admin'
      ) {
        console.log(
          'Permisos concedidos: el recurso pertenece al usuario o el usuario es admin'
        );
        return next();
      }

      return res
        .status(401)
        .json('No tienes permisos para realizar esta acción');
    } catch (error) {
      console.log(error);
      return res.status(401).json('Error en isUserOrAdmin');
    }
  };

module.exports = { isAuth, isAdmin, isUserOrAdmin };
