const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const router = require('./routes');
const handlerError = require('./middlewares/handlerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, urlDB } = require('./utils/constants');
const limiter = require('./middlewares/expressRateLimit');

const app = express();

mongoose.connect(urlDB);

app.use(helmet());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
