const Movie = require('../models/movie');
const ErrorBadRequest = require('../utils/errors/ErrorBadRequest');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const ErrorForbidden = require('../utils/errors/ErrorForbidden');
const {
  textErrorId, textBadRequest, textForbidden, textNotFoundId,
} = require('../utils/errors/textErrors');

// ВОЗВРАЩАЕТ ВСЕ СОХРАНЁННЫЕ ТЕКУЩИМ ПОЛЬЗОВАТЕЛЕМ ФИЛЬМЫ
const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

// СОЗДАЁТ ФИЛЬМ
const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((newMovie) => {
      res.send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(textBadRequest));
        return;
      }
      next(err);
    });
};

// УДАЛЯЕТ КАРТОЧКУ ПО ИДЕНТИФИКАТОРУ
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound(textNotFoundId);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ErrorForbidden(textForbidden);
      }
      return movie.deleteOne().then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest(textErrorId));
        return;
      }
      next(err);
    });
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
