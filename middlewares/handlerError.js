// Централизованный обработчик ошибок
const { textErrorServer } = require('../utils/errors/textErrors');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err; // если у ошибки нет статуса, выставляем 500

  res.status(statusCode).send({
    message: statusCode === 500 ? textErrorServer : message,
  });
  next();
};
