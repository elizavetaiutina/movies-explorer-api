const usersRouter = require('express').Router();
const {
  getInfoUser, updateProfile,
} = require('../controllers/users');
const {
  validateUpdateProfile,
} = require('../middlewares/validation');

usersRouter.get('/me', getInfoUser); // возвращает информацию о пользователе (email и имя)
usersRouter.patch('/me', validateUpdateProfile, updateProfile);

module.exports = usersRouter;
