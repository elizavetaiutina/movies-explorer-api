const mongoose = require('mongoose');
// const validator = require('validator');

const { regExp } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExp.test(value),
      message: 'Некорректно введен url',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExp.test(value),
      message: 'Некорректно введен url',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExp.test(value),
      message: 'Некорректно введен url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
