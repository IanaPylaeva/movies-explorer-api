const router = require('express').Router();
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

const {
  getAllMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getAllMovies); // возвращает все сохранённые текущим  пользователем фильмы

router.post('/movies', validationCreateMovie, createMovie); // создаёт фильм с переданными в теле данными

router.delete('/movies/:movieId', validationDeleteMovie, deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
