const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

const NotFoundError = require('../errors/not-found-error'); // код 404

router.post('/signin', validationLogin, login);

router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

module.exports = router;
