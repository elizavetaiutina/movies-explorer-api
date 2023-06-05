const signRouter = require('express').Router();

const { login, createUser } = require('../controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validation');

signRouter.post('/signin', validateLogin, login);
signRouter.post('/signup', validateCreateUser, createUser);

module.exports = signRouter;
