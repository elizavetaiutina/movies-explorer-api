const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorBadRequest = require('../utils/errors/ErrorBadRequest');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const ErrorConflict = require('../utils/errors/ErrorConflict');
const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');
const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorUnauthorized('Неправильные email или пароль');
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          },
        ); // создадим токен
        return res.status(200).send({ token }); // вернём токен
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
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id пользователя'));
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
        next(new ErrorConflict('Данный email уже существует в базе'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
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
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
        return;
      }
      next(err);
    });
};

// ВОЗВРАЩАЕТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports = {
  login,
  getInfoUser,
  createUser,
  updateProfile,
  getUsers,
};
