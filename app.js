const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');

const ErrorNotFound = require('./utils/errors/ErrorNotFound');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handlerError = require('./middlewares/handlerError');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT } = require('./utils/constants');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth); // авторизация

app.use(router);

app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существет'));
});

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
