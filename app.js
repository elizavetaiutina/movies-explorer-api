const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const router = require('./routes');
const handlerError = require('./middlewares/handlerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT, urlMongodb, NODE_ENV, URL_MONGODB_PRODUCTION,
} = require('./utils/constants');
const limiter = require('./middlewares/expressRateLimit');
const cors = require('./middlewares/cors');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? URL_MONGODB_PRODUCTION : urlMongodb);

app.use(helmet());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(cors);

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
