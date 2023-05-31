const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateLogin = celebrate({
});

const validateCreateMovie = celebrate({
});

const validateMovie = celebrate({
});

module.exports = {
  validateCreateUser,
  validateUpdateProfile,
  validateLogin,
  validateCreateMovie,
  validateMovie,
};
