const router = require('express').Router();
const signRouter = require('./sign');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const { textNotFoundPage } = require('../utils/errors/textErrors');

router.use(signRouter);

router.use(auth); // авторизация

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new ErrorNotFound(textNotFoundPage));
});

module.exports = router;
