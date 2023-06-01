const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Необходима авторизация !!!'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
