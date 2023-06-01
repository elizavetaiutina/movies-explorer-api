const moviesRouter = require('express').Router();
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateCreateMovie,
  validateMovie,
} = require('../middlewares/validation');

moviesRouter.post('/', validateCreateMovie, createMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
moviesRouter.get('/', getSavedMovies); // возвращает все сохранённые текущим  пользователем фильмы
moviesRouter.delete('/:_id', validateMovie, deleteMovie); // удаляет сохранённый фильм по id

module.exports = moviesRouter;
