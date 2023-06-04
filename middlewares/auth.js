const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = require('../utils/constants');
const { textUnauthorized } = require('../utils/errors/textErrors');
const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized(textUnauthorized));
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
    next(new ErrorUnauthorized(textUnauthorized));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
