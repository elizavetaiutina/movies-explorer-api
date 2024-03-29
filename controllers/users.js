const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorBadRequest = require('../utils/errors/ErrorBadRequest');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const ErrorConflict = require('../utils/errors/ErrorConflict');
const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');
const {
  textErrorId, textUnauthorized, textNotFoundId, textBadRequest, textConflict,
} = require('../utils/errors/textErrors');
const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized(textUnauthorized);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorUnauthorized(textUnauthorized);
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          },
        ); // создадим токен
        return res.status(200).send({ token });
      });
    })
    .catch((err) => next(err));
};

// ВОЗВРАЩАЕТ ИНФОРМАЦИЮ О ТЕКУЩЕМ ПОЛЬЗОВАТЕЛЕ
const getInfoUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(textNotFoundId);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest(textErrorId));
        return;
      }
      next(err);
    });
};

// СОЗДАЁТ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res, next) => {
  const {
    email,
    name,
    password,
  } = req.body;

  // хешируем пароль
  bcrypt
    .hash(password, 10)
    .then(
      (hash) => User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((newUser) => {
      res.send({
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict(textConflict));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(textBadRequest));
        return;
      }
      next(err);
    });
};

// ОБНОВЛЯЕТ ДАННЫЕ ПРОФИЛЯ
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        throw new ErrorNotFound(textNotFoundId);
      }
      return res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(textBadRequest));
        return;
      }
      next(err);
    });
};

module.exports = {
  login,
  getInfoUser,
  createUser,
  updateProfile,
};
