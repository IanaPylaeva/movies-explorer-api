const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-error'); // код 400
const NotFoundError = require('../errors/not-found-error'); // код 404
const ForbiddenError = require('../errors/forbidden-error'); // код 403

/* Получить все сохраненные пользователем фильмы */
module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((error) => next(error));
};

/* Создать фильм с переданной в теле информацией */
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании фильма'));
      }
      return next(error);
    });
};

/* Удалить сохраненный фильм по ID */
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return movie.remove()
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Переданы некорректные данные'));
      }
      return next(error);
    });
};
