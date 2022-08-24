const mongoose = require('mongoose'); // Зададим схему для карточки через Mongoose
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // это строка
    required: true, // обязательное поле
  },
  director: {
    type: String, // это строка
    required: true, // обязательное поле
  },
  duration: {
    type: Number, // это число
    required: true, // обязательное поле
  },
  year: {
    type: String, // это строка
    required: true, // обязательное поле
  },
  description: {
    type: String, // это строка
    required: true, // обязательное поле
  },
  image: {
    type: String, // это строка
    required: true, // обязательное поле
    validate: validator.isURL,
  },
  trailerLink: {
    type: String, // это строка
    required: true, // обязательное поле
    validate: validator.isURL,
  },
  thumbnail: {
    type: String, // это строка
    required: true, // обязательное поле
    validate: validator.isURL,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // пользователь, который сохранил фильм
    required: true, // обязательное поле
  },
  movieId: {
    type: String, // это строка
    required: true, // обязательное поле
  },
  nameRU: {
    type: String, // это строка
  },
  nameEN: {
    type: String, // это строка
  },
});

module.exports = mongoose.model('card', movieSchema);
